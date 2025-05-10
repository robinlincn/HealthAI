"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot } from "lucide-react";
import Image from "next/image";

export function WelcomeBanner() {
  return (
    <Card className="mb-6 shadow-lg overflow-hidden bg-gradient-to-r from-primary/10 via-background to-accent/10">
      <div className="flex flex-col md:flex-row items-center">
        <div className="p-6 md:p-8 flex-1 space-y-4">
          <CardTitle className="text-3xl font-bold text-primary">
            欢迎回来, 示例用户!
          </CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            您的AI健康伙伴已准备就绪。让我们一起管理您的健康数据，迈向更健康的生活。
          </CardDescription>
          <div className="flex space-x-3 pt-2">
            <Button asChild>
              <Link href="/dashboard/assistant">
                <Bot className="mr-2 h-5 w-5" /> 与AI小助手对话
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/profile">
                更新个人信息
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden md:block md:w-1/3 p-2">
          <Image
            src="https://picsum.photos/400/300?random=1"
            alt="Healthy Lifestyle"
            width={400}
            height={300}
            className="rounded-lg object-cover"
            data-ai-hint="health lifestyle"
          />
        </div>
      </div>
    </Card>
  );
}
