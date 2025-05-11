
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

export default function SaasAdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would validate credentials and set auth state
    toast({
      title: "登录成功 (SAAS Admin)",
      description: "欢迎管理员！即将跳转到SAAS管理仪表盘。",
    });
    router.push("/saas-admin"); // Redirect to SAAS admin dashboard
    // No need to setIsLoaDing(false) as page will redirect
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-xl">
        <CardHeader className="space-y-1 text-center p-6">
          <Image 
            src="https://picsum.photos/seed/saaslogo/100/100" 
            alt="SAAS Admin Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-4 rounded-full"
            data-ai-hint="modern tech logo"
          />
          <CardTitle className="text-2xl">SAAS管理后台登录</CardTitle>
          <CardDescription>
            请输入您的管理员凭证
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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
              {isLoading ? "登录中..." : "安全登录"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-6 pt-0">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AI慢病管理系统 SAAS平台
          </p>
           <Button variant="link" asChild className="mt-2 text-xs">
              <Link href="/">返回主页</Link>
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

```