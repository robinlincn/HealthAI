
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
  dob?: Date | string; // Allow string for form input, Date for internal use
  age?: number;
  address?: string;

  hadPreviousCheckup?: boolean;
  agreesToIntervention?: boolean;

  contactPhone?: string;
  contactEmail?: string;

  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  educationLevel?: string;

  recordNumber?: string; // Typically institution managed
  admissionDate?: Date | string; 
  recordDate?: Date | string; 
  informant?: string; // Typically institution managed
  reliability?: ReliabilityOption; // Typically institution managed

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

export interface DetailedPatientProfile extends UserProfile {
  // Basic Info fields are now mostly within UserProfile
  chiefComplaint?: string; 
  historyOfPresentIllness?: string; 
  pastMedicalHistoryDetails?: string; 
  pastIllnesses?: string[]; 
  infectiousDiseases?: string[];
  vaccinationHistory?: string;
  traumaHistory?: string;
  personalHistory_birthPlaceAndResidence?: string;
  personalHistory_livingConditions?: string;
  personalHistory_drugAbuseHistory?: string;
  personalHistory_menstrualAndObstetric?: string; 
  medicationHistory?: MedicationEntry[]; // Detailed medication records (vs categories in UserProfile)
  otherMedicalInfo?: string; // General other medical info
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

export type ConsultationSource = 'app' | 'wechat_mini_program' | 'wechat_personal' | 'wechat_group';

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorName?: string;
  doctorId?: string;
  date: string; // Consider using ISO string or Date object more consistently
  timestamp: Timestamp | Date; // Firestore timestamp or JS Date
  question: string;
  status: 'pending_reply' | 'replied' | 'closed' | 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation';
  reply?: string;
  doctorReplyTimestamp?: Timestamp | Date; // Firestore timestamp or JS Date
  attachments?: { name:string; type: 'image' | 'video' | 'document'; url?: string }[];
  source?: ConsultationSource;
}


export interface Medication { // General Medication type, might be used in plans
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
}

export interface TreatmentPlanMedication {
  id: string; // Can be a temporary ID for UI before saving
  drugName: string;
  dosage: string;
  frequency: string;
  notes?: string;
  medStartDate?: string; // ISO Date string for form compatibility
  medEndDate?: string;   // ISO Date string for form compatibility
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  doctorId: string;
  planName: string;
  startDate: string; // ISO Date string
  endDate?: string;  // ISO Date string
  shortTermGoals?: string;
  longTermGoals?: string;
  lifestyleAdjustments?: string;
  medications: TreatmentPlanMedication[];
  isActive?: boolean;
  creationDate: string; // ISO Date string
  updatedAt?: string;   // ISO Date string
}

export type TreatmentAdviceStatus = '待执行' | '已执行' | '已取消' | 'pending' | 'acknowledged' | 'implemented' | 'rejected';

export interface TreatmentAdvice {
  id: string;
  patientName?: string; // Denormalized for display
  patientId: string;
  doctorId: string;
  advice: string;
  date: string; // ISO Date string
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
    type: string; // e.g., 'image/png', 'application/pdf', 'audio/mpeg'
    size?: number; // in bytes
  };
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId?: string; // Optional if just for display
  date: Date; // Date object for react-day-picker
  time: string; // HH:MM format
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation';
}

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  diagnosis: string;
  lastVisit?: string; // YYYY-MM-DD format
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
  patientName: string; // Denormalized for easy display
  content: string;
  scheduledTime: string; // ISO string
  callAttempts: number;
  maxCallAttempts: number;
  recurrence: CallTaskRecurrence;
  wechatInfo: string; // Could be patient's WeChat ID or relevant group name
  status: CallTaskStatus;
  creationDate: string; // ISO string
  lastAttemptTime?: string; // ISO string
  notes?: string;
}

export interface OutboundCallGroup {
  id: string;
  enterpriseId: string; 
  name: string;
  description?: string;
  patientIds: string[]; // Array of patient IDs
  memberCount: number;
  creationDate: string; // ISO
  createdByUserId?: string; 
}

export interface GroupOutboundCallTask {
  id: string;
  groupId: string;
  groupName: string; // Denormalized for display
  content: string;
  scheduledTime: string; // ISO string
  callAttempts: number;
  maxCallAttempts: number;
  recurrence: CallTaskRecurrence;
  wechatInfo: string; // Could be a group name or a bot contact
  status: CallTaskStatus;
  creationDate: string; // ISO string
  lastExecutionTime?: string; // ISO string
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
  roleTitle?: string;
  status: 'active' | 'invited' | 'disabled';
  joinDate: string; // ISO string
  creationDate?: string; // ISO string
}

export interface SaasPatient { // For SAAS Customer Center
  id: string; // Matches User ID or a separate patient ID
  enterpriseId: string;
  name: string;
  gender: Gender;
  dob?: string; // YYYY-MM-DD
  contactPhone?: string;
  primaryDisease?: string; // Simplified main diagnosis
  lastInteractionDate?: string; // ISO
  membershipLevelId?: string; // Link to SaasMembershipLevel
  points?: number;
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
  enterpriseName?: string;
  servicePackageName?: string;
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
  systemRoleId: string;
  status: 'active' | 'disabled';
  lastLogin?: string; // ISO string
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
  creatingDoctorId?: string; // If doctor created
  creatingSaasAdminId?: string; // If SAAS admin created
  targetType: 'individual_patient' | 'patient_group' | 'custom_list' | 'employee_group';
  targetPatientId?: string; // If targetType is individual_patient
  targetGroupId?: string;   // If targetType is patient_group or employee_group
  targetCustomListDetails?: string; // If targetType is custom_list (e.g., description or path to list)
  targetDescription?: string; // E.g., Patient Name, Group Name for quick display
  targetDetails?: string; // Deprecated, use specific fields or targetDescription
  status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  creationDate: string; // ISO
  scheduledTime?: string; // ISO
  callContentSummary?: string;
  sopServiceId?: string; // If automated via SOP
  assignedToEmployeeId?: string; // If manual task assigned to an employee
  callCount?: number; // General counter if applicable
  callCountTotal?: number; // More specific total calls for this task instance
  callCountSuccess?: number; // Calls that were successful
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
  apiKey?: string; // Optional API key
  parametersJson?: string; // JSON string for default parameters
  description?: string;
  creationDate: string; // ISO String
  status?: 'active' | 'inactive';
}

export interface SaasPlatformConnection {
  id: string;
  enterpriseId?: string; // Can be null if it's a platform-wide connection
  platform: 'wechat_personal_bot' | 'wechat_enterprise_app' | 'other';
  accountName: string; // e.g., Bot Nickname, Enterprise App Name
  status: 'connected' | 'disconnected' | 'error' | 'requires_reauth' | 'pending_setup';
  lastSync?: string; // ISO string
  associatedEmployeeId?: string; // If personal bot tied to an employee
  notes?: string;
}

export interface SaasCommunityGroup {
  id: string;
  name: string;
  enterpriseId: string; // Which enterprise owns/manages this group
  managingEmployeeId?: string; // Employee responsible for this group
  type: 'personal_wechat_group' | 'enterprise_wechat_group' | 'other_platform_group';
  platformGroupId?: string; // External ID from WeChat, etc.
  description?: string;
  memberPatientIds?: string[]; // Array of SaasPatient IDs
  patientCount?: number; // Denormalized count
  platformConnectionId?: string; // Which SaasPlatformConnection is monitoring this group
  connectionStatus: 'active_sync' | 'inactive_sync' | 'error_sync' | 'not_monitored';
  lastLogSync?: string; // ISO string
  creationDate: string; // ISO string
  tags?: string[];
}

export interface SaasCommunityMessageLog {
  id: string;
  communityGroupId: string; // FK to SaasCommunityGroups
  platform: SaasPlatformConnection['platform']; // e.g., 'wechat_personal_bot'
  platformGroupIdExternal?: string; // Redundant? SaasCommunityGroup has it
  platformMessageIdExternal?: string; // Message ID from WeChat
  senderPlatformId?: string; // Sender's ID on the platform (e.g., WeChat wxid)
  senderSaasUserId?: string; // FK to Users table if sender is a known SAAS user (doctor, patient)
  senderNameDisplay: string; // Name displayed on platform
  messageContent: string; // For text messages
  messageType: 'text' | 'image' | 'file' | 'voice' | 'system_notification' | 'video';
  fileUrl?: string; // URL if message is image/file/video/voice
  timestamp: string; // ISO string from original message
  loggedAt: string; // ISO string when logged into SAAS system
  isBotMessage?: boolean; // If message was sent by a bot connected via SaasPlatformConnection
  metadataJson?: string; // Any other relevant metadata as JSON
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
  jobHandlerIdentifier: string; // Identifier for the code that runs this job
}

// Mall specific types
export type SaasProductStatus = 'active' | 'draft' | 'archived';

export interface SaasProductCategory {
  id: string;
  name: string;
  description?: string;
  enterpriseId?: string; // Optional: Categories can be global or enterprise-specific
  creationDate: string; // ISO string
  productCount?: number; // Denormalized: number of products in this category
}

export interface SaasProduct {
  id: string;
  enterpriseId: string; // Which enterprise owns this product
  name: string;
  description?: string;
  category?: string; // Name of the category (or ID if using a category table)
  price: number;
  stock: number;
  status: SaasProductStatus;
  images?: string[]; // Array of image URLs
  creationDate: string; // ISO string
  updatedAt?: string; // ISO string
  sku?: string; // Stock Keeping Unit
  tags?: string[];
  assignedEmployeeIds?: string[]; // IDs of employees/doctors assigned to sell/promote this
}

export interface SaasMallOrderItem {
  productId: string;
  productName: string; // Denormalized for convenience
  quantity: number;
  priceAtOrder: number; // Price at the time of order
}

export type SaasMallOrderStatus =
  | 'pending_payment' // 等待支付
  | 'paid'            // 已支付 (待处理/待发货)
  | 'processing'      // 处理中 (例如：备货中)
  | 'shipped'         // 已发货
  | 'delivered'       // 已送达
  | 'completed'       // 已完成 (例如：用户确认收货，或过自动完成时限)
  | 'cancelled_user'  // 用户取消
  | 'cancelled_admin' // 管理员/系统取消
  | 'refund_pending'  // 退款申请中
  | 'refunded'        // 已退款
  | 'return_requested'// 退货申请中
  | 'return_approved' // 退货已批准 (待用户寄回)
  | 'return_completed';// 退货已完成 (已收到退货并处理)

export interface SaasMallOrder {
  id: string;
  orderNumber: string; // Human-readable order number
  enterpriseId: string; // Which enterprise's product was sold
  customerId: string; // Patient/User ID who placed the order
  customerName?: string; // Denormalized
  customerContact?: string; // Denormalized
  products: SaasMallOrderItem[];
  totalAmount: number;
  status: SaasMallOrderStatus;
  orderDate: string; // ISO string
  paymentMethod?: string;
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
  shippingMethod?: string;
  shippingFee?: number;
  trackingNumber?: string;
  carrier?: string;
  notes?: string; // Customer notes or internal notes
  lastUpdatedAt: string; // ISO string
  salespersonEmployeeId?: string; // Employee who might get commission
  salespersonName?: string; // Denormalized
}

export interface SaasProductDistributionAssignment {
  id: string;
  enterpriseId: string;
  productId: string;
  productName?: string; // For display
  employeeId: string;
  employeeName?: string; // For display
  commissionRate: number; // e.g., 0.10 for 10%
  status: 'active' | 'inactive' | 'paused' | 'terminated';
  assignmentDate: string; // ISO string
  notes?: string;
}

export interface SaasMembershipLevel {
  id: string;
  enterpriseId: string; // Which enterprise this level belongs to
  name: string;
  minPoints?: number; // Points required to reach this level
  discountPercentage?: number; // e.g., 0.1 for 10% discount
  description?: string;
  permissions?: string[]; // e.g., ['exclusive_products', 'priority_support']
  creationDate: string; // ISO String
}
