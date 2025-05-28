
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, PlusCircle } from 'lucide-react';
import type { SaasProduct, SaasEnterprise, SaasProductStatus, SaasEmployee, SaasProductCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const NO_CATEGORY_VALUE = "__NO_CATEGORY_SELECTED__";

const productSchema = z.object({
  enterpriseId: z.string().min(1, "必须选择所属企业。"),
  name: z.string().min(2, { message: "商品名称至少需要2个字符。" }),
  description: z.string().optional(),
  category: z.string().optional(), // Will store category name or NO_CATEGORY_VALUE
  price: z.coerce.number().min(0, { message: "价格不能为负。" }),
  stock: z.coerce.number().int().min(0, { message: "库存不能为负。" }),
  status: z.enum(['active', 'draft', 'archived'] as [SaasProductStatus, ...SaasProductStatus[]]),
  images: z.array(z.object({ url: z.string().url("请输入有效的图片URL").or(z.literal('')) })).optional().default([]),
  sku: z.string().optional(),
  tags: z.string().optional().describe("多个标签用逗号分隔"),
  assignedEmployeeIds: z.array(z.string()).optional().default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasProduct) => void;
  product?: SaasProduct | null;
  enterprises: SaasEnterprise[];
  allEmployees: SaasEmployee[];
  productCategories: SaasProductCategory[]; // Receive managed categories
}

export function ProductDialog({ 
    isOpen, 
    onClose, 
    onSubmit, 
    product, 
    enterprises, 
    allEmployees, 
    productCategories 
}: ProductDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      enterpriseId: product.enterpriseId || (enterprises.length > 0 ? enterprises[0].id : ''),
      images: product.images?.map(imgUrl => ({ url: imgUrl })) || [],
      tags: product.tags?.join(', ') || '',
      category: product.category || NO_CATEGORY_VALUE,
      assignedEmployeeIds: product.assignedEmployeeIds || [],
    } : {
      enterpriseId: enterprises.length > 0 ? enterprises[0].id : '',
      name: '',
      description: '',
      category: NO_CATEGORY_VALUE,
      price: 0,
      stock: 0,
      status: 'draft',
      images: [{ url: 'https://placehold.co/600x400.png' }],
      sku: '',
      tags: '',
      assignedEmployeeIds: [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const selectedEnterpriseId = form.watch('enterpriseId');

  const employeesForSelectedEnterprise = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return allEmployees.filter(emp => emp.enterpriseId === selectedEnterpriseId);
  }, [selectedEnterpriseId, allEmployees]);

  useEffect(() => {
    if (isOpen) {
      form.reset(product ? {
        ...product,
        enterpriseId: product.enterpriseId || (enterprises.length > 0 ? enterprises[0].id : ''),
        images: product.images?.map(imgUrl => ({ url: imgUrl })) || [{ url: 'https://placehold.co/600x400.png' }],
        tags: product.tags?.join(', ') || '',
        category: product.category || NO_CATEGORY_VALUE,
        assignedEmployeeIds: product.assignedEmployeeIds || [],
      } : {
        enterpriseId: enterprises.length > 0 ? enterprises[0].id : '',
        name: '', description: '', category: NO_CATEGORY_VALUE, price: 0, stock: 0, status: 'draft',
        images: [{ url: 'https://placehold.co/600x400.png' }], sku: '', tags: '', assignedEmployeeIds: [],
      });
    }
  }, [product, isOpen, enterprises, form]);

  const handleFormSubmit: SubmitHandler<ProductFormValues> = (data) => {
    const productToSubmit: SaasProduct = {
      ...product,
      id: product?.id || `prod-${Date.now().toString()}`,
      creationDate: product?.creationDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
      category: data.category === NO_CATEGORY_VALUE ? undefined : data.category,
      images: data.images?.map(img => img.url).filter(url => url) || [],
      tags: data.tags?.split(',').map(t => t.trim()).filter(t => t) || [],
      assignedEmployeeIds: data.assignedEmployeeIds || [],
    };
    onSubmit(productToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? '编辑商品' : '新增商品'}</DialogTitle>
          <DialogDescription>
            {product ? '修改商品详细信息。' : '添加一个新的商城商品。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
            <ScrollArea className="max-h-[70vh] pr-3">
              <div className="space-y-3">
                <FormField control={form.control} name="enterpriseId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>所属企业</FormLabel>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('assignedEmployeeIds', []); 
                        }}
                        value={field.value}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder="选择企业" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {enterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>商品名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>商品分类</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个商品分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NO_CATEGORY_VALUE}>无分类</SelectItem>
                          {productCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="description" render={({field}) => (
                  <FormItem><FormLabel>商品描述 (可选)</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField control={form.control} name="price" render={({field}) => (
                    <FormItem><FormLabel>价格 (元)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage/></FormItem>
                  )}/>
                  <FormField control={form.control} name="stock" render={({field}) => (
                    <FormItem><FormLabel>库存数量</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                  )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField control={form.control} name="sku" render={({field}) => (
                    <FormItem><FormLabel>SKU (可选)</FormLabel><FormControl><Input placeholder="商品唯一编码" {...field} /></FormControl><FormMessage/></FormItem>
                  )}/>
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>商品状态</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="draft">草稿 (下架)</SelectItem>
                          <SelectItem value="active">上架销售</SelectItem>
                          <SelectItem value="archived">已归档</SelectItem>
                        </SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )}/>
                </div>
                <FormItem>
                  <FormLabel>商品图片 (最多5张URL)</FormLabel>
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`images.${index}.url`}
                        render={({ field: itemField }) => (
                          <FormItem className="flex-grow">
                            <FormControl>
                              <Input placeholder="图片URL, 如 https://placehold.co/600x400.png" {...itemField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {imageFields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} className="text-destructive h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {imageFields.length < 5 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ url: "" })} className="mt-1 text-xs">
                      <PlusCircle className="h-3 w-3 mr-1"/> 添加图片URL
                    </Button>
                  )}
                </FormItem>
                <FormField control={form.control} name="tags" render={({field}) => (
                  <FormItem><FormLabel>商品标签 (可选, 逗号分隔)</FormLabel><FormControl><Input placeholder="例如: 热销, 新品, 康复适用" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>

                <FormField
                  control={form.control}
                  name="assignedEmployeeIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>分配销售人员 (可选)</FormLabel>
                      <FormDescription className="text-xs">选择哪些员工/医生可以推广或销售此商品。</FormDescription>
                      <ScrollArea className="h-40 border rounded-md p-2 mt-1">
                        {employeesForSelectedEnterprise.length > 0 ? employeesForSelectedEnterprise.map((employee) => (
                          <div key={employee.id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`employee-${employee.id}-${product?.id || 'new'}`}
                              checked={field.value?.includes(employee.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                return checked
                                  ? field.onChange([...currentValues, employee.id])
                                  : field.onChange(
                                      currentValues.filter((id) => id !== employee.id)
                                    );
                              }}
                            />
                            <label htmlFor={`employee-${employee.id}-${product?.id || 'new'}`} className="text-sm font-medium leading-none">
                              {employee.name} <span className="text-xs text-muted-foreground">({employee.email})</span>
                            </label>
                          </div>
                        )) : <p className="text-xs text-muted-foreground text-center py-2">{!selectedEnterpriseId ? "请先选择所属企业" : "该企业暂无员工信息"}</p>}
                      </ScrollArea>
                      {field.value && field.value.length > 0 && (
                        <div className="mt-1">
                            <Badge variant="secondary">已分配给: {field.value.length} 名员工</Badge>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{product ? '保存更改' : '创建商品'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
