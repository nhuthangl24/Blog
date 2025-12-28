"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, RefreshCw, Database } from "lucide-react";

export default function SQLiBasicsChallenge() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("SELECT * FROM users WHERE username = '' AND password = ''");

  // Simulate the SQL query update in real-time for educational purposes
  useEffect(() => {
    setQuery(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);
  }, [username, password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // SIMULATED VULNERABLE BACKEND LOGIC
    // In a real scenario, this would be on the server.
    // We are simulating a naive SQL parser here.
    
    const simulatedDB = [
      { id: 1, username: "admin", password: "supersecretpassword", role: "admin" },
      { id: 2, username: "user", password: "user123", role: "user" }
    ];

    // Check for SQL Injection signature: ' --
    // This is a simplified simulation.
    // If the username contains "' --", we treat it as a successful comment injection.
    
    let user = null;

    if (username.includes("' --") || username.includes("'--")) {
      // Extract the part before the comment
      const injectedUsername = username.split("'")[0];
      
      // Find user by username only (ignoring password because of the comment)
      user = simulatedDB.find(u => u.username === injectedUsername);
      
      if (user) {
        setStatus("success");
        setMessage(`Welcome back, ${user.username}! You have successfully bypassed the authentication.`);
      } else {
        setStatus("error");
        setMessage("User not found (even with injection).");
      }
    } else {
      // Normal login check
      user = simulatedDB.find(u => u.username === username && u.password === password);
      
      if (user) {
        setStatus("success");
        setMessage(`Login successful as ${user.username}. (But this wasn't an injection!)`);
      } else {
        setStatus("error");
        setMessage("Invalid credentials.");
      }
    }
  };

  const handleReset = () => {
    setUsername("");
    setPassword("");
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="container max-w-2xl py-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vulnerable Login Portal</h1>
          <p className="text-muted-foreground">Internal Employee Access</p>
        </div>
        <Button variant="outline" onClick={handleReset} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Lab
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please enter your credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input 
                  placeholder="admin" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>

        {/* Debug View / Educational View */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-mono">Backend Query Monitor</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <code className="block bg-black text-green-400 p-4 rounded-md font-mono text-sm break-all">
              {query}
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              * This panel shows how your input is being interpreted by the database query.
            </p>
          </CardContent>
        </Card>

        {status !== "idle" && (
          <Alert variant={status === "success" ? "default" : "destructive"} className={status === "success" ? "border-green-500 bg-green-500/10" : ""}>
            {status === "success" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{status === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
