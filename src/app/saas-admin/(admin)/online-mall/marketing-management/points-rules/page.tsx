
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ShoppingBag, UserPlus, Save, RefreshCcw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form"; // Added this import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from '@/components/ui/separator';

const pointsEarningSchema = z.object({
  perPurchaseAmount: z.coerce.number().min(0).optional(),
  pointsPerAmount: z.coerce.number().int().min(0).optional(),
  registrationPoints: z.coerce.number().int().min(0).optional(),
});
type PointsEarningValues = z.infer<typeof pointsEarningSchema>;

const pointsRedemptionSchema = z.object({
  pointsToRedeem: z.coerce.number().int().min(1).optional(),
  amountOff: z.coerce.number().min(0.01).optional(),
});
type PointsRedemptionValues = z.infer<typeof pointsRedemptionSchema>;

const POINTS_EARNING_KEY = "saas_points_earning_rules";
const POINTS_REDEMPTION_KEY = "saas_points_redemption_rules";

export default function PointsRulesManagementPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const earningForm = useForm<PointsEarningValues>({
    resolver: zodResolver(pointsEarningSchema),
    defaultValues: { perPurchaseAmount: 1, pointsPerAmount: 1, registrationPoints: 100 },
  });

  const redemptionForm = useForm<PointsRedemptionValues>({
    resolver: zodResolver(pointsRedemptionSchema),
    defaultValues: { pointsToRedeem: 100, amountOff: 1 },
  });

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        const storedEarning = localStorage.getItem(POINTS_EARNING_KEY);
        if (storedEarning) {
            try {
                earningForm.reset(JSON.parse(storedEarning));
            } catch (e) {
                console.error("Error parsing stored earning rules:", e);
                // Optionally clear the invalid item from localStorage
                // localStorage.removeItem(POINTS_EARNING_KEY);
            }
        }
        const storedRedemption = localStorage.getItem(POINTS_REDEMPTION_KEY);
        if (storedRedemption) {
            try {
                redemptionForm.reset(JSON.parse(storedRedemption));
            } catch (e) {
                console.error("Error parsing stored redemption rules:", e);
                // Optionally clear the invalid item from localStorage
                // localStorage.removeItem(POINTS_REDEMPTION_KEY);
            }
        }
    }
  }, [earningForm, redemptionForm]);

  const onEarningSubmit = (data: PointsEarningValues) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(POINTS_EARNING_KEY, JSON.stringify(data));
    }
    toast({ title: "积分获取规则已保存" });
  };

  const onRedemptionSubmit = (data: PointsRedemptionValues) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(POINTS_REDEMPTION_KEY, JSON.stringify(data));
    }
    toast({ title: "积分兑换规则已保存" });
  };

  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Star className="h-6 w-6 text-primary" />
            积分营销规则管理
          </CardTitle>
          <CardDescription>
            设置积分的获取和兑换规则，以激励用户消费和平台互动。
          </CardDescription>
        </CardHeader>
      </Card>

      <Form {...earningForm}>
        <form onSubmit={earningForm.handleSubmit(onEarningSubmit)}>
          <Card>
            <CardHeader><CardTitle className="text-lg">积分获取规则</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <FormField control={earningForm.control} name="perPurchaseAmount" render={({field}) => (
                  <FormItem className="flex-1"><FormLabel>每消费 (元)</FormLabel><FormControl><Input type="number" placeholder="例如: 100" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <span>得</span>
                <FormField control={earningForm.control} name="pointsPerAmount" render={({field}) => (
                  <FormItem className="flex-1"><FormLabel>积分</FormLabel><FormControl><Input type="number" placeholder="例如: 10" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
              </div>
              <FormField control={earningForm.control} name="registrationPoints" render={({field}) => (
                <FormItem><FormLabel><UserPlus className="h-4 w-4 mr-1 inline-block"/>新用户注册赠送积分</FormLabel><FormControl><Input type="number" placeholder="例如: 100" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>保存获取规则</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      <Separator/>

      <Form {...redemptionForm}>
        <form onSubmit={redemptionForm.handleSubmit(onRedemptionSubmit)}>
          <Card>
            <CardHeader><CardTitle className="text-lg">积分兑换规则</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <FormField control={redemptionForm.control} name="pointsToRedeem" render={({field}) => (
                  <FormItem className="flex-1"><FormLabel>每 (积分)</FormLabel><FormControl><Input type="number" placeholder="例如: 100" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <span>可抵扣</span>
                <FormField control={redemptionForm.control} name="amountOff" render={({field}) => (
                  <FormItem className="flex-1"><FormLabel>金额 (元)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="例如: 1" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
              </div>
              <CardDescription className="text-xs">更多兑换方式（如兑换商品、服务）正在开发中。</CardDescription>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>保存兑换规则</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
       <Card className="mt-4 border-dashed">
        <CardHeader>
            <CardTitle className="text-base text-muted-foreground">高级积分功能 (规划中)</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>积分有效期设置</li>
                <li>特定商品/活动额外积分奖励</li>
                <li>积分商城 (积分兑换实物或虚拟商品)</li>
                <li>会员等级与积分倍率关联</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
