'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'; // Assuming Card component exists
import Image from 'next/image';
import { LogIn, Loader2 } from 'lucide-react';

export default function SaasAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // In a real app, you would validate credentials and set auth state
    router.push('/admin'); // Redirect to admin dashboard after login
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat p-4" style={{backgroundImage: "url('https://picsum.photos/seed/saasloginbg/1920/1080')"}} data-ai-hint="office building">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div> {/* Overlay for blur and darkening */}
      <Card className="relative z-10 w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Image 
            src="https://picsum.photos/seed/saaslogo/100/100" 
            alt="SAAS Admin Logo"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-full"
            data-ai-hint="modern tech"
          />
          <CardTitle className="text-2xl font-bold text-primary">SAAS管理后台登录</CardTitle>
          <CardDescription>请输入您的管理员凭证</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">邮箱地址</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center items-center rounded-md border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 h-11"
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              {isLoading ? '登录中...' : '安全登录'}
            </button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AI慢病管理系统 SAAS平台
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
