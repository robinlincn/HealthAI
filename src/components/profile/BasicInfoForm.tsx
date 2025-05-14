
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile, Gender, BloodType, MaritalStatus } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(1, "姓名不能为空。").max(50, "姓名不能超过50个字符。"),
  gender: z.enum(["male", "female", "other"], { required_error: "请选择性别。" }) as z.ZodType<Gender>,
  dob: z.date({ required_error: "请选择出生日期。" }),
  address: z.string().optional(),
  hadPreviousCheckup: z.boolean().default(false).optional(),
  agreesToIntervention: z.boolean().default(false).optional(),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码。").or(z.literal("")),
  contactEmail: z.string().email("请输入有效的邮箱地址。").or(z.literal("")),
  bloodType: z.enum(["A", "B", "O", "AB", "unknown"], { required_error: "请选择血型。" }) as z.ZodType<BloodType>,
  maritalStatus: z.enum(["unmarried", "married", "divorced", "widowed", "other"], { required_error: "请选择婚姻状况。" }) as z.ZodType<MaritalStatus>,
  occupation: z.string().optional(),
  educationLevel: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock data - in a real app, this would come from an API
const defaultValues: ProfileFormValues = {
  name: "王小宝",
  gender: "male",
  dob: parse("1980-06-06", "yyyy-MM-dd", new Date()), // Example DOB
  address: "示例省 示例市 示例区 示例街道123号",
  hadPreviousCheckup: true,
  agreesToIntervention: true,
  contactPhone: "13534000000",
  contactEmail: "wang.xiaobao@example.com",
  bloodType: "A",
  maritalStatus: "married",
  occupation: "软件工程师",
  educationLevel: "bachelor",
};

export function BasicInfoForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile data submitted:", data);
    toast({
      title: "信息已更新",
      description: "您的基本信息已成功保存。",
    });
  }

  if (!isClient) {
    return <div className="space-y-4">加载中...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input placeholder="请输入您的姓名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>性别</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择您的性别" />
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
                <FormLabel>生日</FormLabel>
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
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>家庭住址</FormLabel>
              <FormControl>
                <Input placeholder="请输入您的家庭住址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 items-center">
           <FormField
            control={form.control}
            name="hadPreviousCheckup"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal leading-none">以前在本机构体检过</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="agreesToIntervention"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal leading-none">同意接受健康干预服务</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="请输入您的手机号码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="请输入您的邮箱地址" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>血型</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="A" /></FormControl>
                      <FormLabel className="font-normal">A型</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="B" /></FormControl>
                      <FormLabel className="font-normal">B型</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="O" /></FormControl>
                      <FormLabel className="font-normal">O型</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="AB" /></FormControl>
                      <FormLabel className="font-normal">AB型</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>婚  姻</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-x-4 gap-y-2"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="unmarried" /></FormControl>
                      <FormLabel className="font-normal">未婚</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="married" /></FormControl>
                      <FormLabel className="font-normal">已婚</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="divorced" /></FormControl>
                      <FormLabel className="font-normal">离婚</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl><RadioGroupItem value="widowed" /></FormControl>
                      <FormLabel className="font-normal">丧偶</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>职业</FormLabel>
                <FormControl>
                  <Input placeholder="请输入您的职业" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="educationLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文化程度</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder="请选择文化程度" />
                      </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      <SelectItem value="primary_school">小学</SelectItem>
                      <SelectItem value="junior_high_school">初中</SelectItem>
                      <SelectItem value="senior_high_school">高中/中专</SelectItem>
                      <SelectItem value="college">大专</SelectItem>
                      <SelectItem value="bachelor">本科</SelectItem>
                      <SelectItem value="master">硕士</SelectItem>
                      <SelectItem value="doctorate">博士</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit">保存更新</Button>
      </form>
    </Form>
  );
}

