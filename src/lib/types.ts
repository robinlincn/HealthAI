
import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
}

export type Gender = "male" | "female" | "other";
export type BloodType = "A" | "B" | "O" | "AB" | "unknown";
export type MaritalStatus = "unmarried" | "married" | "divorced" | "widowed" | "other";


export interface UserProfile {
  name: string;
  gender: Gender;
  dob?: string; 
  address?: string;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  educationLevel?: string;
  contactPhone: string;
  contactEmail: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface FamilyMedicalHistoryEntry {
  relative: "self" | "father" | "mother" | "paternal_grandparents" | "maternal_grandparents";
  conditions: string[]; 
}

export interface MedicationEntry {
  id: string; 
  drugName: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface MedicalHistory {
  pastMedicalHistoryText?: string; 
  familyMedicalHistory?: FamilyMedicalHistoryEntry[];
  allergies?: string[]; 
  currentSymptoms?: string[];
  medicationHistory?: MedicationEntry[];
  otherMedicalInfo?: string;
  healthGoals?: string[]; 
}


export interface ExaminationReport {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string; 
  uploadDate: string;
  dataAiHint?: string;
}

export interface MealEntry {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: { name: string; quantity: string; calories?: number }[];
  date: string;
  notes?: string;
}

export interface Consultation {
  id: string; 
  patientId: string;
  patientName: string; 
  doctorName?: string; 
  doctorId?: string; 
  date: string; 
  timestamp: Timestamp | Date; 
  question: string;
  status: 'pending_reply' | 'replied' | 'closed' | 'scheduled' | 'completed' | 'cancelled'; // Added more statuses
  reply?: string;
  doctorReplyTimestamp?: Timestamp | Date; 
  attachments?: { name:string; type: 'image' | 'video' | 'document'; url?: string }[];
}


export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface TreatmentPlan {
  goals: string[];
  currentInterventions: string[];
  lastUpdated: string;
}

export interface TreatmentAdvice {
  id: string;
  advice: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'ignored';
}

export interface HealthNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'reminder';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  [key: string]: any; 
}

export interface AiAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId?: string; 
  date: Date;
  time: string; 
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation';
}

// Doctor specific types

export interface DetailedPatientProfile {
  // 基本信息
  recordNumber?: string; // 病案号
  // name, gender, age already in DoctorPatient
  maritalStatus?: MaritalStatus;
  occupation?: string;
  nationality?: string; // 民族
  birthplace?: string; // 籍贯
  // address in DoctorPatient
  admissionDate?: string; // 入院日期 (ISO Date string)
  recordDate?: string; // 病史记录日期 (ISO Date string)
  informant?: string; // 病史陈述者
  reliability?: 'reliable' | 'unreliable' | 'partially_reliable'; // 可靠程度

  // 主诉
  chiefComplaint?: string;

  // 现病史
  historyOfPresentIllness?: string;

  // 既往史 (Simplified: text for now, image shows many checkboxes)
  pastMedicalHistoryDetails?: string; // Text area for general past history
  pastIllnesses?: string[]; // For specific checkbox-like illnesses (e.g., 高血压, 糖尿病)
  infectiousDiseases?: string[]; // 传染病史
  vaccinationHistory?: string; // 预防接种史
  operationHistory?: string; // 手术史
  traumaHistory?: string; // 外伤史
  bloodTransfusionHistory?: string; // 输血史
  
  // 个人史
  personalHistory_birthPlaceAndResidence?: string; // 出生及久居地
  personalHistory_livingConditions?: string; // 生活条件
  personalHistory_smokingHistory?: string; // 吸烟史
  personalHistory_drinkingHistory?: string; // 饮酒史
  personalHistory_drugAbuseHistory?: string; // 药物滥用史
  personalHistory_menstrualAndObstetric?: string; // 月经婚育史 (if applicable)

  // 家族史
  familyHistory_father?: string; // 父亲健康状况
  familyHistory_mother?: string; // 母亲健康状况
  familyHistory_siblings?: string; // 兄弟姐妹健康状况
  familyHistory_children?: string; // 子女健康状况

  // 体格检查 (Simplified)
  physicalExam_temperature?: string; // T
  physicalExam_pulseRate?: string; // P
  physicalExam_respiratoryRate?: string; // R
  physicalExam_bloodPressure?: string; // BP (e.g., "120/80")
  physicalExam_height?: string; // 身高 cm
  physicalExam_weight?: string; // 体重 kg
  physicalExam_generalAppearance?: string; // 一般状态
  physicalExam_skinAndMucosa?: string; // 皮肤黏膜
  // ... other physical exam fields can be added as needed

  // 实验室及辅助检查
  labAuxiliaryExams?: string; // Text area for summary

  // 初步诊断
  initialDiagnosis?: string;

  // 治疗意见
  treatmentPlanOpinion?: string;

  // 签名
  attendingPhysician?: string; // 住院医师
  chiefPhysician?: string; // 主治医师
  recordingPhysician?: string; // 记录医师 (or 进修医师)
}

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  diagnosis: string; // Primary/brief diagnosis
  lastVisit: string; // ISO Date string
  avatarUrl?: string; 
  contact?: string;
  emergencyContact?: { name: string; phone: string; relationship?: string };
  // These were for brief display, might be redundant if DetailedPatientProfile is always used on detail page
  pastHistory?: string; // Brief past history
  familyHistory?: string; // Brief family history
  allergies?: string; // Brief allergies
  healthDataSummary?: string;
  reports?: ExaminationReport[];
  detailedProfile?: DetailedPatientProfile; // Embed detailed profile
}


export interface DoctorProfileDetails {
  id: string;
  name: string;
  email: string; 
  phone?: string;
  specialty?: string;
  hospitalAffiliation?: string;
  yearsOfExperience?: number;
  bio?: string;
  avatarUrl?: string; 
  licenseNumber?: string; 
  department?: string; 
}


// Outbound Call Plan Types
export type CallTaskStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type CallTaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface SingleOutboundCallTask {
  id: string;
  patientId: string;
  patientName: string;
  content: string;
  scheduledTime: string; // ISO string for datetime-local
  callAttempts: number;
  maxCallAttempts: number; 
  recurrence: CallTaskRecurrence;
  wechatInfo: string; 
  status: CallTaskStatus;
  creationDate: string; // ISO string
  lastAttemptTime?: string; // ISO string
  notes?: string;
}

export interface OutboundCallGroup {
  id: string;
  name: string;
  description?: string;
  patientIds: string[];
  memberCount: number;
  creationDate: string; // ISO string
}

export interface GroupOutboundCallTask {
  id: string;
  groupId: string;
  groupName: string; 
  content: string;
  scheduledTime: string; 
  callAttempts: number; 
  maxCallAttempts: number; 
  recurrence: CallTaskRecurrence;
  wechatInfo: string; 
  status: CallTaskStatus; 
  creationDate: string; 
  lastExecutionTime?: string; 
  notes?: string;
}


// SAAS Admin Types
export interface SaasEnterprise {
  id: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending_approval' | 'suspended';
  creationDate: string; 
  assignedResources: {
    maxUsers: number;
    maxStorageGB: number;
    maxPatients: number;
  };
  servicePackageId?: string; 
  notes?: string;
}

export interface SaasDepartment {
  id: string;
  enterpriseId: string; 
  name: string;
  parentDepartmentId?: string | null; 
  headEmployeeId?: string | null; 
  description?: string;
  creationDate: string; 
}

export interface SaasEmployee {
  id: string;
  enterpriseId: string;
  departmentId?: string | null;
  name: string;
  email: string;
  phone?: string;
  employeeNumber?: string;
  roleTitle?: string; 
  status: 'active' | 'invited' | 'disabled';
  joinDate: string; 
  creationDate?: string; 
}

export interface SaasPatient { 
  id: string;
  enterpriseId: string; 
  name: string;
  gender: Gender;
  dob?: string;
  contactPhone?: string;
  primaryDisease?: string; 
  lastInteractionDate?: string; 
}

export interface SaasServicePackage {
  id: string;
  name: string;
  type: 'basic' | 'standard' | 'premium' | 'custom';
  priceMonthly: number;
  priceAnnually?: number;
  features: string[]; 
  highlights?: string;
  maxUsers: number;
  maxStorageGB: number;
  maxPatients: number;
  isEnabled: boolean;
}

export interface SaasOrder {
  id: string;
  enterpriseId: string;
  servicePackageId: string;
  orderDate: string; 
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'processing';
  amount: number;
  currency: string; 
  transactionId?: string;
  billingCycle: 'monthly' | 'annually' | 'one-time';
  renewalDate?: string; 
  invoiceNumber?: string;
  notes?: string;
  enterpriseName?: string; 
  servicePackageName?: string;
}

export interface SaasSystemUser {
  id: string;
  name: string;
  email: string;
  systemRoleId: string; 
  status: 'active' | 'disabled';
  lastLogin?: string; 
}

export interface SaasSystemRole {
  id: string;
  name: string; 
  description?: string;
  permissions: string[]; 
}

export interface SaasSopService {
  id: string;
  name: string;
  type: 'Coze' | 'Dify' | 'Other';
  apiEndpoint: string;
  apiKey?: string; 
  description?: string;
  status: 'active' | 'inactive' | 'error';
  creationDate: string; 
  lastCallTimestamp?: string; 
  callCount?: number;
  errorCount?: number;
  parameters?: string; 
}

export interface SaasOutboundCallTask {
  id: string;
  name: string;
  targetType: 'customer_segment' | 'employee_group' | 'custom_list' | 'individual_patient';
  targetDetails: string; 
  status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  creationDate: string; 
  scheduledTime?: string; 
  scriptId?: string; 
  assignedTo?: string; 
  callCount?: number;
  successCount?: number;
  notes?: string;
}

