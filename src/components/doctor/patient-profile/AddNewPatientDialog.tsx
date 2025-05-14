
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { Gender } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, differenceInYears, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

const newPatientFormSchema = z.object({
  name: z.string().min(1, "病人姓名不能为空。"),
  gender: z.enum(["male", "female", "other"] as [Gender, ...Gender[]], { required_error: "请选择性别。" }),
  dob: z.date({ required_error: "请选择出生日期。" }),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码。").or(z.literal("")),
  primaryDiagnosis: z.string().optional(),
});

export type NewPatientFormValues = z.infer<typeof newPatientFormSchema>;

interface AddNewPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewPatientFormValues) => void;
}

export function AddNewPatientDialog({ isOpen, onClose, onSave }: AddNewPatientDialogProps) {
  const form = useForm<NewPatientFormValues>({
    resolver: zodResolver(newPatientFormSchema),
    defaultValues: {
      name: "",
      gender: undefined, // Ensure it's undefined initially for placeholder
      dob: undefined,
      contactPhone: "",
      primaryDiagnosis: "",
    },
  });

  const onSubmit = (data: NewPatientFormValues) => {
    onSave(data);
    form.reset(); // Reset form after saving
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            form.reset(); // Reset form when dialog is closed via overlay click or X button
            onClose();
        } else {
            // Dialog is being opened, ensure default values are fresh if needed
             form.reset({
                name: "",
                gender: undefined,
                dob: undefined,
                contactPhone: "",
                primaryDiagnosis: "",
            });
        }
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>添加新病人</DialogTitle>
          <DialogDescription>
            填写新病人的基本信息。更详细的档案可在病人创建后编辑。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="输入病人姓名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>性别</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="选择性别" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>出生日期</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                            ) : (
                                <span>选择日期</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>联系电话</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="输入病人的手机号码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryDiagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>主要诊断 (可选)</FormLabel>
                  <FormControl>
                    <Input placeholder="输入初步诊断信息" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => {form.reset(); onClose();}}>取消</Button>
              </DialogClose>
              <Button type="submit">创建病人</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

