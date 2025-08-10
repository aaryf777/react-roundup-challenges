// CodeEditor.tsx
import React, { useState, useEffect, useCallback, memo } from "react";
import MonacoEditor from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Challenge } from "../../contexts/ChallengesContext";
import { useAuth } from "../../contexts/AuthContext";
import { submissionService } from "../../lib/firestore";
import { useTheme } from "../../contexts/ThemeContext";

interface RunResult {
  name: string;
  status: "success" | "failure" | "error";
  message?: string;
}

interface WorkerOutput {
  results: RunResult[];
  logs: string[];
  executionTime: number;
  testCasesPassed: number;
  totalTestCases: number;
}

interface CodeEditorProps {
  challenge: Challenge;
  onCodeChange: (newCode: string) => void;
  code: string;
  onSubmit?: (submission: any) => Promise<void>;
}

const CodeEditor: React.FC<CodeEditorProps> = memo(
  ({ challenge, onCodeChange, code, onSubmit }) => {
    const [output, setOutput] = useState<RunResult[]>([]);
    const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("code");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [lastRunDetails, setLastRunDetails] = useState<{
      testCasesPassed: number;
      totalTestCases: number;
      executionTime: number;
    } | null>(null);

    const { user } = useAuth();
    const { toast } = useToast();
    const { theme } = useTheme();

    const handleCodeChange = (value: string | undefined) => {
      onCodeChange(value || "");
    };

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isFullscreen) {
          setIsFullscreen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isFullscreen]);

    /**
     * runCode
     * - Spawns a worker and posts code + testCode
     * - Accepts worker messages of either:
     *    { type: 'result', payload: WorkerOutput }
     *    or the older/unwrapped shape: WorkerOutput directly
     * - Rejects on timeout or worker errors
     */
    const runCode = useCallback(
      (testCode: string): Promise<WorkerOutput> => {
        return new Promise((resolve, reject) => {
          const workerPath = "../../workers/code-runner.ts";
          const worker = new Worker(new URL(workerPath, import.meta.url));
          let settled = false;

          const cleanup = () => {
            try {
              worker.terminate();
            } catch {
              // ignore
            }
          };

          const timeout = setTimeout(() => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error("Code execution timed out after 10 seconds."));
          }, 10000);

          worker.onmessage = (e: MessageEvent) => {
            if (settled) return;
            // Worker might send { type: 'result', payload } or direct payload
            const data = e.data as any;

            // If worker posts error type
            if (data && data.type === "error") {
              settled = true;
              clearTimeout(timeout);
              cleanup();
              const errMsg = data.payload?.message || "Worker error";
              reject(new Error(errMsg));
              return;
            }

            // Normalize payload
            const payload: any =
              data && data.type === "result" && data.payload
                ? data.payload
                : data;

            // Validate payload shape
            if (
              !payload ||
              !("results" in payload) ||
              !("logs" in payload) ||
              !("executionTime" in payload)
            ) {
              // Unexpected shape — return as error
              settled = true;
              clearTimeout(timeout);
              cleanup();
              reject(
                new Error(
                  "Unexpected worker response shape. See console for details."
                )
              );
              return;
            }

            settled = true;
            clearTimeout(timeout);
            cleanup();

            // Ensure arrays/defaults
            const normalized: WorkerOutput = {
              results: Array.isArray(payload.results) ? payload.results : [],
              logs: Array.isArray(payload.logs) ? payload.logs : [],
              executionTime: Number(payload.executionTime) || 0,
              testCasesPassed: Number(payload.testCasesPassed) || 0,
              totalTestCases: Number(payload.totalTestCases) || 0,
            };
            resolve(normalized);
          };

          worker.onerror = (err: ErrorEvent | any) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            cleanup();
            // err.message sometimes missing for ErrorEvent
            const message =
              (err && err.message) ||
              (err && err.error && err.error.message) ||
              "Worker runtime error";
            reject(new Error(message));
          };

          // Post the payload. For promise-based tests, the worker should
          // be wrapping test execution in an async IIFE (worker responsibility).
          worker.postMessage({
            code,
            testCode,
            functionName: challenge.functionName,
          });
        });
      },
      [code, challenge.functionName]
    );

    const handleRun = async () => {
      setIsRunning(true);
      setActiveTab("output");
      try {
        // testCode should be a JS string (describe/test/expect...). If your challenge test cases
        // are stored as structured objects, convert them into a JS test string upstream.
        const testCode =
          typeof challenge.testCases === "string"
            ? challenge.testCases
            : // If non-string, fallback to empty string (worker should handle)
              "";

        const {
          results,
          logs,
          executionTime,
          testCasesPassed,
          totalTestCases,
        } = await runCode(testCode);

        setOutput(results);
        setConsoleLogs(logs || []);
        setLastRunDetails({
          testCasesPassed,
          totalTestCases,
          executionTime,
        });
      } catch (error: unknown) {
        console.error("Run error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        const errorResults = (error as any)?.results || [
          { name: "Execution Error", status: "error", message: errorMessage },
        ];
        const errorLogs = (error as any)?.logs || [errorMessage];

        setOutput(errorResults);
        setConsoleLogs(
          Array.isArray(errorLogs) ? errorLogs.flat() : [String(errorLogs)]
        );
      } finally {
        setIsRunning(false);
      }
    };

    const handleSubmit = async () => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to submit a solution.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      setActiveTab("output");

      try {
        const testCode =
          typeof challenge.testCases === "string" ? challenge.testCases : "";

        const {
          results,
          logs,
          executionTime,
          testCasesPassed,
          totalTestCases,
        } = await runCode(testCode);

        setOutput(results);
        setConsoleLogs(logs || []);
        setLastRunDetails({
          testCasesPassed,
          totalTestCases,
          executionTime,
        });

        let status: "accepted" | "failed" | "partial_accepted";
        if (testCasesPassed === totalTestCases && totalTestCases > 0) {
          status = "accepted";
        } else if (testCasesPassed === 0) {
          status = "failed";
        } else {
          status = "partial_accepted";
        }

        const points =
          totalTestCases > 0
            ? Math.round((challenge.points / totalTestCases) * testCasesPassed)
            : 0;

        const submissionData = {
          userId: user.id,
          challengeId: challenge.id,
          code,
          language: "javascript",
          status,
          executionTime,
          memoryUsage: 0,
          testCasesPassed,
          totalTestCases,
          points,
        };

        if (onSubmit) {
          await onSubmit(submissionData);
        } else {
          const { userId, challengeId, ...restOfData } = submissionData;
          await submissionService.createSubmission(
            userId,
            challengeId,
            restOfData as any
          );
        }

        toast({
          title: "Submission Successful!",
          description: "Your solution has been submitted and saved.",
        });
      } catch (error: unknown) {
        console.error("Submission error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unknown submission error occurred.";
        const errorResults = (error as any)?.results || [
          { name: "Submission Error", status: "error", message: errorMessage },
        ];
        const errorLogs = (error as any)?.logs || [errorMessage];

        setOutput(errorResults);
        setConsoleLogs(
          Array.isArray(errorLogs) ? errorLogs.flat() : [String(errorLogs)]
        );
        toast({
          title: "Submission Failed",
          description: errorMessage || "An error occurred during submission.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleReset = () => {
      onCodeChange(challenge.starterCode);
      setOutput([]);
      setConsoleLogs([]);
      setLastRunDetails(null);
      setActiveTab("code");
    };

    const handleFormat = async () => {
      try {
        const formattedCode = await prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
          semi: true,
          singleQuote: false,
        });
        onCodeChange(formattedCode);
      } catch (error) {
        console.error("Failed to format code:", error);
      }
    };

    const monacoTheme = theme === "dark" ? "vs-dark" : "light";

    return (
      <div
        className={`flex flex-col h-full ${
          isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
        }`}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-grow flex flex-col"
        >
          <div className="flex justify-between items-center p-2 border-b border-border">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleFormat}>
                Format
              </Button>
              <Button
                onClick={handleRun}
                disabled={isRunning}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running..." : "Run"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isRunning}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex-grow overflow-auto">
            <TabsContent value="code" className="h-full m-0">
              <MonacoEditor
                height="100%"
                language="javascript"
                theme={monacoTheme}
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                }}
              />
            </TabsContent>

            <TabsContent value="output" className="p-4 h-full overflow-auto">
              {isRunning ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Running tests...</p>
                </div>
              ) : output?.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Results</h3>
                    {lastRunDetails && (
                      <div className="text-sm text-muted-foreground">
                        <span>
                          {lastRunDetails.testCasesPassed} /{" "}
                          {lastRunDetails.totalTestCases} tests passed
                        </span>
                        <span className="mx-2">|</span>
                        <span>
                          {(lastRunDetails.executionTime / 1000).toFixed(2)}s
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {output.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-md bg-muted/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {result.status === "success" ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <p className="font-semibold text-sm">
                              {result.name}
                            </p>
                          </div>
                          <Badge
                            variant={
                              result.status === "success"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              result.status === "success"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200"
                                : ""
                            }
                          >
                            {result.status.toUpperCase()}
                          </Badge>
                        </div>
                        {(result.status === "failure" ||
                          result.status === "error") &&
                          result.message && (
                            <pre className="mt-2 text-xs bg-background p-2 rounded-md whitespace-pre-wrap text-red-500 dark:text-red-400">
                              {result.message}
                            </pre>
                          )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Run code to see the output here.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="console" className="p-4 h-full bg-muted/50">
              <pre className="text-sm whitespace-pre-wrap">
                {consoleLogs.length > 0
                  ? consoleLogs.join("\n")
                  : "Console output will appear here."}
              </pre>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }
);

export default CodeEditor;
