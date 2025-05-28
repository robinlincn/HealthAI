
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Tag, Star, Annoyed, Percent, Users, CalendarClock, Settings } from "lucide-react"; // Using Annoyed for Ad temporarily
import { useToast } from '@/hooks/use-toast';

// Placeholder types for potential future data structures
interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'full_reduction' | 'group_buy' | 'flash_sale';
  details: string;
  isActive: boolean;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  value: number;
  expiryDate: string; // ISO
  usageLimit?: number;
  usedCount?: number;
}

export default function MarketingManagementPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePlaceholderAction = (featureName: string) => {
    toast({
      title: `${featureName} (功能建设中)`,
      description: `此 ${featureName.toLowerCase()} 功能模块的详细配置和管理界面正在开发中。`,
    });
  };

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>营销管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载营销管理模块...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Megaphone className="h-6 w-6 text-primary" />
            商城营销管理
          </CardTitle>
          <CardDescription>
            创建和管理商城的各类营销活动，如促销、优惠券、积分营销和广告位。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 促销活动设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Percent className="h-5 w-5 text-primary/80" />
              促销活动设置
            </CardTitle>
            <CardDescription className="text-sm">
              设置满减、满赠、折扣、限时优惠、团购、秒杀等促销活动。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-dashed border-border rounded-md text-center">
              <Settings className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-md font-semibold text-muted-foreground">促销活动配置区</p>
              <p className="text-xs text-muted-foreground mt-1">
                详细的活动创建、规则设置、时间控制等功能正在开发中。
              </p>
              <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => handlePlaceholderAction('促销活动设置')}>
                管理促销活动
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 优惠券管理 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="h-5 w-5 text-primary/80" />
              优惠券管理
            </CardTitle>
            <CardDescription className="text-sm">
              生成、发放优惠券，设置优惠券的使用条件和有效期。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-dashed border-border rounded-md text-center">
              <Settings className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-md font-semibold text-muted-foreground">优惠券配置区</p>
              <p className="text-xs text-muted-foreground mt-1">
                优惠券的生成、类型定义、发放规则、核销统计等功能正在开发中。
              </p>
               <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => handlePlaceholderAction('优惠券管理')}>
                管理优惠券
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 积分营销 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-primary/80" />
              积分营销
            </CardTitle>
            <CardDescription className="text-sm">
              设置积分获取和兑换规则，利用积分吸引用户消费。
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="p-4 border border-dashed border-border rounded-md text-center">
              <Settings className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-md font-semibold text-muted-foreground">积分规则配置区</p>
              <p className="text-xs text-muted-foreground mt-1">
                积分获取途径、积分兑换商品/服务、积分有效期等规则设置正在开发中。
              </p>
              <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => handlePlaceholderAction('积分营销')}>
                管理积分规则
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 广告管理 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Annoyed className="h-5 w-5 text-primary/80" /> {/* Placeholder icon for Ad */}
              广告管理
            </CardTitle>
            <CardDescription className="text-sm">
              设置商城内的广告位，管理广告内容（图片、视频等）。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-dashed border-border rounded-md text-center">
              <Settings className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-md font-semibold text-muted-foreground">广告位与内容管理区</p>
              <p className="text-xs text-muted-foreground mt-1">
                广告位定义、广告素材上传、投放排期、点击统计等功能正在开发中。
              </p>
              <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => handlePlaceholderAction('广告管理')}>
                管理广告
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
