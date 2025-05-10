
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Appointment } from "@/lib/types";
import { useEffect } from "react";

const appointmentFormSchema = z.object({
  patientName: z.string().min(1, "病人姓名不能为空。"),
  date: z.date({ required_error: "预约日期不能为空。" }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "时间格式应为 HH:MM (例如 14:30)。"),
  reason: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'pending_confirmation']).default('scheduled'),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  appointment?: Appointment | null;
  selectedDate?: Date;
  onSave: (data: Omit<Appointment, 'id' | 'status'> & { id?: string, status?: Appointment['status'] }) => void;
  onCancel: () => void;
}

export function AppointmentForm({ appointment, selectedDate, onSave, onCancel }: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: appointment?.patientName || "",
      date: appointment?.date || selectedDate || new Date(),
      time: appointment?.time || "09:00",
      reason: appointment?.reason || "",
      status: appointment?.status || 'scheduled',
    },
  });
  
  // Reset form if appointment or selectedDate changes
  useEffect(() => {
    form.reset({
        patientName: appointment?.patientName || "",
        date: appointment?.date || selectedDate || new Date(),
        time: appointment?.time || "09:00",
        reason: appointment?.reason || "",
        status: appointment?.status || 'scheduled',
    });
  }, [appointment, selectedDate, form]);


  const onSubmit = (data: AppointmentFormValues) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>病人姓名</FormLabel>
              <FormControl>
                <Input placeholder="输入病人姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>预约日期</FormLabel>
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
                            date < new Date(new Date().setDate(new Date().getDate() - 1)) // Cannot select past dates
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
                <FormItem>
                <FormLabel>预约时间</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormDescription>格式: HH:MM (24小时制)</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>预约事由 (可选)</FormLabel>
              <FormControl>
                <Textarea placeholder="输入预约事由，如复诊、咨询等" {...field} />
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
              <FormLabel>预约状态</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="scheduled">已安排</SelectItem>
                  <SelectItem value="pending_confirmation">待确认</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">
            {appointment ? "保存更改" : "创建预约"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
