
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
import type { DoctorPatient, DetailedPatientProfile, Gender, MaritalStatus } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";


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
  // Add more common illnesses as needed
];


const patientProfileSchema = z.object({
  recordNumber: z.string().optional(),
  name: z.string().min(1, "姓名不能为空"),
  gender: z.enum(['male', 'female', 'other'] as [Gender, ...Gender[]]).optional(),
  age: z.coerce.number().positive("年龄必须为正数").optional(),
  maritalStatus: z.enum(['unmarried', 'married', 'divorced', 'widowed', 'other'] as [MaritalStatus, ...MaritalStatus[]]).optional(),
  occupation: z.string().optional(),
  nationality: z.string().optional(),
  birthplace: z.string().optional(),
  address: z.string().optional(),
  admissionDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "入院日期格式无效" }),
  recordDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "记录日期格式无效" }),
  informant: z.string().optional(),
  reliability: z.enum(['reliable', 'unreliable', 'partially_reliable']).optional(),
  chiefComplaint: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),
  
  pastMedicalHistoryDetails: z.string().optional(),
  pastIllnesses: z.array(z.string()).optional(), // For checkboxes
  infectiousDiseases: z.array(z.string()).optional(),
  vaccinationHistory: z.string().optional(),
  operationHistory: z.string().optional(),
  traumaHistory: z.string().optional(),
  bloodTransfusionHistory: z.string().optional(),

  personalHistory_birthPlaceAndResidence: z.string().optional(),
  personalHistory_livingConditions: z.string().optional(),
  personalHistory_smokingHistory: z.string().optional(),
  personalHistory_drinkingHistory: z.string().optional(),
  personalHistory_drugAbuseHistory: z.string().optional(),
  personalHistory_menstrualAndObstetric: z.string().optional(),

  familyHistory_father: z.string().optional(),
  familyHistory_mother: z.string().optional(),
  familyHistory_siblings: z.string().optional(),
  familyHistory_children: z.string().optional(),

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
});

type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

interface DoctorPatientProfileFormProps {
  patient: DoctorPatient;
  onSave: (data: DetailedPatientProfile) => void;
}

export function DoctorPatientProfileForm({ patient, onSave }: DoctorPatientProfileFormProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode

  const form = useForm<PatientProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      address: patient.contact, // Example, map appropriate fields
      ...patient.detailedProfile, // Spread detailed profile if exists
      // Ensure dates are strings for input type=date
      admissionDate: patient.detailedProfile?.admissionDate ? format(parseISO(patient.detailedProfile.admissionDate), 'yyyy-MM-dd') : undefined,
      recordDate: patient.detailedProfile?.recordDate ? format(parseISO(patient.detailedProfile.recordDate), 'yyyy-MM-dd') : undefined,
    },
  });
  
  useEffect(() => {
    form.reset({
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      address: patient.contact,
      ...patient.detailedProfile,
      admissionDate: patient.detailedProfile?.admissionDate ? format(parseISO(patient.detailedProfile.admissionDate), 'yyyy-MM-dd') : undefined,
      recordDate: patient.detailedProfile?.recordDate ? format(parseISO(patient.detailedProfile.recordDate), 'yyyy-MM-dd') : undefined,
      pastIllnesses: patient.detailedProfile?.pastIllnesses || [],
      infectiousDiseases: patient.detailedProfile?.infectiousDiseases || [],
    });
  }, [patient, form]);


  function onSubmit(data: PatientProfileFormValues) {
    console.log("Patient profile data submitted:", data);
    const detailedData: DetailedPatientProfile = {
        ...data,
        admissionDate: data.admissionDate ? parseISO(data.admissionDate).toISOString() : undefined,
        recordDate: data.recordDate ? parseISO(data.recordDate).toISOString() : undefined,
    };
    onSave(detailedData);
    setIsEditing(false); // Exit edit mode after saving
    toast({
      title: "病人信息已更新",
      description: `${patient.name} 的病历信息已成功保存。`,
    });
  }

  const renderSection = (title: string, children: React.ReactNode) => (
    <Card className="shadow-sm">
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
  
  const renderCheckboxArrayField = (name: keyof PatientProfileFormValues, label: string, options: { id: string; label: string }[]) => (
    <FormField
      control={form.control}
      name={name as any} // Type assertion for array fields
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-md">
            {options.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name={name as any}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          disabled={!isEditing}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), option.id])
                              : field.onChange(
                                  (field.value || []).filter(
                                    (value: string) => value !== option.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-end mb-4">
          <Button type="button" onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "secondary" : "default"}>
            {isEditing ? "取消编辑" : "编辑模式"}
          </Button>
        </div>

        {renderSection("基本资料", (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="recordNumber" render={({ field }) => (<FormItem><FormLabel>病案号</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>姓名</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>性别</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">男</SelectItem><SelectItem value="female">女</SelectItem><SelectItem value="other">其他</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>年龄</FormLabel><FormControl><Input type="number" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>婚否</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="unmarried">未婚</SelectItem><SelectItem value="married">已婚</SelectItem><SelectItem value="divorced">离异</SelectItem><SelectItem value="widowed">丧偶</SelectItem><SelectItem value="other">其他</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="occupation" render={({ field }) => (<FormItem><FormLabel>职业</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>民族</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="birthplace" render={({ field }) => (<FormItem><FormLabel>籍贯</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="lg:col-span-2"><FormLabel>住址</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="admissionDate" render={({ field }) => (<FormItem><FormLabel>入院日期</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="recordDate" render={({ field }) => (<FormItem><FormLabel>病史记录日期</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="informant" render={({ field }) => (<FormItem><FormLabel>病史陈述者</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="reliability" render={({ field }) => (<FormItem><FormLabel>可靠程度</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="reliable">可靠</SelectItem><SelectItem value="partially_reliable">部分可靠</SelectItem><SelectItem value="unreliable">不可靠</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
        ))}

        {renderSection("主诉、现病史", (
          <>
            <FormField control={form.control} name="chiefComplaint" render={({ field }) => (<FormItem><FormLabel>主诉</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="historyOfPresentIllness" render={({ field }) => (<FormItem><FormLabel>现病史</FormLabel><FormControl><Textarea rows={4} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}

        {renderSection("既往史", (
          <>
            {renderCheckboxArrayField("pastIllnesses", "主要既往疾病", pastIllnessOptions)}
            <FormField control={form.control} name="pastMedicalHistoryDetails" render={({ field }) => (<FormItem><FormLabel>其他既往史详情</FormLabel><FormControl><Textarea rows={3} placeholder="其他重要疾病、手术、外伤、输血史等" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="vaccinationHistory" render={({ field }) => (<FormItem><FormLabel>预防接种史</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}
        
        {renderSection("个人史与家族史", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="personalHistory_smokingHistory" render={({ field }) => (<FormItem><FormLabel>吸烟史</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="personalHistory_drinkingHistory" render={({ field }) => (<FormItem><FormLabel>饮酒史</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="familyHistory_father" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>家族史（父母、兄弟姐妹、子女健康状况）</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        ))}

        {renderSection("体格检查 (简要)", (
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
        
        {renderSection("辅助检查、诊断与治疗", (
          <>
            <FormField control={form.control} name="labAuxiliaryExams" render={({ field }) => (<FormItem><FormLabel>实验室及辅助检查</FormLabel><FormControl><Textarea rows={3} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="initialDiagnosis" render={({ field }) => (<FormItem><FormLabel>初步诊断</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="treatmentPlanOpinion" render={({ field }) => (<FormItem><FormLabel>治疗意见</FormLabel><FormControl><Textarea rows={3} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}

        {renderSection("医师签名", (
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
