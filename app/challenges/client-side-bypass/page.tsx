"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Server,
  ArrowRight,
  FileCode,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FlagSubmission from "@/components/FlagSubmission";

export default function ClientSideBypassChallenge() {
  const [activeTab, setActiveTab] = useState("browser");
  const [interceptOn, setInterceptOn] = useState(true);
  const [pendingRequest, setPendingRequest] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "fail">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("vulnerable-website.com/upload");
  const [pageContent, setPageContent] = useState<"upload" | "view-file">("upload");

  // Proxy state
  const [proxyContent, setProxyContent] = useState("");

  useEffect(() => {
    // Generate a random flag on client side for this demo
    setFlag("FL_" + Math.random().toString(36).substring(2, 15).toUpperCase());
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // CLIENT-SIDE VALIDATION
    if (!file.name.endsWith(".jpg") && !file.name.endsWith(".png")) {
      alert("Lỗi: Chỉ cho phép file .jpg và .png!");
      e.target.value = ""; // Reset input
      return;
    }

    // If validation passes, prepare request
    const requestBody = `POST /upload HTTP/1.1
Host: vulnerable-website.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Length: ${file.size + 200}

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="${file.name}"
Content-Type: image/jpeg

[BINARY DATA OF ${file.name}]
------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    if (interceptOn) {
      setPendingRequest({ file });
      setProxyContent(requestBody);
      setActiveTab("proxy");
      setMessage("Request đã bị chặn! Kiểm tra tab Proxy.");
    } else {
      // Direct upload (will fail if it's just an image and we want a shell,
      // but here we only care if they managed to upload a PHP file)
      processUpload(file.name);
    }
  };

  const processUpload = (filename: string) => {
    setPendingRequest(null);
    setUploadedFile(filename);
    setUploadStatus("success");
    setMessage(`Upload thành công! File đã được lưu tại /uploads/${filename}`);
    setActiveTab("browser");
  };

  const handleVisitFile = () => {
    if (!uploadedFile) return;
    setCurrentUrl(`vulnerable-website.com/uploads/${uploadedFile}`);
    setPageContent("view-file");
  };

  const handleBackToUpload = () => {
    setCurrentUrl("vulnerable-website.com/upload");
    setPageContent("upload");
    setUploadStatus("idle");
    setMessage("");
    setUploadedFile(null);
  };

  const handleForward = () => {
    // Parse the filename from the proxy content
    const match = proxyContent.match(/filename="([^"]+)"/);
    if (match && match[1]) {
      processUpload(match[1]);
    } else {
      setUploadStatus("fail");
      setMessage("Request không hợp lệ. Upload thất bại.");
      setActiveTab("browser");
    }
  };

  const handleDrop = () => {
    setPendingRequest(null);
    setProxyContent("");
    setMessage("Request đã bị hủy (Dropped).");
    setActiveTab("browser");
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lab: Bypass Xác Thực Client-Side</h1>
          <p className="text-gray-600">
            Mục tiêu: Upload một file PHP để thực thi mã từ xa. Ứng dụng có kiểm tra
            phần mở rộng file bằng JavaScript.
          </p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 hidden lg:block"
          onClick={() => {
            const element = document.getElementById('lab-container');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          TRUY CẬP LAB
        </Button>
      </div>

      <div id="lab-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Browser & Proxy Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browser">
                <Globe className="w-4 h-4 mr-2" />
                Trình Duyệt (Browser)
              </TabsTrigger>
              <TabsTrigger value="proxy">
                <Server className="w-4 h-4 mr-2" />
                Proxy (Burp Suite)
              </TabsTrigger>
            </TabsList>

            {/* BROWSER TAB */}
            <TabsContent value="browser">
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-white px-3 py-1 rounded border text-center">
                      {currentUrl}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {pageContent === "upload" ? (
                    <div className="max-w-md mx-auto text-center space-y-6">
                      <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50">
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <FileCode className="w-8 h-8" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Upload Avatar</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Chỉ chấp nhận file ảnh (.jpg, .png)
                        </p>
                        <Input
                          type="file"
                          accept=".jpg,.png"
                          onChange={handleFileSelect}
                          className="max-w-xs mx-auto"
                        />
                      </div>

                      {message && (
                        <Alert
                          variant={
                            uploadStatus === "success"
                              ? "default"
                              : uploadStatus === "fail"
                              ? "destructive"
                              : "default"
                          }
                          className={
                            uploadStatus === "success"
                              ? "border-green-500 bg-green-50 text-green-800"
                              : ""
                          }
                        >
                          {uploadStatus === "success" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          <AlertTitle>
                            {uploadStatus === "success" ? "Thành công" : "Thông báo"}
                          </AlertTitle>
                          <AlertDescription>
                            {message}
                            {uploadStatus === "success" && uploadedFile && (
                              <div className="mt-2">
                                <Button 
                                  variant="link" 
                                  className="text-green-800 underline p-0 h-auto font-bold"
                                  onClick={handleVisitFile}
                                >
                                  Truy cập file: /uploads/{uploadedFile}
                                </Button>
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto text-center space-y-6">
                      <div className="flex justify-start">
                        <Button variant="outline" size="sm" onClick={handleBackToUpload}>
                          ← Quay lại trang Upload
                        </Button>
                      </div>
                      
                      {uploadedFile?.endsWith(".php") ? (
                        <div className="p-6 bg-black text-green-400 font-mono text-left rounded-lg shadow-lg border border-gray-700">
                          <div className="mb-2 border-b border-gray-700 pb-2">
                            $ php {uploadedFile}
                          </div>
                          <div className="whitespace-pre-wrap">
                            Executing system command...
                            <br />
                            User: www-data
                            <br />
                            System: Linux vulnerable-server 5.4.0
                            <br />
                            <br />
                            <span className="text-yellow-400 font-bold">FLAG FOUND:</span>
                            <br />
                            {flag}
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 mb-4 rounded">
                            [Image Content: {uploadedFile}]
                          </div>
                          <p className="text-gray-600">
                            Đây là một file ảnh hợp lệ. Không có mã nào được thực thi.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* PROXY TAB */}
            <TabsContent value="proxy">
              <Card className="border-orange-200">
                <CardHeader className="bg-orange-50 border-b border-orange-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-orange-800 flex items-center">
                      <Server className="w-5 h-5 mr-2" />
                      HTTP Proxy Intercept
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-orange-800 font-medium">
                        Intercept is {interceptOn ? "ON" : "OFF"}
                      </span>
                      <Button
                        variant={interceptOn ? "default" : "outline"}
                        size="sm"
                        onClick={() => setInterceptOn(!interceptOn)}
                        className={
                          interceptOn
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "text-orange-600 border-orange-200"
                        }
                      >
                        Toggle
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {pendingRequest ? (
                    <div className="flex flex-col h-[400px]">
                      <textarea
                        className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-gray-900 text-green-400"
                        value={proxyContent}
                        onChange={(e) => setProxyContent(e.target.value)}
                        spellCheck={false}
                      />
                      <div className="p-4 bg-gray-100 border-t flex justify-end space-x-2">
                        <Button variant="destructive" onClick={handleDrop}>
                          Drop
                        </Button>
                        <Button
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={handleForward}
                        >
                          Forward <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <RefreshCw className="w-12 h-12 mb-4 opacity-20" />
                      <p>Đang chờ request...</p>
                      <p className="text-sm mt-2">
                        Thực hiện hành động trên trình duyệt để chặn request.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Instructions & Flag */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hướng Dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                1. Tạo một file có tên <code>shell.php</code>.
              </p>
              <p>
                2. Thử upload nó. Bạn sẽ thấy lỗi vì trang web kiểm tra đuôi file.
              </p>
              <p>
                3. Đổi tên file thành <code>shell.jpg</code>.
              </p>
              <p>
                4. Bật <strong>Intercept ON</strong> ở tab Proxy.
              </p>
              <p>
                5. Upload file <code>shell.jpg</code>.
              </p>
              <p>
                6. Trong tab Proxy, sửa tên file trong request từ{" "}
                <code>shell.jpg</code> thành <code>shell.php</code>.
              </p>
              <p>
                7. Nhấn <strong>Forward</strong> để gửi request đã sửa.
              </p>
            </CardContent>
          </Card>

          <FlagSubmission 
            correctFlag={flag} 
            onSolved={() => console.log("Challenge Solved!")} 
          />
        </div>
      </div>
    </div>
  );
}
