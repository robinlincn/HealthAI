
"use client";

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"; // Import all from form
import type { UserAddress } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const addressFormSchema = z.object({
  recipientName: z.string().min(2, "收货人姓名至少需要2个字符。"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码。"),
  province: z.string().min(2, "省份不能为空。"),
  city: z.string().min(2, "城市不能为空。"),
  district: z.string().min(2, "区/县不能为空。"),
  detailedAddress: z.string().min(5, "详细地址至少需要5个字符。"),
  postalCode: z.string().regex(/^\d{6}$/, "邮政编码必须是6位数字。").optional().or(z.literal('')),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<UserAddress, 'id'> & { id?: string }) => void;
  address?: UserAddress | null;
}

export function AddressFormDialog({ isOpen, onClose, onSave, address }: AddressFormDialogProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: address ? {
      ...address,
      postalCode: address.postalCode || '',
      isDefault: address.isDefault || false,
    } : {
      recipientName: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detailedAddress: '',
      postalCode: '',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (address) {
        form.reset({
          ...address,
          postalCode: address.postalCode || '',
          isDefault: address.isDefault || false,
        });
      } else {
        form.reset({
          recipientName: '', phone: '', province: '', city: '', district: '',
          detailedAddress: '', postalCode: '', isDefault: false,
        });
      }
    }
  }, [address, isOpen, form]);

  const handleFormSubmit: SubmitHandler<AddressFormValues> = (data) => {
    const addressDataToSave = {
      ...data,
      id: address?.id, // Include ID if editing
      postalCode: data.postalCode || undefined, // Ensure empty string becomes undefined
    };
    onSave(addressDataToSave);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{address ? '编辑收货地址' : '添加新收货地址'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
            <ScrollArea className="max-h-[65vh] pr-3"> {/* Added ScrollArea */}
                <div className="space-y-3"> {/* Added inner div for spacing within scroll area */}
                    <FormField control={form.control} name="recipientName" render={({field}) => (
                        <FormItem><FormLabel>收货人姓名</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="phone" render={({field}) => (
                        <FormItem><FormLabel>手机号码</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormField control={form.control} name="province" render={({field}) => (
                            <FormItem><FormLabel>省份</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="city" render={({field}) => (
                            <FormItem><FormLabel>城市</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="district" render={({field}) => (
                            <FormItem><FormLabel>区/县</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="detailedAddress" render={({field}) => (
                        <FormItem><FormLabel>详细地址</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="postalCode" render={({field}) => (
                        <FormItem><FormLabel>邮政编码 (可选)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="isDefault" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 pt-2">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel className="text-sm font-normal">设为默认地址</FormLabel>
                        </FormItem>
                    )}/>
                </div>
            </ScrollArea>
            <DialogFooter className="pt-4"> {/* Added pt-4 for spacing */}
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{address ? '保存更改' : '添加地址'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

