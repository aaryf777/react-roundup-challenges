import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeEditor, { CodeEditorHandle } from "./CodeEditor";
import { Play } from "lucide-react";

interface ChallengeEditorProps {
  initialCode: string;
  functionName: string;
  testCases: Array<{ input: any[]; expected: any }>;
  onSubmitSolution?: () => void;
}

const ChallengeEditor = ({
  initialCode,
  functionName,
  testCases,
  onSubmitSolution,
}: ChallengeEditorProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const codeEditorRef = useRef<CodeEditorHandle>(null);

  const handleRun = async () => {
    setIsRunning(true);
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
    console.log = customConsole.log;

    let results: string[] = [];
    let allPassed = true;
    let execTime = 0;
    let memUsage: string = "-";

    try {
      const runner = new Function(
        "testCases",
        "customConsole",
        `"use strict";
${currentCode}

return (async () => {
  const results = [];
  const fn = typeof ${functionName} === 'function' ? ${functionName} : globalThis['${functionName}'];
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    customConsole.log(...args);
    originalConsoleLog(...args);
  };
  
  for (let i = 0; i < testCases.length; i++) {
    const { input, expected } = testCases[i];
    let got, pass;
    try {
      let result = fn(...input);
      if (result && typeof result.then === 'function') {
        got = await result;
      } else {
        got = result;
      }
      pass = JSON.stringify(got) === JSON.stringify(expected);
    } catch (err) {
      got = String(err);
      pass = false;
    }
    results.push({ got, pass, expected });
  }

  console.log = originalConsoleLog;
  return results;
})();`
      );

      const start = performance.now();
      const runResults = await runner(testCases, customConsole);
      for (let i = 0; i < runResults.length; i++) {
        const { got, pass, expected } = runResults[i];
        if (!pass) allPassed = false;
        results.push(
          `Test Case ${i + 1}: ${pass ? "✅" : "❌"} Expected: ${JSON.stringify(
            expected
          )}, Got: ${JSON.stringify(got)}`
        );
      }
      execTime = Math.round(performance.now() - start);

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
      console.log = originalConsoleLog;
    }

    const outputText = `${allPassed ? "✅ All test cases passed!" : "❌ Some test cases failed."}\n\n${results.join(
      "\n"
    )}\n\nExecution time: ${execTime}ms\nMemory usage: ${memUsage}MB`;

    setOutput(outputText);
    setConsoleLogs(logs);
    setIsRunning(false);
    codeEditorRef.current?.setActiveTab("output");
  };

  return (
    <div className="space-y-6 h-[93vh] overflow-none flex flex-col justify-between">
      <Card className=" border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Code Editor</CardTitle>
        </CardHeader>
        <CardContent className="h-60">
          <CodeEditor
            ref={codeEditorRef}
            initialCode={initialCode}
            functionName={functionName}
            testCases={testCases}
            hideRunButton
            onCodeChange={setCurrentCode}
            output={output}
            consoleLogs={consoleLogs}
            onRun={handleRun}
            onSubmit={onSubmitSolution}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 p-4">
        <Button
          className="w-28 bg-gradient-primary hover:shadow-glow"
          onClick={handleRun}
          disabled={isRunning}
        >
          <Play className="h-4 w-4 mr-1" />
          {isRunning ? "Running..." : "Run"}
        </Button>
        <Button
          className="w-28 bg-gradient-primary hover:shadow-glow"
          onClick={onSubmitSolution}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ChallengeEditor;
