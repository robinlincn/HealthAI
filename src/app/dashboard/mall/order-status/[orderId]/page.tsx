
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from "react";

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [isClient, setIsClient] = useState(false);

  // In a real app, you might fetch order status based on orderId
  // For this mock, we'll assume it's always a success if an orderId is present.
  const isSuccess = !!orderId; // Simple mock logic

  useEffect(() => {
    setIsClient(true);
    if (!orderId) {
      // Redirect if no orderId, though dynamic route should ensure it's there
      router.replace('/dashboard/mall');
    }
  }, [orderId, router]);


  if (!isClient || !orderId) {
     return (
      <div className="p-4 space-y-4">
        <Card><CardHeader><CardTitle>加载订单状态...</CardTitle></CardHeader>
        <CardContent><p className="text-center p-8 text-muted-foreground">请稍候...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center text-center h-full space-y-6">
      {isSuccess ? (
        <>
          <CheckCircle className="w-20 h-20 text-green-500" />
          <CardTitle className="text-2xl font-semibold">订单提交成功！</CardTitle>
          <CardDescription className="max-w-md text-muted-foreground">
            感谢您的购买！您的订单 <span className="font-medium text-primary">{orderId}</span> 已成功提交。
            我们会尽快为您处理并发货。您可以在“我的订单”中查看订单详情和物流状态 (功能建设中)。
          </CardDescription>
        </>
      ) : (
        <>
          <XCircle className="w-20 h-20 text-destructive" />
          <CardTitle className="text-2xl font-semibold">订单处理失败</CardTitle>
          <CardDescription className="max-w-md text-muted-foreground">
            抱歉，您的订单未能成功处理。请返回购物车重试或联系客服。
          </CardDescription>
        </>
      )}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs">
        <Button asChild className="w-full">
          <Link href="/dashboard/mall">继续购物</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/dashboard/profile">查看我的信息 (模拟订单)</Link>
        </Button>
      </div>
    </div>
  );
}

    