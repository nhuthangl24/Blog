"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Flag, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface FlagSubmissionProps {
  correctFlag: string;
  onSolved?: () => void;
}

export default function FlagSubmission({ correctFlag, onSolved }: FlagSubmissionProps) {
  const [inputFlag, setInputFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputFlag.trim() === correctFlag) {
      setStatus("success");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onSolved) onSolved();
    } else {
      setStatus("error");
    }
  };

  return (
    <Card className="border-2 border-yellow-500/20 bg-yellow-500/5 mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-500">
          <Flag className="w-5 h-5" />
          Gửi Flag
        </CardTitle>
        <CardDescription>
          Sau khi khai thác thành công, bạn sẽ nhận được một flag. Nhập nó vào đây để hoàn thành bài lab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            placeholder="FLAG{...}"
            value={inputFlag}
            onChange={(e) => setInputFlag(e.target.value)}
            className="font-mono"
          />
          <Button type="submit" variant={status === "success" ? "default" : "secondary"}>
            Gửi
          </Button>
        </form>

        {status === "success" && (
          <Alert className="mt-4 border-green-500 bg-green-500/10 text-green-500">
            <CheckCircle2 className="w-4 h-4" />
            <AlertTitle>Chính xác!</AlertTitle>
            <AlertDescription>Chúc mừng bạn đã hoàn thành bài lab này.</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mt-4 border-red-500 bg-red-500/10 text-red-500">
            <XCircle className="w-4 h-4" />
            <AlertTitle>Sai Flag</AlertTitle>
            <AlertDescription>Vui lòng kiểm tra lại flag của bạn.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
