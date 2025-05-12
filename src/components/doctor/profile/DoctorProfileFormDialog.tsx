
"use client";

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import type { DoctorProfileDetails } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';

const doctorProfileSchema = z.object({
  name: z.string().min(2, { message: "姓名至少需要2个字符。" }),
  email: z.string().email({ message: "请输入有效的邮箱地址。" }), // Typically read-only from auth
  phone: z.string().regex(/^1[3-9]\d{9}$/, { message: "请输入有效的中国大陆手机号码。" }).optional().or(z.literal('')),
  specialty: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0, "经验年限不能为负。").optional(),
  bio: z.string().max(500, "简介不能超过500字符。").optional(),
  licenseNumber: z.string().optional(),
  department: z.string().optional(),
});

type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>;

interface DoctorProfileFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorProfileDetails) => void;
  doctorProfile: DoctorProfileDetails | null;
}

export function DoctorProfileFormDialog({ isOpen, onClose, onSubmit, doctorProfile }: DoctorProfileFormDialogProps) {
  const form = useForm<DoctorProfileFormValues>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: doctorProfile ? {
      name: doctorProfile.name,
      email: doctorProfile.email,
      phone: doctorProfile.phone || '',
      specialty: doctorProfile.specialty || '',
      hospitalAffiliation: doctorProfile.hospitalAffiliation || '',
      yearsOfExperience: doctorProfile.yearsOfExperience || 0,
      bio: doctorProfile.bio || '',
      licenseNumber: doctorProfile.licenseNumber || '',
      department: doctorProfile.department || '',
    } : {
      name: '',
      email: '', // Should be pre-filled from auth
      phone: '',
      specialty: '',
      hospitalAffiliation: '',
      yearsOfExperience: 0,
      bio: '',
      licenseNumber: '',
      department: '',
    },
  });

  useEffect(() => {
    if (isOpen && doctorProfile) {
      form.reset({
        name: doctorProfile.name,
        email: doctorProfile.email,
        phone: doctorProfile.phone || '',
        specialty: doctorProfile.specialty || '',
        hospitalAffiliation: doctorProfile.hospitalAffiliation || '',
        yearsOfExperience: doctorProfile.yearsOfExperience || 0,
        bio: doctorProfile.bio || '',
        licenseNumber: doctorProfile.licenseNumber || '',
        department: doctorProfile.department || '',
      });
    }
  }, [doctorProfile, form, isOpen]);

  const handleFormSubmit: SubmitHandler<DoctorProfileFormValues> = (data) => {
    if (!doctorProfile) return; // Should not happen if dialog is for editing
    const updatedProfile: DoctorProfileDetails = {
      ...doctorProfile,
      ...data,
      phone: data.phone || undefined,
      specialty: data.specialty || undefined,
      hospitalAffiliation: data.hospitalAffiliation || undefined,
      yearsOfExperience: data.yearsOfExperience || undefined,
      bio: data.bio || undefined,
      licenseNumber: data.licenseNumber || undefined,
      department: data.department || undefined,
    };
    onSubmit(updatedProfile);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>编辑医生资料</DialogTitle>
          <DialogDescription>更新您的个人和执业信息。</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem><FormLabel>姓名</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="email" render={({field}) => (
                <FormItem><FormLabel>邮箱 (不可编辑)</FormLabel><FormControl><Input type="email" {...field} readOnly disabled /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="phone" render={({field}) => (
                <FormItem><FormLabel>联系电话</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="specialty" render={({field}) => (
                <FormItem><FormLabel>专业/科室</FormLabel><FormControl><Input placeholder="例如：心血管内科" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="hospitalAffiliation" render={({field}) => (
                <FormItem><FormLabel>所属医院/机构</FormLabel><FormControl><Input placeholder="例如：北京协和医院" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="department" render={({field}) => (
                <FormItem><FormLabel>院内部门</FormLabel><FormControl><Input placeholder="例如：内科门诊" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="yearsOfExperience" render={({field}) => (
                <FormItem><FormLabel>执业年限</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
               <FormField control={form.control} name="licenseNumber" render={({field}) => (
                <FormItem><FormLabel>执业医师编号</FormLabel><FormControl><Input placeholder="输入您的执业医师编号" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="bio" render={({field}) => (
              <FormItem><FormLabel>个人简介/擅长</FormLabel><FormControl><Textarea rows={4} placeholder="简要介绍您的专业背景、擅长领域等。" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">保存更改</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
