
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import type { SaasProductCategory } from '@/lib/types';

const categorySchema = z.object({
  name: z.string().min(2, { message: "分类名称至少需要2个字符。" }),
  description: z.string().optional(),
  // enterpriseId is not part of the form as we're assuming global categories for now
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Pick<SaasProductCategory, 'name' | 'description'> & { id?: string }) => void; // Submit only relevant fields
  category?: SaasProductCategory | null;
}

export function CategoryDialog({ isOpen, onClose, onSubmit, category }: CategoryDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      description: category.description || '',
    } : {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset({
          name: category.name,
          description: category.description || '',
        });
      } else {
        form.reset({ name: '', description: '' });
      }
    }
  }, [category, form, isOpen]);

  const handleFormSubmit: SubmitHandler<CategoryFormValues> = (data) => {
    const categoryToSubmit: Pick<SaasProductCategory, 'name' | 'description'> & { id?: string } = {
      id: category?.id, // Pass ID if editing
      name: data.name,
      description: data.description || undefined,
    };
    onSubmit(categoryToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{category ? '编辑商品分类' : '新增商品分类'}</DialogTitle>
          <DialogDescription>
            {category ? '修改分类的名称和描述。' : '创建一个新的商品分类。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({field}) => (
              <FormItem><FormLabel>分类名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({field}) => (
              <FormItem><FormLabel>分类描述 (可选)</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{category ? '保存更改' : '创建分类'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
