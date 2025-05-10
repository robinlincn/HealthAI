
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login logic - Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Allow login with any phone and password
    toast({
      title: "登录成功",
      description: "欢迎回来！即将跳转到仪表盘。",
    });
    router.push("/dashboard");
    
    // Removed specific credential check:
    // if (phone === "13800138000" && password === "password123") {
    //   toast({
    //     title: "登录成功",
    //     description: "欢迎回来！即将跳转到仪表盘。",
    //   });
    //   router.push("/dashboard");
    // } else {
    //   toast({
    //     title: "登录失败",
    //     description: "手机号或密码错误，请重试。",
    //     variant: "destructive",
    //   });
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center p-6">
            <Image 
              src="https://picsum.photos/seed/loginbanner/400/150" 
              alt="健康管理" 
              width={400} 
              height={150} 
              className="rounded-t-lg object-cover w-full h-32 mb-4"
              data-ai-hint="health technology"
            />
            <CardTitle className="text-2xl">欢迎登录</CardTitle>
            <CardDescription>
              登录您的AI慢病管理账户
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入您的手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
            <p className="text-sm text-muted-foreground">
              还没有账户？{" "}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/auth/register">立即注册</Link>
              </Button>
            </p>
            <Button variant="link" className="mt-2 text-xs p-0 h-auto" disabled>
                忘记密码？
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
