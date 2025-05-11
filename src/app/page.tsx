
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; 
import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div /> {/* Spacer for top, used with justify-between */}
      
      <main className="bg-card p-8 sm:p-12 rounded-xl shadow-2xl max-w-3xl w-full my-auto">
        <div className="text-center space-y-6">
          <Image 
            src="https://picsum.photos/seed/applogo/150/150" 
            alt="AI慢病管理系统 Logo" 
            width={120} 
            height={120} 
            className="mx-auto rounded-full shadow-lg"
            data-ai-hint="health logo"
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-primary">欢迎来到 AI慢病管理系统</h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
            我们利用人工智能，为您提供个性化的慢性病管理方案、健康建议和持续的支持。
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4"> {/* Increased space-x for better separation */}
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base">
              <Link href="/auth/login"><span>病人登录 (Next.js版)</span></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base">
              <Link href="/auth/register"><span>病人注册 (Next.js版)</span></Link>
            </Button>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Link href="/doctor/auth/login"><span>医生端入口 &rarr;</span></Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="text-accent-foreground hover:text-accent">
                 {/* 
                    The Vue app is expected to be served under /vue-patient-app/ path.
                    This requires server configuration (e.g., Nginx proxy_pass or Vercel rewrites) 
                    to serve the Vue app's build output from the 'vue-patient-app/dist' directory 
                    when the /vue-patient-app/ path is accessed.
                 */}
                <a href="/vue-patient-app/" target="_blank" rel="noopener noreferrer"><span>病人端入口 (Vue版) &rarr;</span></a>
              </Button>
          </div>
        </div>
      </main>

      <footer className="w-full text-center text-xs text-muted-foreground py-6">
        <p>&copy; {currentYear !== null ? currentYear : new Date().getFullYear()} AI慢病管理系统. 保留所有权利。</p>
        <p className="mt-1">本系统提供的健康信息仅供参考，不能替代专业医疗建议。</p>
      </footer>
    </div>
  );
}

