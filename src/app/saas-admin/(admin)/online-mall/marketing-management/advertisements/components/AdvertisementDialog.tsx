
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
import type { SaasAdvertisement, SaasAdSlot, SaasAdvertisementType, SaasAdvertisementStatus } from '@/lib/types';
import { format, parseISO, addDays } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area'; // Added this import

// Mock Ad Slots - In a real app, these would be fetched or managed elsewhere
const mockAdSlots: SaasAdSlot[] = [
    {id: "slot_homepage_banner", name: "首页轮播Banner (750x300)"},
    {id: "slot_sidebar_small", name: "侧边栏小广告 (250x250)"},
    {id: "slot_product_list_top", name: "商品列表页顶部通栏"},
];

const adSchema = z.object({
  name: z.string().min(2, { message: "广告名称至少需要2个字符。" }),
  adSlotId: z.string().min(1, "必须选择一个广告位。"),
  type: z.enum(['image', 'video', 'html'] as [SaasAdvertisementType, ...SaasAdvertisementType[]]),
  assetUrl: z.string().url("素材URL必须是有效的网址。"),
  linkUrl: z.string().url("链接URL必须是有效的网址。"),
  startDate: z.date({ required_error: "开始日期不能为空。"}),
  endDate: z.date().optional(),
  status: z.enum(['active', 'inactive', 'scheduled'] as [Exclude<SaasAdvertisementStatus, 'expired'>, ...Exclude<SaasAdvertisementStatus, 'expired'>[]]),
}).refine(data => !data.endDate || data.endDate >= data.startDate, {
  message: "结束日期不能早于开始日期。",
  path: ["endDate"],
});

type AdvertisementFormValues = z.infer<typeof adSchema>;

interface AdvertisementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasAdvertisement) => void;
  advertisement?: SaasAdvertisement | null;
  // enterprises: SaasEnterprise[]; // If ads are enterprise-specific
}

export function AdvertisementDialog({ isOpen, onClose, onSubmit, advertisement }: AdvertisementDialogProps) {
  const form = useForm<AdvertisementFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: advertisement ? {
      ...advertisement,
      startDate: advertisement.startDate ? parseISO(advertisement.startDate) : new Date(),
      endDate: advertisement.endDate ? parseISO(advertisement.endDate) : undefined,
    } : {
      name: '',
      adSlotId: mockAdSlots.length > 0 ? mockAdSlots[0].id : '',
      type: 'image',
      assetUrl: 'https://placehold.co/728x90.png?text=广告素材',
      linkUrl: 'https://example.com',
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      status: 'scheduled',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (advertisement) {
        form.reset({
          ...advertisement,
          startDate: advertisement.startDate ? parseISO(advertisement.startDate) : new Date(),
          endDate: advertisement.endDate ? parseISO(advertisement.endDate) : undefined,
        });
      } else {
        form.reset({
          name: '', adSlotId: mockAdSlots.length > 0 ? mockAdSlots[0].id : '', type: 'image',
          assetUrl: 'https://placehold.co/728x90.png?text=广告素材', linkUrl: 'https://example.com',
          startDate: new Date(), endDate: addDays(new Date(), 30), status: 'scheduled',
        });
      }
    }
  }, [advertisement, form, isOpen]);

  const handleFormSubmit: SubmitHandler<AdvertisementFormValues> = (data) => {
    const adToSubmit: SaasAdvertisement = {
      ...advertisement, 
      id: advertisement?.id || `ad-${Date.now().toString()}`,
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : undefined,
    };
    onSubmit(adToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{advertisement ? '编辑广告' : '新增广告'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
            <ScrollArea className="max-h-[65vh] pr-3">
              <div className="space-y-3">
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>广告名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="adSlotId" render={({ field }) => (
                    <FormItem><FormLabel>广告位</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="选择广告位" /></SelectTrigger></FormControl>
                        <SelectContent>{mockAdSlots.map(slot => (<SelectItem key={slot.id} value={slot.id}>{slot.name}</SelectItem>))}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>素材类型</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="image">图片</SelectItem><SelectItem value="video">视频</SelectItem><SelectItem value="html">HTML代码</SelectItem></SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="assetUrl" render={({field}) => (
                  <FormItem><FormLabel>素材URL / HTML代码</FormLabel><FormControl>
                    {form.watch('type') === 'html' ? <Textarea rows={3} placeholder="输入HTML代码" {...field} /> : <Input placeholder="http://example.com/image.jpg" {...field} />}
                  </FormControl><FormMessage/></FormItem>
                )}/>
                 <FormField control={form.control} name="linkUrl" render={({field}) => (
                  <FormItem><FormLabel>跳转链接URL</FormLabel><FormControl><Input type="url" placeholder="http://example.com/landing-page" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>开始日期</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>结束日期 (可选)</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>状态</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="scheduled">待投放</SelectItem><SelectItem value="active">投放中</SelectItem><SelectItem value="inactive">已暂停</SelectItem></SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{advertisement ? '保存更改' : '创建广告'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    
