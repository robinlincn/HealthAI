
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Loader2, LogIn } from "lucide-react";
import { useDoctorAuth } from "@/contexts/DoctorAuthContext";

export default function DoctorLoginPage() {
  const { toast } = useToast();
  const { loginDoctor } = useDoctorAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login logic - Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Allow login with any username and password for now
    toast({
      title: "登录成功",
      description: "欢迎医生！即将跳转到医生仪表盘。",
    });
    loginDoctor(); // This will set auth state and trigger redirect via context
    
    // setIsLoading(false); // No longer needed here as redirect will happen
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      <div className="w-full max-w-md p-4 sm:p-0">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center p-6">
            <Image 
              src="https://picsum.photos/seed/doctorlogin/400/150" 
              alt="医生专业形象" 
              width={400} 
              height={150} 
              className="rounded-t-lg object-cover w-full h-32 mb-4"
              data-ai-hint="medical professional"
            />
            <CardTitle className="text-2xl">医生端登录</CardTitle>
            <CardDescription>
              登录AI慢病管理系统医生工作台
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入您的用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center p-6 pt-0">
             <Button variant="link" className="mt-2 text-xs p-0 h-auto" disabled>
                忘记密码？
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              本系统仅供授权医护人员使用。
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
