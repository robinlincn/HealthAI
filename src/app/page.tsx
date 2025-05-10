
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-primary">欢迎来到 AI慢病管理系统</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          我们利用人工智能，为您提供个性化的慢性病管理方案、健康建议和持续的支持。
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg">
            <Link href="/dashboard">进入用户仪表盘</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/doctor">进入医生端 (预览)</Link>
          </Button>
        </div>
        <div className="mt-12">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
              <path d="M16.018 17.116L14.604 15.7l1.414-1.414 1.414 1.414-1.414 1.414zm-8.036 0L6.568 15.7l1.414-1.414L9.4 15.7l-1.414 1.414zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-6c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor" opacity="0.6"/>
              <path d="M19.071 4.929c.39.39.39 1.024 0 1.414l-1.414 1.414c-.39.39-1.024.39-1.414 0a.996.996 0 010-1.414l1.414-1.414c.39-.39 1.024-.39 1.414 0zM6.343 6.343c.39-.39 1.024-.39 1.414 0l1.414 1.414c.39.39.39 1.024 0 1.414a.996.996 0 01-1.414 0L6.343 7.757a.996.996 0 010-1.414z" fill="currentColor" opacity="0.4"/>
            </svg>
        </div>
      </div>
    </div>
  );
}
