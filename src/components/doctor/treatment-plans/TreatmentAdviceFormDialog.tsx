
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { TreatmentAdvice, TreatmentAdviceStatus } from "@/lib/types";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";

const adviceDoctorStatusOptions: TreatmentAdviceStatus[] = ['待执行', '已执行', '已取消']; // Doctor settable statuses

const adviceFormSchema = z.object({
  advice: z.string().min(5, "建议内容至少需要5个字符。"),
  status: z.enum(adviceDoctorStatusOptions).default('待执行'),
  patientFeedback: z.string().optional(), // Doctor might also add notes here about patient's verbal feedback
});

type AdviceFormValues = z.infer<typeof adviceFormSchema>;

interface TreatmentAdviceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TreatmentAdvice>) => void; 
  initialData?: TreatmentAdvice | null;
  patientId: string; 
  doctorId: string;  
}

export function TreatmentAdviceFormDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  patientId,
  doctorId
}: TreatmentAdviceFormDialogProps) {
  
  const form = useForm<AdviceFormValues>({
    resolver: zodResolver(adviceFormSchema),
    defaultValues: {
      advice: initialData?.advice || "",
      status: (initialData?.status && adviceDoctorStatusOptions.includes(initialData.status as any)) ? initialData.status as TreatmentAdviceStatus : '待执行',
      patientFeedback: initialData?.patientFeedback || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        advice: initialData?.advice || "",
        status: (initialData?.status && adviceDoctorStatusOptions.includes(initialData.status as any)) ? initialData.status as TreatmentAdviceStatus : '待执行',
        patientFeedback: initialData?.patientFeedback || "",
      });
    }
  }, [initialData, isOpen, form]);

  const handleFormSubmit = (data: AdviceFormValues) => {
    const adviceDataToSubmit: Partial<TreatmentAdvice> = {
        id: initialData?.id, 
        patientId, 
        doctorId,  
        advice: data.advice,
        status: data.status,
        patientFeedback: data.patientFeedback || undefined, // Ensure empty string becomes undefined
        date: initialData?.date || new Date().toISOString(), 
    };
    onSubmit(adviceDataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "编辑治疗建议" : "新增治疗建议"}</DialogTitle>
          <DialogDescription>
            {initialData ? "修改建议内容或状态。" : "为病人添加新的治疗建议。"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="advice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>建议内容</FormLabel>
                  <FormControl>
                    <Textarea placeholder="输入具体的治疗建议..." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>建议状态</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adviceDoctorStatusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientFeedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>病人反馈/备注 (可选)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="记录病人对此建议的反馈或医生备注" {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              </DialogClose>
              <Button type="submit">{initialData ? "保存更改" : "添加建议"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
