
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { SaasCoupon, SaasEnterprise, SaasCouponType, SaasCouponStatus } from '@/lib/types';
import { format, parseISO, addDays } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const PLATFORM_WIDE_COUPON_ENTERPRISE_ID = "__PLATFORM_WIDE_COUPON__";

const couponSchema = z.object({
  name: z.string().min(2, { message: "优惠券名称至少需要2个字符。" }),
  code: z.string().min(6, "券码至少6个字符。").max(20, "券码最多20字符。").toUpperCase(),
  enterpriseId: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['fixed_amount', 'percentage'] as [SaasCouponType, ...SaasCouponType[]]),
  value: z.coerce.number().positive("面值/折扣必须为正数。"),
  minPurchaseAmount: z.coerce.number().min(0).optional(),
  validFrom: z.date({ required_error: "生效日期不能为空。"}),
  validTo: z.date({ required_error: "失效日期不能为空。"}),
  maxUses: z.coerce.number().int().min(0).optional(),
  usesPerUser: z.coerce.number().int().min(0).optional(),
  status: z.enum(['active', 'inactive'] as [Exclude<SaasCouponStatus, 'expired' | 'used_up'>, ...Exclude<SaasCouponStatus, 'expired' | 'used_up'>[]]),
  applicableProducts: z.string().optional().describe("逗号分隔的商品ID"),
  applicableCategories: z.string().optional().describe("逗号分隔的分类ID/名称"),
}).refine(data => data.validTo >= data.validFrom, {
  message: "失效日期不能早于生效日期。",
  path: ["validTo"],
}).refine(data => data.type === 'percentage' ? data.value > 0 && data.value <= 1 : true, {
  message: "百分比折扣值应在0到1之间 (例如0.1代表10%)。",
  path: ["value"],
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasCoupon) => void;
  coupon?: SaasCoupon | null;
  enterprises: SaasEnterprise[];
}

export function CouponDialog({ isOpen, onClose, onSubmit, coupon, enterprises }: CouponDialogProps) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon ? {
      ...coupon,
      enterpriseId: coupon.enterpriseId || PLATFORM_WIDE_COUPON_ENTERPRISE_ID,
      validFrom: coupon.validFrom ? parseISO(coupon.validFrom) : new Date(),
      validTo: coupon.validTo ? parseISO(coupon.validTo) : addDays(new Date(), 30),
      value: coupon.type === 'percentage' ? coupon.value : coupon.value, 
      applicableProducts: coupon.applicableProducts?.join(', ') || '',
      applicableCategories: coupon.applicableCategories?.join(', ') || '',
    } : {
      name: '',
      code: `NEW${Date.now().toString().slice(-6)}`, 
      enterpriseId: PLATFORM_WIDE_COUPON_ENTERPRISE_ID,
      description: '',
      type: 'fixed_amount',
      value: 0,
      minPurchaseAmount: undefined,
      validFrom: new Date(),
      validTo: addDays(new Date(), 30),
      maxUses: undefined,
      usesPerUser: 1,
      status: 'active',
      applicableProducts: '',
      applicableCategories: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (coupon) {
        form.reset({
          ...coupon,
          enterpriseId: coupon.enterpriseId || PLATFORM_WIDE_COUPON_ENTERPRISE_ID,
          validFrom: coupon.validFrom ? parseISO(coupon.validFrom) : new Date(),
          validTo: coupon.validTo ? parseISO(coupon.validTo) : addDays(new Date(), 30),
          value: coupon.type === 'percentage' ? coupon.value : coupon.value,
          applicableProducts: coupon.applicableProducts?.join(', ') || '',
          applicableCategories: coupon.applicableCategories?.join(', ') || '',
        });
      } else {
        form.reset({
          name: '', code: `NEW${Date.now().toString().slice(-6)}`, 
          enterpriseId: PLATFORM_WIDE_COUPON_ENTERPRISE_ID, 
          description: '',
          type: 'fixed_amount', value: 0, minPurchaseAmount: undefined,
          validFrom: new Date(), validTo: addDays(new Date(), 30),
          maxUses: undefined, usesPerUser: 1, status: 'active',
          applicableProducts: '', applicableCategories: '',
        });
      }
    }
  }, [coupon, form, isOpen]);

  const handleFormSubmit: SubmitHandler<CouponFormValues> = (data) => {
    const couponToSubmit: SaasCoupon = {
      ...coupon, 
      id: coupon?.id || `coupon-${Date.now().toString()}`,
      ...data,
      enterpriseId: data.enterpriseId === PLATFORM_WIDE_COUPON_ENTERPRISE_ID ? undefined : data.enterpriseId,
      validFrom: data.validFrom.toISOString(),
      validTo: data.validTo.toISOString(),
      applicableProducts: data.applicableProducts?.split(',').map(s=>s.trim()).filter(s=>s) || [],
      applicableCategories: data.applicableCategories?.split(',').map(s=>s.trim()).filter(s=>s) || [],
      totalUsed: coupon?.totalUsed || 0,
    };
    onSubmit(couponToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{coupon ? '编辑优惠券' : '新增优惠券'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
            <ScrollArea className="max-h-[65vh] pr-3">
              <div className="space-y-3">
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField control={form.control} name="code" render={({field}) => (
                        <FormItem><FormLabel>券码</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="enterpriseId" render={({ field }) => (
                        <FormItem><FormLabel>所属企业 (可选)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="平台通用券" /></SelectTrigger></FormControl>
                            <SelectContent> 
                                <SelectItem value={PLATFORM_WIDE_COUPON_ENTERPRISE_ID}>平台通用券</SelectItem> 
                                {enterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))} 
                            </SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem><FormLabel>描述 (可选)</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>类型</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="fixed_amount">固定金额</SelectItem><SelectItem value="percentage">百分比折扣</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="value" render={({field}) => (
                        <FormItem><FormLabel>{form.watch('type') === 'percentage' ? '折扣值 (0-1)' : '面值 (元)'}</FormLabel><FormControl><Input type="number" step={form.watch('type') === 'percentage' ? "0.01" : "0.01"} {...field} /></FormControl>
                        {form.watch('type') === 'percentage' && <FormDescription className="text-xs">例如: 0.1 表示10%折扣 (九折)</FormDescription>}
                        <FormMessage/></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="minPurchaseAmount" render={({field}) => (
                    <FormItem><FormLabel>最低消费金额 (元, 可选)</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="例如: 100 (满100可用)"/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField control={form.control} name="validFrom" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>生效日期</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="validTo" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>失效日期</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField control={form.control} name="maxUses" render={({field}) => (
                        <FormItem><FormLabel>总可用次数 (可选)</FormLabel><FormControl><Input type="number" placeholder="0表示不限制" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="usesPerUser" render={({field}) => (
                        <FormItem><FormLabel>每用户可用次数 (可选)</FormLabel><FormControl><Input type="number" placeholder="默认1次" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>状态</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="active">激活</SelectItem><SelectItem value="inactive">未激活</SelectItem></SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="applicableProducts" render={({field}) => (
                    <FormItem><FormLabel>适用商品ID (可选, 逗号分隔)</FormLabel><FormControl><Input placeholder="prod-001, prod-002" {...field} /></FormControl>
                    <FormDescription className="text-xs">留空则表示适用于所有商品。</FormDescription><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="applicableCategories" render={({field}) => (
                    <FormItem><FormLabel>适用分类 (可选, 逗号分隔)</FormLabel><FormControl><Input placeholder="医疗器械, 膳食包" {...field} /></FormControl>
                    <FormDescription className="text-xs">留空则表示适用于所有分类。</FormDescription><FormMessage/></FormItem>
                )}/>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{coupon ? '保存更改' : '创建优惠券'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    