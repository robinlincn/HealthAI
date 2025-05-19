
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { TreatmentPlan, TreatmentPlanMedication } from "@/lib/types";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const treatmentPlanMedicationSchema = z.object({
  id: z.string(), // for useFieldArray key
  drugName: z.string().min(1, "药物名称不能为空。"),
  dosage: z.string().min(1, "剂量不能为空。"),
  frequency: z.string().min(1, "服用频次不能为空。"),
  notes: z.string().optional(),
  medStartDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "药物开始日期格式无效" }),
  medEndDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "药物结束日期格式无效" }),
});

const treatmentPlanFormSchema = z.object({
  planName: z.string().min(2, "方案名称至少需要2个字符。"),
  startDate: z.string().refine(val => isValid(parseISO(val)), { message: "开始日期不能为空且格式需有效。" }),
  endDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "结束日期格式无效" }),
  shortTermGoals: z.string().optional(),
  longTermGoals: z.string().optional(),
  lifestyleAdjustments: z.string().optional(),
  medications: z.array(treatmentPlanMedicationSchema).optional(),
  isActive: z.boolean().default(true).optional(),
});

type TreatmentPlanFormValues = z.infer<typeof treatmentPlanFormSchema>;

interface TreatmentPlanFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TreatmentPlan) => void;
  initialData?: TreatmentPlan | null;
  patientId: string;
  doctorId: string; // Assuming doctorId is available
}

export function TreatmentPlanFormDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  patientId, 
  doctorId 
}: TreatmentPlanFormDialogProps) {
  
  const form = useForm<TreatmentPlanFormValues>({
    resolver: zodResolver(treatmentPlanFormSchema),
    defaultValues: {
      planName: initialData?.planName || `病人 (${patientId.slice(-4)}) 治疗方案 - ${format(new Date(), 'yyyy-MM-dd')}`,
      startDate: initialData?.startDate ? format(parseISO(initialData.startDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      endDate: initialData?.endDate ? format(parseISO(initialData.endDate), "yyyy-MM-dd") : undefined,
      shortTermGoals: initialData?.shortTermGoals || "",
      longTermGoals: initialData?.longTermGoals || "",
      lifestyleAdjustments: initialData?.lifestyleAdjustments || "",
      medications: initialData?.medications || [],
      isActive: initialData?.isActive === undefined ? true : initialData.isActive,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        planName: initialData?.planName || `病人 (${patientId.slice(-4)}) 治疗方案 - ${format(new Date(), 'yyyy-MM-dd')}`,
        startDate: initialData?.startDate ? format(parseISO(initialData.startDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        endDate: initialData?.endDate ? format(parseISO(initialData.endDate), "yyyy-MM-dd") : undefined,
        shortTermGoals: initialData?.shortTermGoals || "",
        longTermGoals: initialData?.longTermGoals || "",
        lifestyleAdjustments: initialData?.lifestyleAdjustments || "",
        medications: initialData?.medications?.map(med => ({
          ...med,
          medStartDate: med.medStartDate ? format(parseISO(med.medStartDate), "yyyy-MM-dd") : undefined,
          medEndDate: med.medEndDate ? format(parseISO(med.medEndDate), "yyyy-MM-dd") : undefined,
        })) || [],
        isActive: initialData?.isActive === undefined ? true : initialData.isActive,
      });
    }
  }, [initialData, isOpen, patientId, form]);

  const handleFinalSubmit = (data: TreatmentPlanFormValues) => {
    const planToSubmit: TreatmentPlan = {
      id: initialData?.id || `tp-${Date.now().toString()}`,
      patientId,
      doctorId,
      planName: data.planName,
      startDate: parseISO(data.startDate).toISOString(),
      endDate: data.endDate ? parseISO(data.endDate).toISOString() : undefined,
      shortTermGoals: data.shortTermGoals || undefined,
      longTermGoals: data.longTermGoals || undefined,
      lifestyleAdjustments: data.lifestyleAdjustments || undefined,
      medications: data.medications?.map(med => ({
        ...med,
        medStartDate: med.medStartDate ? parseISO(med.medStartDate).toISOString() : undefined,
        medEndDate: med.medEndDate ? parseISO(med.medEndDate).toISOString() : undefined,
      })) || [],
      isActive: data.isActive,
      creationDate: initialData?.creationDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(planToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl"> {/* Increased width */}
        <DialogHeader>
          <DialogTitle>{initialData ? "编辑治疗方案" : "创建新治疗方案"}</DialogTitle>
          <DialogDescription>
            为病人制定或修改详细的治疗计划。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[65vh] p-1 pr-3"> {/* Added ScrollArea */}
              <div className="space-y-4">
                <FormField control={form.control} name="planName" render={({ field }) => (
                  <FormItem><FormLabel>方案名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>开始日期</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(parseISO(field.value), "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus /></PopoverContent>
                        </Popover><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="endDate" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>结束日期 (可选)</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(parseISO(field.value), "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} /></PopoverContent>
                        </Popover><FormMessage /></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="shortTermGoals" render={({ field }) => (
                  <FormItem><FormLabel>短期目标</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="longTermGoals" render={({ field }) => (
                  <FormItem><FormLabel>长期目标</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="lifestyleAdjustments" render={({ field }) => (
                  <FormItem><FormLabel>生活方式调整建议</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                
                <FormItem>
                  <FormLabel className="text-base font-semibold">药物列表</FormLabel>
                  <div className="space-y-3">
                    {fields.map((item, index) => (
                      <Card key={item.id} className="p-3 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-destructive" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" /><span className="sr-only">移除药物</span>
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                          <FormField control={form.control} name={`medications.${index}.drugName`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">药物名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name={`medications.${index}.dosage`} render={({ field }) => (
                            <FormItem><FormLabel className="text-xs">剂量</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                          )}/>
                          <FormField control={form.control} name={`medications.${index}.frequency`} render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel className="text-xs">服用频次</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                          )}/>
                           <FormField control={form.control} name={`medications.${index}.medStartDate`} render={({ field }) => (
                              <FormItem className="flex flex-col"><FormLabel className="text-xs">开始日期 (可选)</FormLabel>
                                <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal h-9 text-xs", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(parseISO(field.value), "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-3 w-3 opacity-50" /></Button></FormControl></PopoverTrigger>
                                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} /></PopoverContent>
                                </Popover><FormMessage /></FormItem>
                          )}/>
                          <FormField control={form.control} name={`medications.${index}.medEndDate`} render={({ field }) => (
                              <FormItem className="flex flex-col"><FormLabel className="text-xs">结束日期 (可选)</FormLabel>
                                <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal h-9 text-xs", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(parseISO(field.value), "yyyy-MM-dd") : <span>选择日期</span>} <CalendarIcon className="ml-auto h-3 w-3 opacity-50" /></Button></FormControl></PopoverTrigger>
                                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} /></PopoverContent>
                                </Popover><FormMessage /></FormItem>
                          )}/>
                          <FormField control={form.control} name={`medications.${index}.notes`} render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel className="text-xs">备注 (可选)</FormLabel><FormControl><Textarea rows={1} {...field} className="text-xs" /></FormControl><FormMessage/></FormItem>
                          )}/>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ id: `new-med-${Date.now()}`, drugName: '', dosage: '', frequency: '', notes: '', medStartDate: undefined, medEndDate: undefined })}>
                    <PlusCircle className="mr-2 h-4 w-4"/> 添加药物
                  </Button>
                </FormItem>

                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-start space-x-2 pt-2">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-sm font-normal">设为当前激活方案</FormLabel>
                  </FormItem>
                )}/>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{initialData ? '保存更改' : '创建方案'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
