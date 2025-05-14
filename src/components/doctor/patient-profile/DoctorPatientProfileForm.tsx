
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { DoctorPatient, DetailedPatientProfile, Gender, MaritalStatus, BloodType, FamilyMedicalHistoryEntry } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid, parse } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, Activity, Stethoscope, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const pastIllnessOptions = [
  { id: 'hypertension', label: '高血压' },
  { id: 'diabetes', label: '糖尿病' },
  { id: 'heart_disease', label: '心脏病' },
  { id: 'stroke', label: '脑卒中' },
  { id: 'copd', label: '慢阻肺' },
  { id: 'asthma', label: '哮喘' },
  { id: 'cancer', label: '恶性肿瘤' },
  { id: 'hepatitis', label: '肝炎' },
  { id: 'tuberculosis', label: '结核病' },
];

const familyMedicalHistoryEntrySchema = z.object({
  relative: z.enum(["self", "father", "mother", "paternal_grandparents", "maternal_grandparents"]),
  conditions: z.array(z.string()),
});


const patientProfileSchema = z.object({
  recordNumber: z.string().optional(),
  name: z.string().min(1, "姓名不能为空"),
  gender: z.enum(['male', 'female', 'other'] as [Gender, ...Gender[]]).optional(),
  dob: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "出生日期格式无效" }), 
  age: z.coerce.number().positive("年龄必须为正数").optional(), 
  maritalStatus: z.enum(['unmarried', 'married', 'divorced', 'widowed', 'other'] as [MaritalStatus, ...MaritalStatus[]]).optional(),
  occupation: z.string().optional(),
  nationality: z.string().optional(),
  birthplace: z.string().optional(),
  address: z.string().optional(),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码.").or(z.literal("")).optional(),
  contactEmail: z.string().email("请输入有效的邮箱地址.").or(z.literal("")).optional(),
  bloodType: z.enum(['A', 'B', 'O', 'AB', 'unknown'] as [BloodType, ...BloodType[]]).optional(),
  educationLevel: z.string().optional(), 
  hadPreviousCheckup: z.boolean().default(false).optional(),
  agreesToIntervention: z.boolean().default(false).optional(),

  admissionDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "入院日期格式无效" }),
  recordDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "记录日期格式无效" }),
  informant: z.string().optional(),
  reliability: z.enum(['reliable', 'unreliable', 'partially_reliable']).optional(),
  chiefComplaint: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),
  
  pastMedicalHistoryDetails: z.string().optional(),
  pastIllnesses: z.array(z.string()).optional(), 
  infectiousDiseases: z.array(z.string()).optional(),
  vaccinationHistory: z.string().optional(),
  
  traumaHistory: z.string().optional(),
  
  personalHistory_birthPlaceAndResidence: z.string().optional(),
  personalHistory_livingConditions: z.string().optional(),
  personalHistory_smokingHistory: z.string().optional(),
  personalHistory_drinkingHistory: z.string().optional(),
  personalHistory_drugAbuseHistory: z.string().optional(),
  personalHistory_menstrualAndObstetric: z.string().optional(),

  familyMedicalHistory: z.array(familyMedicalHistoryEntrySchema).optional(), 

  physicalExam_temperature: z.string().optional(),
  physicalExam_pulseRate: z.string().optional(),
  physicalExam_respiratoryRate: z.string().optional(),
  physicalExam_bloodPressure: z.string().optional(),
  physicalExam_height: z.string().optional(),
  physicalExam_weight: z.string().optional(),
  physicalExam_generalAppearance: z.string().optional(),
  physicalExam_skinAndMucosa: z.string().optional(),
  
  labAuxiliaryExams: z.string().optional(),
  initialDiagnosis: z.string().optional(),
  treatmentPlanOpinion: z.string().optional(),

  attendingPhysician: z.string().optional(),
  chiefPhysician: z.string().optional(),
  recordingPhysician: z.string().optional(),

  // New fields from user request
  currentSymptoms: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  operationHistory: z.array(z.string()).optional(),
  bloodTransfusionHistory: z.string().optional(),
  medicationCategories: z.array(z.string()).optional(),
  contactHistory: z.array(z.string()).optional(),
  // Fields for existing medicationHistory (detailed entries)
  medicationHistory: z.array(z.object({
    id: z.string(),
    drugName: z.string().min(1, "药物名称不能为空。"),
    dosage: z.string().min(1, "剂量不能为空。"),
    frequency: z.string().min(1, "使用频次不能为空。"),
    notes: z.string().optional(),
  })).optional(),
});

type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

interface DoctorPatientProfileFormProps {
  patient: DoctorPatient;
  onSave: (data: DetailedPatientProfile) => void;
}

const allFamilyConditions = ["高血压", "糖尿病", "冠心病", "高血脂", "肥胖", "脑卒中", "骨质疏松", "老年痴呆", "肺癌", "肝癌", "胃肠癌", "前列腺癌", "乳腺癌", "宫颈癌"];
const relativesMap: Record<FamilyMedicalHistoryEntry["relative"], string> = {
  self: "本人",
  father: "父亲",
  mother: "母亲",
  paternal_grandparents: "祖父母",
  maternal_grandparents: "外祖父母",
};
const defaultFamilyHistory: FamilyMedicalHistoryEntry[] = [
  { relative: "self", conditions: [] },
  { relative: "father", conditions: [] },
  { relative: "mother", conditions: [] },
  { relative: "paternal_grandparents", conditions: [] },
  { relative: "maternal_grandparents", conditions: [] },
];

// Options for new sections
const currentSymptomsOptions = ["心情烦躁", "情绪低落", "体重下降", "严重失眠", "健忘", "经常头痛", "头晕", "皮肤瘙痒", "视力下降", "耳鸣", "经常鼻出血", "鼻涕带血", "声音嘶哑", "气喘", "经常干咳", "咳痰带血", "心慌", "胸闷", "胸痛", "吞咽不适或梗塞感", "食欲减退", "反酸", "嗳气", "腹胀", "腹痛", "腹部包块", "便秘", "腹泻", "便血", "大便变细", "尿频", "血尿", "肢体麻痛", "无力", "腰背痛", "女性血性白带", "接触性出血"];
const allergyOptions = ["青霉素", "头孢类", "海鲜", "牛奶", "花粉或尘螨", "洗洁剂", "化妆品", "磺胺类", "链黄素", "鸡蛋", "粉尘"]; // "其他" will be a text field or handled differently if needed
const operationOptions = ["头颅（含脑）", "眼耳鼻咽喉", "颌面部及口腔", "颈部或甲状腺胸部（含肺部）", "心脏（含心脏介入）", "外周血管", "胃肠", "肝胆", "肾脏", "脊柱", "四肢及关节", "膀胱", "妇科", "乳腺", "前列腺"]; // "其它" implies a text field
const medicationCategoryOptions = ["降压药", "降糖药", "降脂药", "降尿酸药", "抗心律失常药", "缓解哮喘药物", "强的松类药物", "解热镇痛药（如布洛芬等）", "雌激素类药物", "利尿剂", "镇静剂或安眠药", "中草药", "避孕药", "抗抑郁药物"]; // "其他" implies text
const contactHistoryOptions = ["油烟", "粉烟尘", "毒、致癌物", "高温", "低温", "噪音", "辐射"];


export function DoctorPatientProfileForm({ patient, onSave }: DoctorPatientProfileFormProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(true); 

  const initialDetailedProfile = patient.detailedProfile || {};
  
  const form = useForm<PatientProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: initialDetailedProfile.name || patient.name,
      gender: initialDetailedProfile.gender || patient.gender,
      age: initialDetailedProfile.age || patient.age,
      dob: initialDetailedProfile.dob ? format(parseISO(initialDetailedProfile.dob), 'yyyy-MM-dd') : undefined,
      address: initialDetailedProfile.address || patient.contact,
      contactPhone: initialDetailedProfile.contactPhone || patient.contact,
      contactEmail: initialDetailedProfile.contactEmail,
      bloodType: initialDetailedProfile.bloodType,
      educationLevel: initialDetailedProfile.educationLevel,
      hadPreviousCheckup: initialDetailedProfile.hadPreviousCheckup || false,
      agreesToIntervention: initialDetailedProfile.agreesToIntervention || false,
      ...initialDetailedProfile, 
      admissionDate: initialDetailedProfile.admissionDate ? format(parseISO(initialDetailedProfile.admissionDate), 'yyyy-MM-dd') : undefined,
      recordDate: initialDetailedProfile.recordDate ? format(parseISO(initialDetailedProfile.recordDate), 'yyyy-MM-dd') : undefined,
      pastIllnesses: initialDetailedProfile.pastIllnesses || [],
      infectiousDiseases: initialDetailedProfile.infectiousDiseases || [],
      familyMedicalHistory: initialDetailedProfile.familyMedicalHistory && initialDetailedProfile.familyMedicalHistory.length > 0 
        ? initialDetailedProfile.familyMedicalHistory 
        : defaultFamilyHistory,
      currentSymptoms: initialDetailedProfile.currentSymptoms || [],
      allergies: initialDetailedProfile.allergies || [],
      operationHistory: initialDetailedProfile.operationHistory || [],
      bloodTransfusionHistory: initialDetailedProfile.bloodTransfusionHistory || "",
      medicationCategories: initialDetailedProfile.medicationCategories || [],
      contactHistory: initialDetailedProfile.contactHistory || [],
      medicationHistory: initialDetailedProfile.medicationHistory || [],
    },
  });
  
  useEffect(() => {
    const currentDetailedProfile = patient.detailedProfile || {};
    form.reset({
      name: currentDetailedProfile.name || patient.name,
      gender: currentDetailedProfile.gender || patient.gender,
      age: currentDetailedProfile.age || patient.age,
      dob: currentDetailedProfile.dob ? format(parseISO(currentDetailedProfile.dob), 'yyyy-MM-dd') : undefined,
      address: currentDetailedProfile.address || patient.contact,
      contactPhone: currentDetailedProfile.contactPhone || patient.contact,
      contactEmail: currentDetailedProfile.contactEmail,
      bloodType: currentDetailedProfile.bloodType,
      educationLevel: currentDetailedProfile.educationLevel,
      hadPreviousCheckup: currentDetailedProfile.hadPreviousCheckup || false,
      agreesToIntervention: currentDetailedProfile.agreesToIntervention || false,
      ...currentDetailedProfile,
      admissionDate: currentDetailedProfile.admissionDate ? format(parseISO(currentDetailedProfile.admissionDate), 'yyyy-MM-dd') : undefined,
      recordDate: currentDetailedProfile.recordDate ? format(parseISO(currentDetailedProfile.recordDate), 'yyyy-MM-dd') : undefined,
      pastIllnesses: currentDetailedProfile.pastIllnesses || [],
      infectiousDiseases: currentDetailedProfile.infectiousDiseases || [],
      familyMedicalHistory: currentDetailedProfile.familyMedicalHistory && currentDetailedProfile.familyMedicalHistory.length > 0
        ? currentDetailedProfile.familyMedicalHistory
        : defaultFamilyHistory,
      currentSymptoms: currentDetailedProfile.currentSymptoms || [],
      allergies: currentDetailedProfile.allergies || [],
      operationHistory: currentDetailedProfile.operationHistory || [],
      bloodTransfusionHistory: currentDetailedProfile.bloodTransfusionHistory || "",
      medicationCategories: currentDetailedProfile.medicationCategories || [],
      contactHistory: currentDetailedProfile.contactHistory || [],
      medicationHistory: currentDetailedProfile.medicationHistory || [],
    });
  }, [patient, form]);


  function onSubmit(data: PatientProfileFormValues) {
    console.log("Patient profile data submitted:", data);
    const detailedData: DetailedPatientProfile = {
        ...data,
        dob: data.dob ? parseISO(data.dob).toISOString() : undefined,
        admissionDate: data.admissionDate ? parseISO(data.admissionDate).toISOString() : undefined,
        recordDate: data.recordDate ? parseISO(data.recordDate).toISOString() : undefined,
        familyMedicalHistory: data.familyMedicalHistory?.map(entry => ({
          ...entry,
          conditions: entry.conditions.filter(c => c) 
        }))
    };
    onSave(detailedData);
    toast({
      title: "病人信息已更新",
      description: `${data.name} 的病历信息已成功保存。`,
    });
  }

  const renderSection = (title: string, icon?: React.ElementType, children: React.ReactNode) => {
    const IconComponent = icon;
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            {IconComponent && <IconComponent className="mr-2 h-5 w-5 text-primary" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    );
  };
  
  
  const renderCheckboxArrayField = (name: keyof PatientProfileFormValues, label: string, options: string[], otherOptionLabel?: string) => (
    <FormField
      control={form.control}
      name={name as any}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2 border rounded-md">
            {options.map((optionValue) => (
              <FormField
                key={optionValue}
                control={form.control}
                name={name as any}
                render={({ field }) => {
                  const isChecked = field.value?.includes(optionValue);
                  return (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={isChecked}
                          disabled={!isEditing}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), optionValue])
                              : field.onChange(
                                  (field.value || []).filter(
                                    (value: string) => value !== optionValue
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal leading-tight">
                        {optionValue}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          {/* TODO: Add "Other" text input if otherOptionLabel is provided */}
          <FormMessage />
        </FormItem>
      )}
    />
  );

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderSection("基本资料", Info, (
          <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>姓名</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>性别</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择性别" /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">男</SelectItem><SelectItem value="female">女</SelectItem><SelectItem value="other">其他</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel>生日</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <FormField control={form.control} name="address" className="md:col-span-2" render={({ field }) => (<FormItem><FormLabel>家庭地址</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <div className="space-y-2 pt-1 md:pt-7"> 
              <FormField control={form.control} name="hadPreviousCheckup" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!isEditing} /></FormControl><FormLabel className="font-normal">以前在本机构体检过</FormLabel><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="agreesToIntervention" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!isEditing} /></FormControl><FormLabel className="font-normal">同意接受健康干预服务</FormLabel><FormMessage /></FormItem>)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="contactPhone" render={({ field }) => (<FormItem><FormLabel>手机</FormLabel><FormControl><Input type="tel" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="bloodType" render={({ field }) => (<FormItem><FormLabel>血型</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择血型" /></SelectTrigger></FormControl><SelectContent><SelectItem value="A">A型</SelectItem><SelectItem value="B">B型</SelectItem><SelectItem value="O">O型</SelectItem><SelectItem value="AB">AB型</SelectItem><SelectItem value="unknown">未知</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>婚姻</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择婚姻状况" /></SelectTrigger></FormControl><SelectContent><SelectItem value="unmarried">未婚</SelectItem><SelectItem value="married">已婚</SelectItem><SelectItem value="divorced">离异</SelectItem><SelectItem value="widowed">丧偶</SelectItem><SelectItem value="other">其他</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="occupation" render={({ field }) => (<FormItem><FormLabel>职业</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="educationLevel" render={({ field }) => (<FormItem><FormLabel>文化程度</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择文化程度" /></SelectTrigger></FormControl><SelectContent>{educationLevelOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
          <FormField control={form.control} name="recordNumber" render={({ field }) => (<FormItem><FormLabel>病案号</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="admissionDate" render={({ field }) => (<FormItem><FormLabel>入院日期</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="recordDate" render={({ field }) => (<FormItem><FormLabel>病史记录日期</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="informant" render={({ field }) => (<FormItem><FormLabel>病史陈述者</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="reliability" render={({ field }) => (<FormItem><FormLabel>可靠程度</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="reliable">可靠</SelectItem><SelectItem value="partially_reliable">部分可靠</SelectItem><SelectItem value="unreliable">不可靠</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          </>
        ))}
        
        {renderSection("家族病史及患病情况", Activity, (
          <FormField
            control={form.control}
            name="familyMedicalHistory"
            render={() => ( 
              <FormItem>
                <Tabs defaultValue="self" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto">
                    {(form.getValues('familyMedicalHistory') || []).map((relativeEntry) => (
                      <TabsTrigger 
                        key={relativeEntry.relative} 
                        value={relativeEntry.relative} 
                        className="text-xs px-1 py-1.5 h-full"
                        disabled={!isEditing}
                      >
                        {relativesMap[relativeEntry.relative]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {(form.getValues('familyMedicalHistory') || []).map((_relativeEntry, relativeIndex) => (
                    <TabsContent key={form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)} value={form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 p-2 border rounded-md mt-2">
                        {allFamilyConditions.map((condition) => (
                          <FormField
                            key={`${form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)}-${condition}`}
                            control={form.control}
                            name={`familyMedicalHistory.${relativeIndex}.conditions`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(condition)}
                                    disabled={!isEditing}
                                    onCheckedChange={(checked) => {
                                      const currentConditions = field.value || [];
                                      return checked
                                        ? field.onChange([...currentConditions, condition])
                                        : field.onChange(currentConditions.filter((value: string) => value !== condition));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-xs font-normal leading-tight">
                                  {condition}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {renderSection("现有不适症状", Stethoscope, renderCheckboxArrayField("currentSymptoms", "选择症状", currentSymptomsOptions))}
        {renderSection("过敏史", Stethoscope, renderCheckboxArrayField("allergies", "选择过敏原", allergyOptions, "其他过敏源"))}
        {renderSection("手术史", Stethoscope, renderCheckboxArrayField("operationHistory", "选择手术史", operationOptions, "其他手术"))}
        {renderSection("输血史", Stethoscope, (
            <FormField control={form.control} name="bloodTransfusionHistory" render={({ field }) => (<FormItem><FormLabel>输血史详情</FormLabel><FormControl><Textarea rows={2} placeholder="请描述输血时间及原因" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
        ))}
        {renderSection("用药史（类别）", Stethoscope, renderCheckboxArrayField("medicationCategories", "选择用药类别", medicationCategoryOptions, "其他药物类别"))}
        {renderSection("接触史", Stethoscope, renderCheckboxArrayField("contactHistory", "选择接触史", contactHistoryOptions))}


        {renderSection("主诉、现病史", Stethoscope, (
          <>
            <FormField control={form.control} name="chiefComplaint" render={({ field }) => (<FormItem><FormLabel>主诉</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="historyOfPresentIllness" render={({ field }) => (<FormItem><FormLabel>现病史</FormLabel><FormControl><Textarea rows={4} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}

        {renderSection("既往史", Stethoscope, (
          <>
            {renderCheckboxArrayField("pastIllnesses", "主要既往疾病", pastIllnessOptions)}
            <FormField control={form.control} name="pastMedicalHistoryDetails" render={({ field }) => (<FormItem><FormLabel>其他既往史详情</FormLabel><FormControl><Textarea rows={3} placeholder="其他重要疾病、手术、外伤、输血史等" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="vaccinationHistory" render={({ field }) => (<FormItem><FormLabel>预防接种史</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}
        
        {renderSection("个人史与家族史（文字描述，备用）", Activity, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="personalHistory_smokingHistory" render={({ field }) => (<FormItem><FormLabel>吸烟史</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="personalHistory_drinkingHistory" render={({ field }) => (<FormItem><FormLabel>饮酒史</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            {/* Removed familyHistory_father, etc. as we have the structured version now */}
          </div>
        ))}

        {renderSection("体格检查 (简要)", Activity, (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <FormField control={form.control} name="physicalExam_temperature" render={({ field }) => (<FormItem><FormLabel>体温 (T)</FormLabel><FormControl><Input placeholder="℃" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_pulseRate" render={({ field }) => (<FormItem><FormLabel>脉搏 (P)</FormLabel><FormControl><Input placeholder="次/分" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_respiratoryRate" render={({ field }) => (<FormItem><FormLabel>呼吸 (R)</FormLabel><FormControl><Input placeholder="次/分" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_bloodPressure" render={({ field }) => (<FormItem><FormLabel>血压 (BP)</FormLabel><FormControl><Input placeholder="mmHg" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_height" render={({ field }) => (<FormItem><FormLabel>身高</FormLabel><FormControl><Input placeholder="cm" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_weight" render={({ field }) => (<FormItem><FormLabel>体重</FormLabel><FormControl><Input placeholder="kg" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_generalAppearance" className="col-span-2 md:col-span-3 lg:col-span-4" render={({ field }) => (<FormItem><FormLabel>一般状况及皮肤黏膜等</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        ))}
        
        {renderSection("辅助检查、诊断与治疗", Stethoscope, (
          <>
            <FormField control={form.control} name="labAuxiliaryExams" render={({ field }) => (<FormItem><FormLabel>实验室及辅助检查</FormLabel><FormControl><Textarea rows={3} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="initialDiagnosis" render={({ field }) => (<FormItem><FormLabel>初步诊断</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="treatmentPlanOpinion" render={({ field }) => (<FormItem><FormLabel>治疗意见</FormLabel><FormControl><Textarea rows={3} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}

        {renderSection("医师签名", Info, (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="attendingPhysician" render={({ field }) => (<FormItem><FormLabel>住院医师</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="chiefPhysician" render={({ field }) => (<FormItem><FormLabel>主治医师</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="recordingPhysician" render={({ field }) => (<FormItem><FormLabel>记录/进修医师</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        ))}
        
        {isEditing && (
          <div className="flex justify-end mt-8">
            <Button type="submit">保存更改</Button>
          </div>
        )}
      </form>
    </Form>
  );
}

