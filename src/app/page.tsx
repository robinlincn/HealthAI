
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; 

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-6">
        <Image 
          src="https://picsum.photos/seed/applogo/150/150" 
          alt="AI慢病管理系统 Logo" 
          width={120} 
          height={120} 
          className="mx-auto rounded-full shadow-lg"
          data-ai-hint="health logo"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">欢迎来到 AI慢病管理系统</h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
          我们利用人工智能，为您提供个性化的慢性病管理方案、健康建议和持续的支持。
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/auth/login">病人登录</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/auth/register">病人注册</Link>
          </Button>
        </div>
         <div className="pt-8">
            <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                <Link href="/doctor">医生端入口 &rarr;</Link>
            </Button>
        </div>
      </div>
      <footer className="absolute bottom-6 text-center text-xs text-muted-foreground">
        <p>&copy; {currentYear} AI慢病管理系统. 保留所有权利。</p>
        <p>本系统提供的健康信息仅供参考，不能替代专业医疗建议。</p>
      </footer>
    </div>
  );
}
