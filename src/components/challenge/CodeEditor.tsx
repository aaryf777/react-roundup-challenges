import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Download, Maximize2, Minimize2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
  testCases?: Array<{ input: any[]; expected: any }>;
  functionName?: string;
  hideRunButton?: boolean;
  onCodeChange?: (code: string) => void;
  output?: string;
  consoleLogs?: string[];
  onRun?: () => void;
  onSubmit?: () => void;
}

export type CodeEditorHandle = {
  setActiveTab: (tab: string) => void;
  getActiveTab: () => string;
};

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  (
    {
      initialCode = "// Write your solution here\nfunction solution() {\n  \n}",
      language = "javascript",
      readOnly = false,
      testCases = [],
      functionName = "solution",
      hideRunButton = false,
      onCodeChange,
      output: externalOutput,
      consoleLogs: externalConsoleLogs,
      onRun,
      onSubmit,
    },
    ref
  ) => {
    const [code, setCode] = useState(initialCode);
    const [internalOutput, setInternalOutput] = useState("");
    const [internalConsoleLogs, setInternalConsoleLogs] = useState<string[]>(
      []
    );
    const { theme } = useTheme();

    // Use external output/logs if provided, otherwise use internal state
    const output =
      externalOutput !== undefined ? externalOutput : internalOutput;
    const consoleLogs =
      externalConsoleLogs !== undefined
        ? externalConsoleLogs
        : internalConsoleLogs;
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState("code");
    const [isFullscreen, setIsFullscreen] = useState(false);

    // ESC key handler for fullscreen exit
    useEffect(() => {
      if (!isFullscreen) return;
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFullscreen(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [isFullscreen]);

    useImperativeHandle(ref, () => ({
      setActiveTab,
      getActiveTab: () => activeTab,
    }));

    const handleCodeChange = (value: string | undefined) => {
      const newCode = value || "";
      setCode(newCode);
      onCodeChange?.(newCode);
    };

    // Get Monaco theme based on app theme
    const monacoTheme = theme === "dark" ? "vs-dark" : "vs-dark";

    const handleFormat = async () => {
      try {
        const formatted = await prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
          singleQuote: true,
          semi: true,
        });
        setCode(formatted);
      } catch (err) {
        setInternalOutput(
          "❌ Error formatting code: " + (err as Error).message
        );
        setActiveTab("output");
      }
    };

    const handleRun = async () => {
      setIsRunning(true);
      setInternalConsoleLogs([]);
      let logs: string[] = [];

      const customConsole = {
        log: (...args: any[]) => {
          logs.push(
            args
              .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
              .join(" ")
          );
        },
      };

      const originalConsoleLog = console.log;
      console.log = customConsole.log; // globally override

      let results: string[] = [];
      let allPassed = true;
      let execTime = 0;
      let memUsage: string = "-";

      try {
        const runner = new Function(
          "testCases",
          "console",
          `"use strict";
        ${code}
        return (async () => {
          const results = [];
          const fn = typeof ${functionName} === 'function' ? ${functionName} : globalThis['${functionName}'];
          for (let i = 0; i < testCases.length; i++) {
            const { input, expected } = testCases[i];
            let got, pass;
            try {
              got = fn(...input);
              if (got && typeof got.then === 'function') {
                got = await got;
              }
              pass = JSON.stringify(got) === JSON.stringify(expected);
            } catch (err) {
              got = String(err);
              pass = false;
            }
            results.push({ got, pass, expected });
          }
          return results;
        })();`
        );

        const start = performance.now();
        const runResults = await runner(testCases, customConsole);
        execTime = Math.round(performance.now() - start);

        for (let i = 0; i < runResults.length; i++) {
          const { got, pass, expected } = runResults[i];
          if (!pass) allPassed = false;
          results.push(
            `Test Case ${i + 1}: ${pass ? "✅" : "❌"} Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(got)}`
          );
        }

        if (window.performance && (performance as any).memory) {
          memUsage = (
            (performance as any).memory.usedJSHeapSize /
            1024 /
            1024
          ).toFixed(1);
        }
      } catch (err: any) {
        results.push(`❌ Error during execution: ${err.message}`);
        allPassed = false;
      } finally {
        console.log = originalConsoleLog; // restore original
      }

      setInternalOutput(
        `${allPassed ? "✅ All test cases passed!" : "❌ Some test cases failed."}\n\n${results.join(
          "\n"
        )}\n\nExecution time: ${execTime}ms\nMemory usage: ${memUsage}MB`
      );
      setInternalConsoleLogs([...logs]);
      setActiveTab("output");
      setIsRunning(false);
    };

    const handleReset = () => {
      setCode(initialCode);
      setInternalOutput("");
    };

    return (
      <div className="space-y-4 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Language:</span>
            <span className="text-sm text-muted-foreground capitalize">
              {language}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleFormat}>
              Format
            </Button>
            {!hideRunButton && (
              <Button
                id="run-code-btn"
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
                className="bg-gradient-primary hover:shadow-glow"
              >
                <Play className="h-4 w-4 mr-1" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            )}
          </div>
        </div>

        <Tabs
          defaultValue="code"
          className="space-y-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code">Code Editor</TabsTrigger>
            <TabsTrigger value="output">Output & Tests</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-0">
            <div
              className={
                isFullscreen
                  ? "fixed inset-0 z-50 bg-background flex flex-col"
                  : "relative"
              }
            >
              <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="p-1 rounded hover:bg-muted border border-border"
                  title={
                    isFullscreen ? "Exit Fullscreen" : "Expand to Fullscreen"
                  }
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <span className="text-xs text-muted-foreground">
                  Lines: {code.split("\n").length}
                </span>
              </div>
              <MonacoEditor
                height={isFullscreen ? "calc(100vh - 120px)" : "600px"}
                defaultLanguage={language}
                value={code}
                onChange={handleCodeChange}
                theme={monacoTheme}
                options={{
                  readOnly,
                  fontSize: 14,
                  fontFamily:
                    "JetBrains Mono, Fira Code, Cascadia Code, monospace",
                  minimap: { enabled: false },
                  wordWrap: "on",
                  automaticLayout: true,
                  autoClosingBrackets: "always",
                  autoIndent: "full",
                  formatOnType: true,
                  formatOnPaste: true,
                  suggestOnTriggerCharacters: true,
                  tabSize: 2,
                }}
              />
              {/* Run/Submit buttons in fullscreen */}
              {isFullscreen && (
                <div className="flex justify-end space-x-2 mt-2 px-6 pb-6">
                  <Button
                    className="w-28 bg-gradient-primary hover:shadow-glow"
                    onClick={() => {
                      setIsFullscreen(false);
                      onRun?.();
                    }}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                  <Button
                    className="w-28 bg-gradient-primary hover:shadow-glow"
                    onClick={() => {
                      setIsFullscreen(false);
                      onSubmit?.();
                    }}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="output" className="space-y-0">
            <div className="h-[600px] p-4 bg-code-bg text-code-text border border-border rounded-md overflow-auto">
              {output ? (
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Run your code to see the output and test results</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="console" className="space-y-0">
            <div className="h-[600px] p-4 bg-code-bg text-code-text border border-border rounded-md overflow-auto">
              {consoleLogs.length > 0 ? (
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {consoleLogs.join("\n")}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No console output yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

export default CodeEditor;
