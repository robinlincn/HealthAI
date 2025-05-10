
"use client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stethoscope, UserPlus } from "lucide-react";
import Image from "next/image";

export function WelcomeBannerDoctor() {
  return (
    <Card className="mb-6 shadow-lg overflow-hidden bg-gradient-to-r from-primary/10 via-background to-accent/10">
      <div className="flex flex-col md:flex-row items-center">
        <div className="p-6 md:p-8 flex-1 space-y-4">
          <CardTitle className="text-3xl font-bold text-primary">
            欢迎回来, 医生示例!
          </CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            管理您的患者、预约和日常工作。系统致力于提高您的工作效率。
          </CardDescription>
          <div className="flex space-x-3 pt-2">
            <Button asChild>
              <Link href="/doctor/appointments">
                <Stethoscope className="mr-2 h-5 w-5" /> 查看今日预约
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/doctor/patients">
                <UserPlus className="mr-2 h-5 w-5" /> 管理患者列表
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden md:block md:w-1/3 p-2">
          <Image
            src="https://picsum.photos/400/300?random=2"
            alt="Doctor at work"
            width={400}
            height={300}
            className="rounded-lg object-cover"
            data-ai-hint="doctor healthcare"
          />
        </div>
      </div>
    </Card>
  );
}
