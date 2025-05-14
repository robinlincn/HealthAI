
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
import type { UserProfile, Gender, BloodType, MaritalStatus, ReliabilityOption } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format, parse, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

const educationLevelOptions = [
  { value: 'primary_school', label: '小学' },
  { value: 'junior_high_school', label: '初中' },
  { value: 'senior_high_school', label: '高中/中专' },
  { value: 'college', label: '大专' },
  { value: 'bachelor', label: '本科' },
  { value: 'master', label: '硕士' },
  { value: 'doctorate', label: '博士' },
  { value: 'other', label: '其他' },
];

const reliabilityOptions: { value: ReliabilityOption; label: string }[] = [
    { value: 'reliable', label: '可靠' },
    { value: 'partially_reliable', label: '部分可靠' },
    { value: 'unreliable', label: '不可靠' },
];

const profileFormSchema = z.object({
  name: z.string().min(1, "姓名不能为空。").max(50, "姓名不能超过50个字符。"),
  gender: z.enum(["male", "female", "other"], { required_error: "请选择性别。" }) as z.ZodType<Gender>,
  dob: z.date({ required_error: "请选择出生日期。" }),
  address: z.string().optional(),
  hadPreviousCheckup: z.boolean().default(false).optional(),
  agreesToIntervention: z.boolean().default(false).optional(),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码。").or(z.literal("")),
  contactEmail: z.string().email("请输入有效的邮箱地址。").or(z.literal("")).optional(),
  bloodType: z.enum(["A", "B", "O", "AB", "unknown"], { required_error: "请选择血型。" }) as z.ZodType<BloodType>,
  maritalStatus: z.enum(["unmarried", "married", "divorced", "widowed", "other"], { required_error: "请选择婚姻状况。" }) as z.ZodType<MaritalStatus>,
  occupation: z.string().optional(),
  educationLevel: z.string().optional(),
  recordNumber: z.string().optional(),
  admissionDate: z.date().optional(),
  recordDate: z.date().optional(),
  informant: z.string().optional(),
  reliability: z.enum(['reliable', 'partially_reliable', 'unreliable']).optional() as z.ZodType<ReliabilityOption | undefined>,
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock data - in a real app, this would come from an API
const defaultValues: ProfileFormValues = {
  name: "王小宝",
  gender: "male",
  dob: parse("1980-06-06", "yyyy-MM-dd", new Date()),
  address: "示例省 示例市 示例区 示例街道123号",
  hadPreviousCheckup: true,
  agreesToIntervention: true,
  contactPhone: "13534000000",
  contactEmail: "wang.xiaobao@example.com",
  bloodType: "A",
  maritalStatus: "married",
  occupation: "软件工程师",
  educationLevel: "bachelor",
  recordNumber: "PAT00123",
  admissionDate: parse("2023-01-15", "yyyy-MM-dd", new Date()),
  recordDate: parse("2023-01-10", "yyyy-MM-dd", new Date()),
  informant: "本人",
  reliability: "reliable",
};

export function BasicInfoForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, you would fetch existing user profile data and set it here
    // For now, we'll use the defaultValues and imagine they could be updated
    // if a `userProfile` prop was passed and its data was merged in.
    // e.g., if (userProfile) form.reset(transformProfileToFormValues(userProfile));
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Helper function to transform API data to form data if needed (especially for dates)
  // const transformProfileToFormValues = (profile: UserProfile): ProfileFormValues => ({
  //   ...profile,
  //   dob: profile.dob ? parseISO(profile.dob) : new Date(),
  //   admissionDate: profile.admissionDate ? parseISO(profile.admissionDate) : undefined,
  //   recordDate: profile.recordDate ? parseISO(profile.recordDate) : undefined,
  // });


  function onSubmit(data: ProfileFormValues) {
    console.log("Profile data submitted:", data);
    // Here you would transform data back if needed, e.g., format Dates to ISO strings
    // const dataToSubmit = {
    //   ...data,
    //   dob: data.dob ? format(data.dob, "yyyy-MM-dd") : undefined,
    //   admissionDate: data.admissionDate ? format(data.admissionDate, "yyyy-MM-dd") : undefined,
    //   recordDate: data.recordDate ? format(data.recordDate, "yyyy-MM-dd") : undefined,
    // };
    toast({
      title: "信息已更新",
      description: "您的基本信息已成功保存。",
    });
  }

  if (!isClient) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-pulse">
            <div className="h-10 bg-muted rounded w-full"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Name, Gender, DOB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
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

        {/* Row 2: Address, Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>家庭住址</FormLabel>
                <FormControl>
                  <Input placeholder="请输入您的家庭住址" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2 pt-1 md:pt-7"> 
            <FormField
              control={form.control}
              name="hadPreviousCheckup"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none text-sm">以前在本机构体检过</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agreesToIntervention"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-none text-sm">同意接受健康干预服务</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Row 3: Phone, Email */}
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
                <FormLabel>E-mail (可选)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="请输入您的邮箱地址" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Row 4: Blood Type, Marital Status */}
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
                    className="flex flex-wrap gap-x-3 gap-y-2"
                  >
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="A" /></FormControl><FormLabel className="font-normal text-sm">A型</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="B" /></FormControl><FormLabel className="font-normal text-sm">B型</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="O" /></FormControl><FormLabel className="font-normal text-sm">O型</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="AB" /></FormControl><FormLabel className="font-normal text-sm">AB型</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="unknown" /></FormControl><FormLabel className="font-normal text-sm">未知</FormLabel></FormItem>
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
                    className="flex flex-wrap gap-x-3 gap-y-2"
                  >
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="unmarried" /></FormControl><FormLabel className="font-normal text-sm">未婚</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="married" /></FormControl><FormLabel className="font-normal text-sm">已婚</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="divorced" /></FormControl><FormLabel className="font-normal text-sm">离婚</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="widowed" /></FormControl><FormLabel className="font-normal text-sm">丧偶</FormLabel></FormItem>
                     <FormItem className="flex items-center space-x-1.5"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal text-sm">其他</FormLabel></FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 5: Occupation, Education Level */}
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
                      {educationLevelOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 6: Record Number, Admission Date, Record Date (Read-only for patient) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="recordNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>病案号</FormLabel>
                <FormControl><Input {...field} disabled /></FormControl>
                <FormDescription className="text-xs">由医疗机构管理</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>入院日期</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} 
                        onChange={(e) => field.onChange(e.target.value ? parseISO(e.target.value) : undefined)}
                        disabled 
                      />
                    </FormControl>
                <FormDescription className="text-xs">由医疗机构管理</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recordDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>记录日期</FormLabel>
                 <FormControl>
                      <Input 
                        type="date" 
                        value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} 
                        onChange={(e) => field.onChange(e.target.value ? parseISO(e.target.value) : undefined)}
                        disabled 
                      />
                    </FormControl>
                 <FormDescription className="text-xs">由医疗机构管理</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 7: Informant, Reliability (Read-only for patient) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="informant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>病史陈述者</FormLabel>
                <FormControl><Input {...field} disabled /></FormControl>
                <FormDescription className="text-xs">由医疗机构记录</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="reliability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>可靠程度</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled>
                  <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder="选择可靠程度" />
                      </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      {reliabilityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                 <FormDescription className="text-xs">由医疗机构评估</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="mt-8">保存更新</Button>
      </form>
    </Form>
  );
}
