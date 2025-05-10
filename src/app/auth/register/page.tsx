
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    gender: "",
    concernedDisease: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "注册失败",
        description: "两次输入的密码不一致。",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Mock registration logic
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Registration data:", formData);
    toast({
      title: "注册成功",
      description: "欢迎加入！即将跳转到登录页面。",
    });
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center p-6">
             <Image 
              src="https://picsum.photos/seed/registerbanner/400/150" 
              alt="健康生活" 
              width={400} 
              height={150} 
              className="rounded-t-lg object-cover w-full h-32 mb-4"
              data-ai-hint="medical icons"
            />
            <CardTitle className="text-2xl">注册您的专属AI管家</CardTitle>
            <CardDescription>
              开启您的个性化慢病管理之旅
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="请输入您的手机号"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="请输入密码 (至少6位)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="请输入您的姓名"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">年龄</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="请输入您的年龄"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">性别</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  required
                  disabled={isLoading}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="请选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="concernedDisease">关注病种</Label>
                <Select
                  name="concernedDisease"
                  value={formData.concernedDisease}
                  onValueChange={(value) => handleSelectChange("concernedDisease", value)}
                  required
                  disabled={isLoading}
                >
                  <SelectTrigger id="concernedDisease">
                    <SelectValue placeholder="请选择您关注的病种" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diabetes">糖尿病</SelectItem>
                    <SelectItem value="hypertension">高血压</SelectItem>
                    <SelectItem value="hyperlipidemia">高血脂</SelectItem>
                    <SelectItem value="copd">慢阻肺</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "注册中..." : "完成注册"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-6 pt-0">
            <p className="text-sm text-muted-foreground">
              已有账户？{" "}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/auth/login">立即登录</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
