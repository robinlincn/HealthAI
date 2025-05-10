
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, type FormEvent } from "react";
import { Loader2, LogIn, User, Lock } from "lucide-react";
import { useDoctorAuth } from "@/contexts/DoctorAuthContext";
import Image from "next/image";
import { DeviceMockups } from "@/components/doctor/auth/DeviceMockups";
import { HospitalLogo } from "@/components/doctor/auth/HospitalLogo";
import Link from "next/link";

export default function DoctorLoginPage() {
  const { toast } = useToast();
  const { loginDoctor } = useDoctorAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "登录成功",
      description: "欢迎医生！即将跳转到医生工作台。",
    });
    loginDoctor(); 
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full">
      <Image
        src="https://picsum.photos/seed/doctorloginbg/1920/1080"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
        data-ai-hint="office building"
      />
      <div className="relative z-10 flex w-full max-w-4xl h-[550px] bg-card shadow-2xl rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-[#8DC24E] p-8 text-white flex flex-col justify-center items-center space-y-6">
          <h2 className="text-3xl font-semibold">欢迎使用</h2>
          <p className="text-xl">AI慢病管理系统-医生端</p>
          <DeviceMockups className="w-full max-w-xs h-auto" />
        </div>

        {/* Right Panel (Login Form) */}
        <div className="w-1/2 p-8 bg-background flex flex-col justify-center">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex justify-center mb-6">
              <HospitalLogo className="h-16 w-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-1">登录</h2>
             <p className="text-sm text-muted-foreground text-center mb-6">请输入您的账号和密码</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="username">账号</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入账号"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">密码</Label>
                 <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rememberMe" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="rememberMe" className="font-normal">记住密码</Label>
                </div>
                <Link href="#" className="text-primary hover:underline" tabIndex={isLoading ? -1 : 0}>
                  忘记密码?
                </Link>
              </div>
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
