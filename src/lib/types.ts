
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
export type ReliabilityOption = "reliable" | "partially_reliable" | "unreliable";

// Specific option types for reusability and clarity
export type FrequencyOption = '没有' | '1-2天' | '3-4天' | '5-6天' | '7天' | '1-2小时' | '2-5小时' | '5-8小时' | '≥8小时' | '从不' | '偶尔（1-2次/周）' | '经常（3-5次/周）' | '总是（>5次/周）';
export type DietaryIntakeOption = '不吃' | '<1碗' | '1-2碗' | '2-4碗' | '4-6碗' | '6-10两' | '10-15两' | '≥15两' | '≥5两' | '<1个' | '1-2个' | '2-3个' | '≥3个' | '<1杯' | '1-2杯' | '2-3杯' | '≥3杯' | '<0.5两' | '0.5-1两' | '≥2两' | '<2两' | '1-4两' | '4-8两' | '8-12两' | '≥12两' | '<3杯' | '3-6杯' | '6-9杯' | '9-12杯' | '≥12杯' | '≥6碗';

export type ExerciseWorkHoursOption = '没有' | '1-2小时' | '2-5小时' | '5-8小时' | '≥8小时';
export type ExerciseWeeklyFrequencyOption = '从不' | '偶尔（1-2次/周）' | '经常（3-5次/周）' | '总是（>5次/周）';
export type ExerciseDurationOption = '<10分钟' | '10-30分钟' | '30-60分钟' | '1-2小时';
export type ExerciseIntensityOption = '不锻炼' | '极轻度运动' | '轻度运动' | '中度运动' | '重度运动';

export type SmokingStatusOption = '从不' | '偶尔' | '戒烟' | '吸烟';
export type DrinkingStatusOption = '从不' | '偶尔' | '戒酒' | '饮酒';
export type AlcoholTypeOption = '白酒' | '黄酒' | '红酒' | '啤酒' | '其他';
export type YesNoOption = '是' | '否' | '不详';
export type SASOption = '没有或很少有时间有' | '小部分时间有' | '相当多时间有' | '绝大部分或全部时间都有';

export type AdherenceBodyOption = '很满意' | '满意' | '尚可' | '不太好' | '很糟糕';
export type AdherenceMindOption = '很重视' | '还算关心' | '不太在意' | '无所谓';
export type AdherenceComplianceOption = '完全执行' | '执行一部分' | '完全不执行';
export type SleepAdequacyOption = '充足' | '一般' | '不足' | '严重不足';
export type ContactPreferenceMethod = '电话' | '微信' | '短信' | '邮件' | '其他';
export type ContactPreferenceFrequency = '每周两次' | '每周一次' | '两周一次' | '根据实际情况需要' | '其他';
export type ContactPreferenceTime = '上午' | '下午' | '晚上7点后' | '其他';
export type ServiceSatisfactionOption = '满意' | '较好' | '一般' | '不满意';
export type ImpactLevelOption = '几乎没有' | '有一点' | '较明显' | '很大';


export interface UserProfile {
  name: string;
  gender?: Gender; 
  dob?: string; // Store as YYYY-MM-DD string from form
  age?: number; // Calculated or from AI
  address?: string;
  
  hadPreviousCheckup?: boolean;
  agreesToIntervention?: boolean;
  
  contactPhone?: string; 
  contactEmail?: string;
  
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  educationLevel?: string;

  // Fields usually managed by institution, patient-side read-only or not present
  recordNumber?: string; 
  admissionDate?: string; // Store as Date object for form, but ISO string for storage
  recordDate?: string; // Store as Date object for form, but ISO string for storage
  informant?: string;
  reliability?: ReliabilityOption;

  familyMedicalHistory?: FamilyMedicalHistoryEntry[];
  currentSymptoms?: string[];
  allergies?: string[];
  otherAllergyText?: string; 
  operationHistory?: string[]; 
  bloodTransfusionHistory?: string; 
  medicationCategories?: string[];
  contactHistory?: string[];

  dietaryHabits_breakfastDays?: FrequencyOption;
  dietaryHabits_lateSnackDays?: FrequencyOption;
  dietaryHabits_badHabits?: string[];
  dietaryHabits_preferences?: string[];
  dietaryHabits_foodTypePreferences?: string[];
  
  dietaryIntake_staple?: DietaryIntakeOption;
  dietaryIntake_meat?: DietaryIntakeOption;
  dietaryIntake_fish?: DietaryIntakeOption;
  dietaryIntake_eggs?: DietaryIntakeOption;
  dietaryIntake_dairy?: DietaryIntakeOption;
  dietaryIntake_soy?: DietaryIntakeOption;
  dietaryIntake_vegetables?: DietaryIntakeOption;
  dietaryIntake_fruits?: DietaryIntakeOption;
  dietaryIntake_water?: DietaryIntakeOption;

  exercise_workHours?: ExerciseWorkHoursOption;
  exercise_sedentaryHours?: ExerciseWorkHoursOption;
  exercise_weeklyFrequency?: ExerciseWeeklyFrequencyOption;
  exercise_durationPerSession?: ExerciseDurationOption;
  exercise_intensity?: ExerciseIntensityOption;

  smoking_status?: SmokingStatusOption;
  smoking_cigarettesPerDay?: string;
  smoking_years?: string;
  smoking_passiveDays?: FrequencyOption;

  drinking_status?: DrinkingStatusOption;
  drinking_type?: AlcoholTypeOption | string;
  drinking_type_other?: string;
  drinking_amountPerDay?: string;
  drinking_years?: string;
  
  mentalHealth_majorEvents?: YesNoOption;
  mentalHealth_impactOnLife?: ImpactLevelOption;
  mentalHealth_stressLevel?: ImpactLevelOption;
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
  adherence_priorityProblems?: string[]; 
  adherence_doctorAdviceCompliance?: AdherenceComplianceOption;
  adherence_healthPromotionMethods?: string[];
  adherence_otherHealthPromotion?: string;

  sleep_adequacy?: SleepAdequacyOption;

  otherInfo_medicationsUsed?: string;
  otherInfo_contactPreference_method?: ContactPreferenceMethod | string; 
  otherInfo_contactPreference_method_other?: string;
  otherInfo_contactPreference_frequency?: ContactPreferenceFrequency | string; 
  otherInfo_contactPreference_frequency_other?: string;
  otherInfo_contactPreference_time?: ContactPreferenceTime | string; 
  otherInfo_contactPreference_time_other?: string;
  otherInfo_suggestions?: string;
  otherInfo_serviceSatisfaction?: ServiceSatisfactionOption;

  // Fields for general medical history, distinct from detailed questionnaire
  pastIllnesses?: string[];
  infectiousDiseases?: string[];
  vaccinationHistory?: string;
  traumaHistory?: string;
  personalHistory_birthPlaceAndResidence?: string;
  personalHistory_livingConditions?: string;
  personalHistory_drugAbuseHistory?: string;
  personalHistory_menstrualAndObstetric?: string; // For female patients

  medicationHistory?: MedicationEntry[]; // Detailed medication history
  otherMedicalInfo?: string; 
  healthGoals?: string[]; 
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

// Represents a more comprehensive profile, typically managed by doctors
export interface DetailedPatientProfile extends UserProfile { 
  chiefComplaint?: string; // 主诉
  historyOfPresentIllness?: string; // 现病史
  pastMedicalHistoryDetails?: string; // 既往史文本补充 (if needed beyond pastIllnesses array)
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

export type ConsultationSource = 'app' | 'wechat_mini_program' | 'wechat_personal' | 'wechat_group';

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
  source?: ConsultationSource; // New field for consultation source
}


export interface Medication { // This is for PATIENT-side medication plan viewing
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
}

// For Doctor-side Treatment Plan Medication details
export interface TreatmentPlanMedication {
  id: string; // for useFieldArray key
  drugName: string;
  dosage: string;
  frequency: string;
  notes?: string;
  medStartDate?: string; // ISO string date for individual medication start
  medEndDate?: string;   // ISO string date for individual medication end
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  doctorId: string; 
  planName: string;
  startDate: string; // ISO string date
  endDate?: string;  // ISO string date
  shortTermGoals?: string;
  longTermGoals?: string;
  lifestyleAdjustments?: string;
  medications: TreatmentPlanMedication[];
  isActive?: boolean;
  creationDate: string; // ISO string date
  updatedAt?: string;   // ISO string date
}

export type TreatmentAdviceStatus = '待执行' | '已执行' | '已取消' | 'pending' | 'acknowledged' | 'implemented' | 'rejected';

export interface TreatmentAdvice {
  id: string;
  patientName?: string; 
  patientId: string;   
  doctorId: string;    
  advice: string; // Advice content
  date: string; // ISO string date for when the advice was given
  status: TreatmentAdviceStatus;
  patientFeedback?: string;
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
  attachment?: {
    name: string;
    type: string; 
    size?: number; 
  };
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

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  diagnosis: string;
  lastVisit: string; 
  avatarUrl?: string;
  contact?: string;
  emergencyContact?: { name: string; phone: string; relationship?: string };
  healthDataSummary?: string;
  reports?: ExaminationReport[];
  detailedProfile?: DetailedPatientProfile;
  currentTreatmentPlan?: TreatmentPlan; 
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

export type CallTaskStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type CallTaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface SingleOutboundCallTask {
  id: string;
  patientId: string;
  patientName: string;
  content: string;
  scheduledTime: string; // ISO
  callAttempts: number;
  maxCallAttempts: number;
  recurrence: CallTaskRecurrence;
  wechatInfo: string;
  status: CallTaskStatus;
  creationDate: string; // ISO
  lastAttemptTime?: string; // ISO
  notes?: string;
}

export interface OutboundCallGroup {
  id: string;
  enterpriseId: string;
  name: string;
  description?: string;
  patientIds: string[];
  memberCount: number;
  creationDate: string; // ISO
  createdByUserId?: string; // Can be doctor's user_id or saas_admin_id
}

export interface GroupOutboundCallTask {
  id: string;
  groupId: string;
  groupName: string; // For display convenience
  content: string;
  scheduledTime: string; // ISO
  callAttempts: number;
  maxCallAttempts: number;
  recurrence: CallTaskRecurrence;
  wechatInfo: string; // e.g., group name for notification
  status: CallTaskStatus;
  creationDate: string; // ISO
  lastExecutionTime?: string; // ISO
  notes?: string;
}

// SAAS Types
export interface SaasEnterprise {
  id: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending_approval' | 'suspended';
  creationDate: string; // ISO string
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
  creationDate: string; // ISO string
}

export interface SaasEmployee {
  id: string;
  enterpriseId: string; 
  departmentId?: string | null;
  name: string;
  email: string;
  phone?: string;
  employeeNumber?: string;
  roleTitle?: string; // Descriptive role within the enterprise
  status: 'active' | 'invited' | 'disabled';
  joinDate: string; // ISO string
  creationDate?: string; // ISO string
}

export interface SaasPatient {
  id: string;
  enterpriseId: string;
  name: string;
  gender: Gender;
  dob?: string; // YYYY-MM-DD
  contactPhone?: string;
  primaryDisease?: string;
  lastInteractionDate?: string; // ISO
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
  creationDate?: string; // ISO string
}

export interface SaasOrder {
  id: string;
  enterpriseId: string;
  servicePackageId: string;
  enterpriseName?: string; // For display convenience
  servicePackageName?: string; // For display convenience
  orderDate: string; // ISO string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'processing';
  amount: number;
  currency: string;
  transactionId?: string;
  billingCycle: 'monthly' | 'annually' | 'one-time';
  renewalDate?: string; // ISO string
  invoiceNumber?: string;
  notes?: string;
}

export interface SaasSystemUser {
  id: string;
  name: string;
  email: string;
  systemRoleId: string; // FK to SaasSystemRole
  status: 'active' | 'disabled';
  lastLogin?: string; // ISO string
}

export interface SaasSystemRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // Array of permission strings
}

export interface SaasSopService {
  id: string;
  name: string;
  type: 'Coze' | 'Dify' | 'Other';
  apiEndpoint: string;
  apiKey?: string; 
  description?: string;
  status: 'active' | 'inactive' | 'error';
  creationDate: string; // ISO
  lastCallTimestamp?: string; // ISO
  callCount?: number;
  errorCount?: number;
  parameters?: string; // JSON string for extra parameters
}

export interface SaasOutboundCallTask {
  id: string;
  name: string;
  enterpriseId?: string;      
  creatingDoctorId?: string; 
  creatingSaasAdminId?: string; 
  targetType: 'individual_patient' | 'patient_group' | 'custom_list' | 'employee_group'; 
  targetPatientId?: string;
  targetGroupId?: string;      
  targetCustomListDetails?: string; 
  targetDescription?: string; 
  targetDetails?: string; // Fallback for older data or if targetDescription not specific enough
  status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  creationDate: string; // ISO
  scheduledTime?: string; // ISO
  callContentSummary?: string; 
  sopServiceId?: string;   
  assignedToEmployeeId?: string; 
  callCount?: number; // Total calls for this task
  callCountSuccess?: number; // Successful calls
  callCountTotal?: number; // Renamed for clarity (or use callCount if it means total attempts)
  completionStatus?: 'success_all' | 'partial_success' | 'failed_all' | 'not_applicable'; 
  notes?: string;
}

export interface SaasLlmSettings { 
  apiKey: string;
  apiEndpoint: string;
  modelName: string;
}

export interface SaasAiWorkflowApiConfig {
  id: string;
  name: string;
  type: 'Dify' | 'Coze' | 'Other';
  apiEndpoint: string;
  apiKey?: string;       
  parametersJson?: string; 
  description?: string;  
  creationDate: string;   // ISO string
  status?: 'active' | 'inactive'; 
}

export interface SaasPlatformConnection {
  id: string;
  enterpriseId?: string; 
  platform: 'wechat_personal_bot' | 'wechat_enterprise_app' | 'other';
  accountName: string; 
  status: 'connected' | 'disconnected' | 'error' | 'requires_reauth' | 'pending_setup';
  lastSync?: string; // ISO string
  associatedEmployeeId?: string; 
  notes?: string;
}

export interface SaasCommunityGroup {
  id: string;
  name: string; 
  enterpriseId: string; 
  managingEmployeeId?: string; 
  type: 'personal_wechat_group' | 'enterprise_wechat_group' | 'other_platform_group';
  platformGroupId?: string; 
  description?: string;
  memberPatientIds?: string[]; 
  patientCount?: number; 
  platformConnectionId?: string; 
  connectionStatus: 'active_sync' | 'inactive_sync' | 'error_sync' | 'not_monitored';
  lastLogSync?: string; // ISO string
  creationDate: string; // ISO string
  tags?: string[]; 
}

export interface SaasCommunityMessageLog { 
  id: string;
  communityGroupId: string; 
  platform: SaasPlatformConnection['platform']; 
  platformGroupIdExternal?: string; 
  platformMessageIdExternal?: string; 
  senderPlatformId?: string; 
  senderSaasUserId?: string; 
  senderNameDisplay: string; 
  messageContent: string;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'system_notification' | 'video';
  fileUrl?: string;
  timestamp: string; // ISO string
  loggedAt: string; // ISO string
  isBotMessage?: boolean;
  metadataJson?: string; 
}
    
export interface SaasScheduledTask {
  id: string;
  name: string;
  type: 'data_backup' | 'report_generation' | 'notification_push' | 'system_cleanup' | 'external_sync';
  cronExpression: string;
  status: 'enabled' | 'disabled' | 'running' | 'error';
  lastRunAt?: string; // ISO string
  nextRunAt?: string; // ISO string
  lastRunStatus?: string; 
  description?: string;
  jobHandlerIdentifier: string;
}

// Mall specific types
export type SaasProductStatus = 'active' | 'draft' | 'archived';

export interface SaasProduct {
  id: string;
  enterpriseId: string; 
  name: string;
  description?: string;
  category?: string; 
  price: number;
  stock: number;
  status: SaasProductStatus; 
  images?: string[]; // URLs
  creationDate: string; // ISO string
  updatedAt?: string; // ISO string
  sku?: string; 
  tags?: string[];
  assignedEmployeeIds?: string[]; // New field for assigned sales staff
}

export interface SaasMallOrderItem {
  productId: string;
  productName: string; // Denormalized for easier display
  quantity: number;
  priceAtOrder: number; // Price per unit at the time of order
}

export type SaasMallOrderStatus = 
  | 'pending_payment'  // 待支付
  | 'paid'             // 已支付 (待处理)
  | 'processing'       // 处理中 (例如：备货中)
  | 'shipped'          // 已发货
  | 'delivered'        // 已送达
  | 'completed'        // 已完成 (例如：用户确认收货后)
  | 'cancelled_user'   // 用户取消
  | 'cancelled_admin'  // 管理员取消
  | 'refund_pending'   // 退款中
  | 'refunded'         // 已退款
  | 'return_requested' // 请求退货
  | 'return_approved'  // 退货已批准
  | 'return_completed'; // 退货完成

export interface SaasMallOrder {
  id: string; // Unique order ID, e.g., "MALL-ORD-20240519-00001"
  orderNumber: string; // User-friendly order number
  enterpriseId: string; // Which enterprise/hospital is the seller
  customerId: string; // ID of the customer (could be a patient User ID or a separate mall customer ID)
  customerName?: string; // Denormalized
  customerContact?: string; // Phone or email
  products: SaasMallOrderItem[];
  totalAmount: number; // Total order value
  status: SaasMallOrderStatus;
  orderDate: string; // ISO string
  paymentMethod?: string; // e.g., "WeChat Pay", "Alipay", "Credit Card"
  paymentTransactionId?: string;
  shippingAddress?: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  shippingMethod?: string; // e.g., "Standard Express", "SF Express"
  shippingFee?: number;
  trackingNumber?: string;
  carrier?: string;
  notes?: string; // Customer notes or internal notes
  lastUpdatedAt: string; // ISO string
}

