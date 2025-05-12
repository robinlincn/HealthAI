
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { OutboundCallGroup, DoctorPatient } from "@/lib/types";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const groupFormSchema = z.object({
  name: z.string().min(2, "组名称至少需要2个字符。"),
  description: z.string().optional(),
  patientIds: z.array(z.string()).min(1, "至少选择一个病人加入组。"),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface OutboundGroupFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<OutboundCallGroup, 'id' | 'creationDate' | 'memberCount'> & { id?: string }) => void;
  group?: OutboundCallGroup | null;
  allPatients: DoctorPatient[];
}

export function OutboundGroupFormDialog({ isOpen, onClose, onSave, group, allPatients }: OutboundGroupFormDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: group?.name || "",
      description: group?.description || "",
      patientIds: group?.patientIds || [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: group?.name || "",
        description: group?.description || "",
        patientIds: group?.patientIds || [],
      });
      setSearchTerm(''); // Reset search term on dialog open
    }
  }, [group, isOpen, form]);

  const onSubmit = (data: GroupFormValues) => {
    onSave(data);
  };

  const filteredPatients = allPatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{group ? "编辑外呼组" : "新建外呼组"}</DialogTitle>
          <DialogDescription>
            {group ? "修改组信息和成员。" : "创建一个新的病人外呼组。"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>组名称</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：高血压一级预防组" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>组描述 (可选)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="简要描述此组的用途或目标人群" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择病人成员</FormLabel>
                  <Input 
                    placeholder="搜索病人姓名或诊断..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2 h-9"
                  />
                  <ScrollArea className="h-48 border rounded-md p-2">
                    {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                      <div key={patient.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`patient-${patient.id}`}
                          checked={field.value?.includes(patient.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), patient.id])
                              : field.onChange(
                                  (field.value || []).filter((id) => id !== patient.id)
                                );
                          }}
                        />
                        <label
                          htmlFor={`patient-${patient.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {patient.name} <span className="text-xs text-muted-foreground">({patient.diagnosis})</span>
                        </label>
                      </div>
                    )) : <p className="text-xs text-muted-foreground text-center py-2">未找到病人或无可用病人。</p>}
                  </ScrollArea>
                  {field.value && field.value.length > 0 && (
                     <div className="mt-1">
                        <Badge variant="secondary">已选: {field.value.length} 人</Badge>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">取消</Button>
              </DialogClose>
              <Button type="submit">保存组</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
