
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
  hadPreviousCheckup?: boolean; 
  agreesToIntervention?: boolean; 
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

export interface MedicalHistory { // This is for patient-side form, might need to align with DetailedPatientProfile
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
  status: 'pending_reply' | 'replied' | 'closed' | 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation';
  reply?: string;
  doctorReplyTimestamp?: Timestamp | Date; 
  attachments?: { name:string; type: 'image' | 'video' | 'document'; url?: string }[];
}


export interface Medication { // General Medication type, matches MedicationEntry for now
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
export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  diagnosis: string;
  lastVisit: string; // ISO Date string
  avatarUrl?: string; 
  contact?: string;
  emergencyContact?: { name: string; phone: string; relationship?: string };
  // pastHistory removed, covered in detailedProfile
  // allergies removed, covered in detailedProfile
  healthDataSummary?: string;
  reports?: ExaminationReport[];
  detailedProfile?: DetailedPatientProfile;
}

export type DietaryIntakeOption = '不吃' | '<1两' | '1-2两' | '2-4碗' | '2-5两' | '4-6碗' | '6-10两' | '10-15两' | '≥15两' | '≥5两' | '<1个' | '1-2个' | '2-3个' | '≥3个' | '<1杯' | '1-2杯' | '2-3杯' | '≥3杯' | '<0.5两' | '0.5-1两' | '≥2两' | '1-4两' | '4-8两' | '8-12两' | '≥12两' | '<2两' | '<3杯' | '3-6杯' | '6-9杯' | '9-12杯' | '≥12杯' | '≥6碗';
export type YesNoOption = '是' | '否' | '不详';
export type FrequencyOption = '没有' | '1-2天' | '3-4天' | '5-6天' | '7天' | '1-2小时' | '2-5小时' | '5-8小时' | '≥8小时' | '从不' | '偶尔（1-2次/周）' | '经常（3-5次/周）' | '总是（>5次/周）' | '<10分钟' | '10-30分钟' | '30-60分钟' | '1-2小时';
export type ExerciseIntensityOption = '不锻炼' | '极轻度运动' | '轻度运动' | '中度运动' | '重度运动';
export type SmokingStatusOption = '从不' | '偶尔' | '戒烟' | '吸烟';
export type DrinkingStatusOption = '从不' | '偶尔' | '戒酒' | '饮酒';
export type AlcoholTypeOption = '白酒' | '黄酒' | '红酒' | '啤酒' | '其他';
export type SASOption = '没有或很少有时间有' | '小部分时间有' | '相当多时间有' | '绝大部分或全部时间都有';
export type AdherenceBodyOption = '很满意' | '满意' | '尚可' | '不太好' | '很糟糕';
export type AdherenceMindOption = '很重视' | '还算关心' | '不太在意' | '无所谓';
export type AdherenceComplianceOption = '完全执行' | '执行一部分' | '完全不执行';
export type SleepAdequacyOption = '充足' | '一般' | '不足' | '严重不足';
export type ContactPreferenceMethod = '电话' | '微信' | '短信' | '邮件' | '其他';
export type ContactPreferenceFrequency = '每周两次' | '每周一次' | '两周一次' | '根据实际情况需要' | '其他';
export type ContactPreferenceTime = '上午' | '下午' | '晚上7点后' | '其他';
export type ServiceSatisfactionOption = '满意' | '较好' | '一般' | '不满意';


export interface DetailedPatientProfile {
  recordNumber?: string;
  name: string;
  gender?: Gender;
  age?: number;
  dob?: string; 
  maritalStatus?: MaritalStatus;
  occupation?: string;
  nationality?: string;
  birthplace?: string;
  address?: string;
  admissionDate?: string; 
  recordDate?: string; 
  informant?: string;
  reliability?: 'reliable' | 'unreliable' | 'partially_reliable';
  
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  
  pastMedicalHistoryDetails?: string;
  pastIllnesses?: string[]; 
  infectiousDiseases?: string[];
  vaccinationHistory?: string;
  operationHistory?: string[]; // Changed to string array for checkbox selection
  traumaHistory?: string;
  bloodTransfusionHistory?: string; // Text field for description

  personalHistory_birthPlaceAndResidence?: string;
  personalHistory_livingConditions?: string;
  personalHistory_smokingHistory?: string; // Consider structuring this like smoking_status below
  personalHistory_drinkingHistory?: string; // Consider structuring this like drinking_status below
  personalHistory_drugAbuseHistory?: string;
  personalHistory_menstrualAndObstetric?: string;

  familyMedicalHistory?: FamilyMedicalHistoryEntry[];

  physicalExam_temperature?: string; 
  physicalExam_pulseRate?: string; 
  physicalExam_respiratoryRate?: string; 
  physicalExam_bloodPressure?: string; 
  physicalExam_height?: string; 
  physicalExam_weight?: string; 
  physicalExam_generalAppearance?: string;
  physicalExam_skinAndMucosa?: string;
  
  labAuxiliaryExams?: string; 
  initialDiagnosis?: string;
  treatmentPlanOpinion?: string;

  attendingPhysician?: string;
  chiefPhysician?: string;
  recordingPhysician?: string;

  bloodType?: BloodType;
  educationLevel?: string; 
  hadPreviousCheckup?: boolean;
  agreesToIntervention?: boolean;
  contactPhone?: string; 
  contactEmail?: string; 
  
  currentSymptoms?: string[];
  allergies?: string[]; 
  medicationHistory?: MedicationEntry[]; // Detailed medication entries
  medicationCategories?: string[]; // For the new checkbox list of drug categories
  contactHistory?: string[]; 

  // Detailed lifestyle questions
  contactHistory_oy?: YesNoOption; // 油烟
  contactHistory_dust?: YesNoOption; // 粉烟尘
  contactHistory_toxic?: YesNoOption; // 毒、致癌物
  contactHistory_highTemp?: YesNoOption; // 高温
  contactHistory_lowTemp?: YesNoOption; // 低温
  contactHistory_noise?: YesNoOption; // 噪音
  contactHistory_radiation?: YesNoOption; // 辐射

  dietaryHabits_breakfastDays?: FrequencyOption;
  dietaryHabits_lateSnackDays?: FrequencyOption;
  dietaryHabits_badHabits?: string[]; // e.g., ["吃饭时喝水", "吃饭过快"]
  dietaryHabits_preferences?: string[]; // e.g., ["咸", "甜"]
  dietaryHabits_foodTypePreferences?: string[]; // e.g., ["油炸食品"]

  dietaryIntake_staple?: DietaryIntakeOption;
  dietaryIntake_meat?: DietaryIntakeOption;
  dietaryIntake_fish?: DietaryIntakeOption;
  dietaryIntake_eggs?: DietaryIntakeOption;
  dietaryIntake_dairy?: DietaryIntakeOption;
  dietaryIntake_soy?: DietaryIntakeOption;
  dietaryIntake_vegetables?: DietaryIntakeOption;
  dietaryIntake_fruits?: DietaryIntakeOption;
  dietaryIntake_water?: DietaryIntakeOption;

  exercise_workHours?: FrequencyOption;
  exercise_sedentaryHours?: FrequencyOption;
  exercise_weeklyFrequency?: FrequencyOption;
  exercise_durationPerSession?: FrequencyOption;
  exercise_intensity?: ExerciseIntensityOption;

  smoking_status?: SmokingStatusOption;
  smoking_cigarettesPerDay?: string; // E.g., "<5支", "5-15支"
  smoking_years?: string; // E.g., "<1年", "1-5年"
  smoking_passiveDays?: FrequencyOption;

  drinking_status?: DrinkingStatusOption;
  drinking_type?: AlcoholTypeOption;
  drinking_amountPerDay?: string; // E.g., "<2两"
  drinking_years?: string; // E.g., "<5年"

  mentalHealth_majorEvents?: YesNoOption;
  mentalHealth_impactOnLife?: '几乎没有' | '有一点' | '较明显' | '很大';
  mentalHealth_stressLevel?: '几乎没有' | '有一点' | '较明显' | '很大';
  mentalHealth_sas_anxiety?: SASOption;
  mentalHealth_sas_fear?: SASOption;
  mentalHealth_sas_panic?: SASOption;
  mentalHealth_sas_goingCrazy?: SASOption;
  mentalHealth_sas_misfortune?: SASOption;
  mentalHealth_sas_trembling?: SASOption;
  mentalHealth_sas_bodyPain?: SASOption;
  mentalHealth_sas_fatigue?: SASOption;
  mentalHealth_sas_restlessness?: SASOption;
  mentalHealth_sas_palpitations?: SASOption;
  mentalHealth_sas_dizziness?: SASOption;
  mentalHealth_sas_fainting?: SASOption;
  mentalHealth_sas_breathingDifficulty?: SASOption;
  mentalHealth_sas_paresthesia?: SASOption;
  mentalHealth_sas_stomachPain?: SASOption;
  mentalHealth_sas_frequentUrination?: SASOption;
  mentalHealth_sas_sweating?: SASOption;

  adherence_selfAssessmentBody?: AdherenceBodyOption;
  adherence_selfAssessmentMind?: AdherenceMindOption;
  adherence_priorityProblems?: string[]; // Store as array of strings
  adherence_doctorAdviceCompliance?: AdherenceComplianceOption;
  adherence_healthPromotionMethods?: string[]; // e.g., ["改变饮食习惯", "药物"]
  adherence_otherHealthPromotion?: string; // For "其他" text input

  sleep_adequacy?: SleepAdequacyOption;

  otherInfo_medicationsUsed?: string; // Text area for currently used meds
  otherInfo_contactPreference_method?: ContactPreferenceMethod | string; // Allow '其他'
  otherInfo_contactPreference_method_other?: string;
  otherInfo_contactPreference_frequency?: ContactPreferenceFrequency | string;
  otherInfo_contactPreference_frequency_other?: string;
  otherInfo_contactPreference_time?: ContactPreferenceTime | string;
  otherInfo_contactPreference_time_other?: string;
  otherInfo_suggestions?: string; // Text area
  otherInfo_serviceSatisfaction?: ServiceSatisfactionOption;
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
  scheduledTime: string; 
  callAttempts: number;
  maxCallAttempts: number; 
  recurrence: CallTaskRecurrence;
  wechatInfo: string; 
  status: CallTaskStatus;
  creationDate: string; 
  lastAttemptTime?: string; 
  notes?: string;
}

export interface OutboundCallGroup {
  id: string;
  name: string;
  description?: string;
  patientIds: string[];
  memberCount: number;
  creationDate: string; 
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
