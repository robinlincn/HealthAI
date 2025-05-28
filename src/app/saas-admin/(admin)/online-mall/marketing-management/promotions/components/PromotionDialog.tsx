
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
import type { SaasPromotion, SaasEnterprise, SaasPromotionType, SaasPromotionStatus } from '@/lib/types';
import { format, parseISO } from 'date-fns';

const promotionSchema = z.object({
  name: z.string().min(2, { message: "活动名称至少需要2个字符。" }),
  enterpriseId: z.string().optional(), // Platform-wide or enterprise-specific
  description: z.string().optional(),
  type: z.enum(['full_reduction', 'discount', 'buy_x_get_y', 'limited_time_offer'] as [SaasPromotionType, ...SaasPromotionType[]]),
  startDate: z.string().refine((date) => !isNaN(parseISO(date).valueOf()), {message: "请输入有效的开始日期时间"}),
  endDate: z.string().optional().refine((date) => !date || !isNaN(parseISO(date).valueOf()), {message: "若填写，需为有效结束日期时间"}),
  status: z.enum(['active', 'inactive', 'scheduled'] as [Exclude<SaasPromotionStatus, 'expired'>, ...Exclude<SaasPromotionStatus, 'expired'>[]]), // Admin can't set to 'expired' directly
  // For simplicity, conditions and actions will be text for now.
  rulesDescription: z.string().optional().describe("例如: 满100减10; 全场8折; 买2赠1指定商品"),
  applicableProducts: z.string().optional().describe("逗号分隔的商品ID列表，留空则全场适用"),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasPromotion) => void;
  promotion?: SaasPromotion | null;
  enterprises: SaasEnterprise[];
}

export function PromotionDialog({ isOpen, onClose, onSubmit, promotion, enterprises }: PromotionDialogProps) {
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: promotion ? {
      ...promotion,
      startDate: promotion.startDate ? format(parseISO(promotion.startDate), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endDate: promotion.endDate ? format(parseISO(promotion.endDate), "yyyy-MM-dd'T'HH:mm") : undefined,
      rulesDescription: promotion.actions?.map(a => `${a.type}: ${a.value}`).join('; ') || '', // Simplified
      applicableProducts: promotion.applicableProducts?.join(', ') || '',
    } : {
      name: '',
      enterpriseId: undefined,
      description: '',
      type: 'full_reduction',
      startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endDate: undefined,
      status: 'scheduled',
      rulesDescription: '',
      applicableProducts: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (promotion) {
        form.reset({
          ...promotion,
          startDate: promotion.startDate ? format(parseISO(promotion.startDate), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          endDate: promotion.endDate ? format(parseISO(promotion.endDate), "yyyy-MM-dd'T'HH:mm") : undefined,
          rulesDescription: promotion.actions?.map(a => `${a.type}: ${a.value}`).join('; ') || '',
          applicableProducts: promotion.applicableProducts?.join(', ') || '',
        });
      } else {
        form.reset({
          name: '', enterpriseId: undefined, description: '', type: 'full_reduction',
          startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"), endDate: undefined, status: 'scheduled',
          rulesDescription: '', applicableProducts: '',
        });
      }
    }
  }, [promotion, form, isOpen]);

  const handleFormSubmit: SubmitHandler<PromotionFormValues> = (data) => {
    const promotionToSubmit: SaasPromotion = {
      ...promotion, 
      id: promotion?.id || `promo-${Date.now().toString()}`,
      ...data,
      startDate: parseISO(data.startDate).toISOString(),
      endDate: data.endDate ? parseISO(data.endDate).toISOString() : undefined,
      // For simplicity, we are not parsing rulesDescription or applicableProducts into complex objects for mock
      // In a real app, these would be structured.
      actions: [{type: 'fixed_amount_off', value: 0}], // Dummy action
      conditions: [{type: 'min_purchase_amount', value: 0}], // Dummy condition
      applicableProducts: data.applicableProducts?.split(',').map(s=>s.trim()).filter(s=>s) || [],
    };
    onSubmit(promotionToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{promotion ? '编辑促销活动' : '新增促销活动'}</DialogTitle>
          <DialogDescription>
            配置促销活动的详细信息和规则。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField control={form.control} name="name" render={({field}) => (
              <FormItem><FormLabel>活动名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="enterpriseId" render={({ field }) => (
              <FormItem>
                <FormLabel>所属企业 (可选)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="平台通用活动" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="">平台通用活动</SelectItem>
                    {enterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">选择特定企业或留空设为平台通用活动。</FormDescription>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({field}) => (
              <FormItem><FormLabel>活动描述 (可选)</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem> <FormLabel>活动类型</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="full_reduction">满减</SelectItem>
                        <SelectItem value="discount">折扣</SelectItem>
                        <SelectItem value="buy_x_get_y">买赠</SelectItem>
                        <SelectItem value="limited_time_offer">限时特惠</SelectItem>
                        </SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem> <FormLabel>活动状态</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="scheduled">待开始</SelectItem>
                            <SelectItem value="active">进行中</SelectItem>
                            <SelectItem value="inactive">已暂停</SelectItem>
                        </SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem><FormLabel>开始日期时间</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem><FormLabel>结束日期时间 (可选)</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="rulesDescription" render={({field}) => (
              <FormItem><FormLabel>规则描述/条件与动作 (简化版)</FormLabel><FormControl><Textarea rows={3} placeholder="例如: 满100减10; 或 全场8折" {...field} /></FormControl>
              <FormDescription className="text-xs">详细的规则条件和动作配置正在开发中。</FormDescription>
              <FormMessage/></FormItem>
            )}/>
             <FormField control={form.control} name="applicableProducts" render={({field}) => (
              <FormItem><FormLabel>适用商品ID (可选, 逗号分隔)</FormLabel><FormControl><Input placeholder="prod-001, prod-002" {...field} /></FormControl>
               <FormDescription className="text-xs">留空则表示适用于所有商品。</FormDescription>
              <FormMessage/></FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{promotion ? '保存更改' : '创建活动'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    