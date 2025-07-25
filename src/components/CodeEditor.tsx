import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
}

const CodeEditor = ({ 
  initialCode = "// Write your solution here\nfunction solution() {\n  \n}", 
  language = "javascript",
  readOnly = false 
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput("✅ All test cases passed!\n\nTest Case 1: ✅ Expected: [1,2,3], Got: [1,2,3]\nTest Case 2: ✅ Expected: [4,5,6], Got: [4,5,6]\nTest Case 3: ✅ Expected: [], Got: []\n\nExecution time: 45ms\nMemory usage: 2.1MB");
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Language:</span>
          <span className="text-sm text-muted-foreground capitalize">{language}</span>
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
          <Button 
            size="sm" 
            onClick={handleRun}
            disabled={isRunning}
            className="bg-gradient-primary hover:shadow-glow"
          >
            <Play className="h-4 w-4 mr-1" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="code" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code">Code Editor</TabsTrigger>
          <TabsTrigger value="output">Output & Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="space-y-0">
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              readOnly={readOnly}
              className="w-full h-80 p-4 font-mono text-sm bg-code-bg text-code-text border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{
                tabSize: 2,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace"
              }}
              placeholder="Write your code here..."
            />
            <div className="absolute top-2 right-2 text-xs text-muted-foreground">
              Lines: {code.split('\n').length}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="output" className="space-y-0">
          <div className="h-80 p-4 bg-code-bg text-code-text border border-border rounded-md overflow-auto">
            {output ? (
              <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Run your code to see the output and test results</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;