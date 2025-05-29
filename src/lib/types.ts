
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
export type DietaryIntakeOption = '不吃' | '<1碗' | '1-2碗' | '2-4碗' | '4-6碗' | '6-10两' | '10-15两' | '≥15两' | '≥5两' | '<1个' | '1-2个' | '2-3个' | '≥3个' | '<1杯' | '1-2杯' | '2-3杯' | '≥3杯' | '<0.5两' | '0.5-1两' | '1-2两' | '≥2两' | '<2两' | '2-6两' | '1-4两' | '4-8两' | '8-12两' | '≥12两' | '≥6碗';

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
  dob?: Date | string; // Allow string for form input, Date for state
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

  recordNumber?: string;
  admissionDate?: Date | string;
  recordDate?: Date | string;
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
  // Doctor-specific or more detailed fields from the comprehensive questionnaire
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  pastMedicalHistoryDetails?: string; // More detailed text than just selected pastIllnesses
  pastIllnesses?: string[]; // Can be a list of codes or standardized terms
  infectiousDiseases?: string[];
  vaccinationHistory?: string;
  traumaHistory?: string;
  // Personal history sub-sections
  personalHistory_birthPlaceAndResidence?: string;
  personalHistory_livingConditions?: string;
  personalHistory_drugAbuseHistory?: string;
  personalHistory_menstrualAndObstetric?: string; // Specific to female patients

  medicationHistory?: MedicationEntry[]; // Detailed medication log by doctor or patient
  // otherInfo fields are already in UserProfile, they are just more specific now
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
  source?: ConsultationSource;
}


export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
}

export interface TreatmentPlanMedication {
  id: string; // Can be a temporary ID for form handling
  drugName: string;
  dosage: string;
  frequency: string;
  notes?: string;
  medStartDate?: string; // ISO date string
  medEndDate?: string; // ISO date string
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  doctorId: string;
  planName: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  shortTermGoals?: string;
  longTermGoals?: string;
  lifestyleAdjustments?: string;
  medications: TreatmentPlanMedication[];
  isActive?: boolean;
  creationDate: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export type TreatmentAdviceStatus = '待执行' | '已执行' | '已取消' | 'pending' | 'acknowledged' | 'implemented' | 'rejected';

export interface TreatmentAdvice {
  id: string;
  patientName?: string; // For display on doctor side
  patientId: string;
  doctorId: string;
  advice: string;
  date: string; // ISO date string
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
  patientId?: string; // Optional, if we are creating for a patient not yet in system
  date: Date;
  time: string; // Format HH:MM
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation';
}

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  diagnosis: string;
  lastVisit?: string;
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
  patientName: string; // Denormalized for easier display
  content: string;
  scheduledTime: string; // ISO date string
  callAttempts: number;
  maxCallAttempts: number;
  recurrence: CallTaskRecurrence;
  wechatInfo: string; // Name of WeChat contact or group for notification
  status: CallTaskStatus;
  creationDate: string; // ISO date string
  lastAttemptTime?: string; // ISO date string
  notes?: string;
}

export interface OutboundCallGroup {
  id: string;
  enterpriseId: string; // To associate with SAAS enterprise if applicable
  name: string;
  description?: string;
  patientIds: string[]; // Array of patient User IDs
  memberCount: number;
  creationDate: string; // ISO date string
  createdByUserId?: string; // User ID of the doctor/admin who created it
}

export interface GroupOutboundCallTask {
  id: string;
  groupId: string;
  groupName: string; // Denormalized group name
  content: string;
  scheduledTime: string; // ISO date string
  callAttempts: number; // Number of times this task has run for the group (e.g., for recurring tasks)
  maxCallAttempts: number; // For a single instance if it's retryable, or total for recurring
  recurrence: CallTaskRecurrence;
  wechatInfo: string; // General notification channel for the group task
  status: CallTaskStatus;
  creationDate: string; // ISO date string
  lastExecutionTime?: string; // ISO date string
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
  creationDate: string;
  assignedResources: {
    maxUsers: number;
    maxStorageGB: number;
    maxPatients: number;
  };
  servicePackageId?: string; // Link to SaasServicePackage
  notes?: string;
}

export interface SaasDepartment {
  id: string;
  enterpriseId: string;
  name: string;
  parentDepartmentId?: string | null;
  headEmployeeId?: string | null; // FK to SaasEmployee.id
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
  roleTitle?: string; // e.g., '主任医师', '护士长'
  status: 'active' | 'invited' | 'disabled';
  joinDate: string; // ISO date string
  creationDate?: string; // When this employee record was created in SAAS
}

export interface SaasPatient {
  id: string; // This could be the same as UserProfile.user_id for linked patients
  enterpriseId: string;
  name: string;
  gender: Gender;
  dob?: string; // ISO date string
  contactPhone?: string;
  primaryDisease?: string;
  lastInteractionDate?: string; // ISO date string
  membershipLevelId?: string;
  points?: number;
}

export interface SaasServicePackage {
  id: string;
  name: string;
  type: 'basic' | 'standard' | 'premium' | 'custom';
  priceMonthly: number;
  priceAnnually?: number;
  features: string[]; // List of feature descriptions
  highlights?: string;
  maxUsers: number;
  maxStorageGB: number;
  maxPatients: number;
  isEnabled: boolean;
  creationDate?: string;
}

export interface SaasOrder {
  id: string;
  enterpriseId: string;
  servicePackageId: string;
  enterpriseName?: string; // Denormalized for display
  servicePackageName?: string; // Denormalized for display
  orderDate: string; // ISO date string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'processing';
  amount: number;
  currency: string;
  transactionId?: string;
  billingCycle: 'monthly' | 'annually' | 'one-time';
  renewalDate?: string; // ISO date string
  invoiceNumber?: string;
  notes?: string;
}

export interface SaasSystemUser {
  id: string;
  name: string;
  email: string;
  systemRoleId: string; // FK to SaasSystemRole.id
  status: 'active' | 'disabled';
  lastLogin?: string; // ISO date string
}

export interface SaasSystemRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // Array of permission strings/keys
}

export interface SaasSopService {
  id: string;
  name: string;
  type: 'Coze' | 'Dify' | 'Other';
  apiEndpoint: string;
  apiKey?: string;
  description?: string;
  status: 'active' | 'inactive' | 'error';
  creationDate: string; // ISO date string
  lastCallTimestamp?: string; // ISO date string
  callCount?: number;
  errorCount?: number;
  parameters?: string; // JSON string for fixed parameters
}

export interface SaasOutboundCallTask {
  id: string;
  name: string;
  enterpriseId?: string; // If task is specific to an enterprise
  creatingDoctorId?: string; // If created by a doctor in their portal
  creatingSaasAdminId?: string; // If created by SAAS admin
  targetType: 'individual_patient' | 'patient_group' | 'custom_list' | 'employee_group';
  targetPatientId?: string;
  targetGroupId?: string;
  targetCustomListDetails?: string; // e.g., description of the list or path to a file
  targetDescription?: string; // User-friendly description of the target (e.g., Patient Name, Group Name)
  targetDetails?: string; // DEPRECATED in favor of more specific fields, but kept for compatibility if used
  status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  creationDate: string; // ISO date string
  scheduledTime?: string; // ISO date string
  callContentSummary?: string;
  sopServiceId?: string; // FK to SaasSopServices.id if automated
  assignedToEmployeeId?: string; // FK to SaasEmployee.id if manual
  callCount?: number; // DEPRECATED, use callCountTotal
  callCountTotal?: number;
  callCountSuccess?: number;
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
  parametersJson?: string; // JSON string
  description?: string;
  creationDate: string; // ISO date string
  status?: 'active' | 'inactive';
}

export interface SaasPlatformConnection {
  id: string;
  enterpriseId?: string;
  platform: 'wechat_personal_bot' | 'wechat_enterprise_app' | 'other';
  accountName: string;
  status: 'connected' | 'disconnected' | 'error' | 'requires_reauth' | 'pending_setup';
  lastSync?: string; // ISO date string
  associatedEmployeeId?: string; // If personal bot tied to an employee
  notes?: string;
}

export interface SaasCommunityGroup {
  id: string;
  name: string;
  enterpriseId: string; // Which enterprise this group belongs to
  managingEmployeeId?: string; // Which employee from that enterprise manages it
  type: 'personal_wechat_group' | 'enterprise_wechat_group' | 'other_platform_group';
  platformGroupId?: string; // The actual ID of the group on WeChat/other platform
  description?: string;
  memberPatientIds?: string[]; // Array of SaasPatient IDs
  patientCount?: number; // Denormalized count
  platformConnectionId?: string; // FK to SaasPlatformConnection (which bot/app is monitoring this group)
  connectionStatus: 'active_sync' | 'inactive_sync' | 'error_sync' | 'not_monitored'; // Status of log syncing for this group
  lastLogSync?: string; // ISO date string
  creationDate: string; // ISO date string
  tags?: string[];
}

export interface SaasCommunityMessageLog {
  id: string;
  communityGroupId: string; // FK to SaasCommunityGroups.id
  platform: SaasPlatformConnection['platform'];
  platformGroupIdExternal?: string; // Redundant if using communityGroupId strictly
  platformMessageIdExternal?: string; // Unique ID from the messaging platform
  senderPlatformId?: string; // User ID on the messaging platform
  senderSaasUserId?: string; // FK to SaasUser.id if sender is a mapped SAAS user (doctor, admin)
  senderNameDisplay: string; // Display name of sender from platform
  messageContent: string; // The text content
  messageType: 'text' | 'image' | 'file' | 'voice' | 'system_notification' | 'video';
  fileUrl?: string; // URL if message is a file/image/video
  timestamp: string; // ISO date string of when message was sent
  loggedAt: string; // ISO date string of when message was logged into SAAS
  isBotMessage?: boolean; // If the message was from a bot connected via SaasPlatformConnection
  metadataJson?: string; // Any other platform-specific metadata
}

export interface SaasScheduledTask {
  id: string;
  name: string;
  type: 'data_backup' | 'report_generation' | 'notification_push' | 'system_cleanup' | 'external_sync';
  cronExpression: string;
  status: 'enabled' | 'disabled' | 'running' | 'error';
  lastRunAt?: string; // ISO date string
  nextRunAt?: string; // ISO date string
  lastRunStatus?: string; // Text description of last run outcome
  description?: string;
  jobHandlerIdentifier: string; // Identifier for the code/function that executes this task
}

// Mall specific types
export type SaasProductStatus = 'active' | 'draft' | 'archived';

export interface SaasFileCategory {
  id: string;
  name: string;
  description?: string;
  creationDate: string;
}

export interface SaasManagedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'doc' | 'audio' | 'video' | 'other';
  mimeType: string;
  sizeKB: number;
  url: string; // Storage URL
  uploadDate: string; // ISO date string
  uploaderUserId?: string; // User ID of the uploader
  enterpriseId?: string; // If file is associated with a specific enterprise
  category?: string; // User-defined category or SaasFileCategory.id
  description?: string;
}

export interface SaasProductCategory {
  id: string;
  name: string;
  description?: string;
  enterpriseId?: string; // Optional: if categories are enterprise-specific or global
  creationDate: string;
  productCount?: number; // Denormalized count of products in this category
}

export interface SaasProduct {
  id: string;
  enterpriseId: string; // Which enterprise owns/sells this product
  name: string;
  description?: string;
  category?: string; // Could be SaasProductCategory.id or just a string name
  price: number;
  stock: number;
  status: SaasProductStatus;
  images?: string[]; // URLs to product images
  creationDate: string; // ISO date string
  updatedAt?: string; // ISO date string
  sku?: string; // Stock Keeping Unit
  tags?: string[];
  assignedEmployeeIds?: string[]; // IDs of SaasEmployees who can sell/distribute this
  isHotSale?: boolean;
  isOnSale?: boolean;
  isDoctorRecommended?: boolean;
  discountPrice?: number;
  dataAiHint?: string;
}

export interface SaasMallOrderItem {
  productId: string;
  productName: string; // Denormalized for convenience
  quantity: number;
  priceAtOrder: number; // Price per unit at the time of order
}

export type SaasMallOrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled_user'
  | 'cancelled_admin'
  | 'refund_pending'
  | 'refunded'
  | 'return_requested'
  | 'return_approved'
  | 'return_completed';

export interface SaasMallOrder {
  id: string;
  orderNumber: string; // User-friendly order identifier
  enterpriseId: string; // The enterprise that fulfilled/sold this order
  customerId: string; // FK to SaasPatient.id or a generic customer ID
  customerName?: string; // Denormalized
  customerContact?: string; // Phone or email
  products: SaasMallOrderItem[];
  totalAmount: number;
  status: SaasMallOrderStatus;
  orderDate: string; // ISO date string
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
  notes?: string; // Customer or admin notes on the order
  lastUpdatedAt: string; // ISO date string
  salespersonEmployeeId?: string; // ID of SaasEmployee if a salesperson is associated
  salespersonName?: string; // Denormalized name of salesperson
}

export interface SaasProductDistributionAssignment {
  id: string;
  enterpriseId: string;
  productId: string;
  productName?: string; // Denormalized
  employeeId: string; // SaasEmployee.id
  employeeName?: string; // Denormalized
  commissionRate: number; // e.g., 0.10 for 10%
  status: 'active' | 'inactive' | 'paused' | 'terminated';
  assignmentDate: string; // ISO date string
  notes?: string;
}

export interface SaasMembershipLevel {
  id: string;
  enterpriseId: string; // Which enterprise this level belongs to
  name: string;
  minPoints?: number; // Points required to reach this level
  discountPercentage?: number; // e.g., 0.05 for 5% discount
  description?: string;
  permissions?: string[]; // e.g., ['early_access_sales', 'free_shipping_tier_1']
  creationDate: string;
}

export type SaasPromotionType = 'full_reduction' | 'discount' | 'buy_x_get_y' | 'limited_time_offer';
export type SaasPromotionStatus = 'active' | 'inactive' | 'scheduled' | 'expired';

export interface SaasPromotionRuleCondition {
  type: 'min_purchase_amount' | 'min_item_quantity' | 'specific_products';
  value: number | string | string[]; // e.g., 100 (for amount), 3 (for quantity), ['prod_id1', 'prod_id2']
}

export interface SaasPromotionRuleAction {
  type: 'fixed_amount_off' | 'percentage_off' | 'free_item' | 'custom_description';
  value: number | string; // e.g., 10 (for amount), 0.2 (for 20% off), 'prod_id_freebie'
}

export interface SaasPromotion {
  id: string;
  enterpriseId?: string; // Optional if platform-wide promotion
  name: string;
  description?: string;
  type: SaasPromotionType;
  startDate: string; // ISO date string
  endDate?: string;   // ISO date string
  status: SaasPromotionStatus;
  conditions?: SaasPromotionRuleCondition[]; // Simplified for now
  actions?: SaasPromotionRuleAction[];     // Simplified for now
  applicableProducts?: string[]; // Product IDs, empty or null means all products
  usageLimit?: number; // Total times this promotion can be used
  totalUsed?: number;  // How many times it has been used
}

export type SaasCouponType = 'fixed_amount' | 'percentage';
export type SaasCouponStatus = 'active' | 'inactive' | 'expired' | 'used_up';

export interface SaasCoupon {
  id: string;
  enterpriseId?: string; // Optional if platform-wide
  code: string; // Unique coupon code
  name: string;
  description?: string;
  type: SaasCouponType;
  value: number; // e.g., 10 (for amount) or 0.1 (for 10% discount)
  minPurchaseAmount?: number;
  validFrom: string; // ISO date string
  validTo: string;   // ISO date string
  maxUses?: number; // Max total uses for this coupon type
  usesPerUser?: number; // Max uses per customer
  totalUsed?: number;
  status: SaasCouponStatus;
  applicableProducts?: string[]; // Product IDs
  applicableCategories?: string[]; // Category IDs/names
}

export interface SaasPointsEarningRule {
  id: string;
  enterpriseId?: string; // Optional for platform-wide rules
  actionType: 'per_purchase_amount' | 'registration' | 'product_review' | 'custom_event';
  pointsEarned: number;
  conditionValue?: number; // e.g., For 'per_purchase_amount', this could be '100' (for every 100 RMB spent)
  description: string;
  isActive: boolean;
}

export interface SaasPointsRedemptionRule {
  id: string;
  enterpriseId?: string; // Optional
  type: 'discount_amount' | 'specific_product'; // e.g., redeem for X RMB off, or redeem for a specific product
  pointsRequired: number;
  valueOff?: number; // If type is 'discount_amount'
  redeemableProductId?: string; // If type is 'specific_product'
  description: string;
  isActive: boolean;
}

export interface SaasAdSlot {
  id: string;
  name: string; // e.g., "Homepage Banner", "Product Detail Sidebar"
  dimensions?: string; // e.g., "728x90", "300x250"
  description?: string;
}

export type SaasAdvertisementType = 'image' | 'video' | 'html';
export type SaasAdvertisementStatus = 'active' | 'inactive' | 'scheduled' | 'expired';

export interface SaasAdvertisement {
  id: string;
  enterpriseId?: string; // Optional, for enterprise-specific ads or platform-wide
  name: string;
  adSlotId: string; // FK to SaasAdSlot
  type: SaasAdvertisementType;
  assetUrl: string; // URL to image/video or HTML content itself if type is 'html'
  linkUrl: string; // Click-through URL
  startDate: string; // ISO date string
  endDate?: string;   // ISO date string, optional for ongoing ads
  status: SaasAdvertisementStatus;
  impressions?: number; // For tracking
  clicks?: number;      // For tracking
}


// For Patient App (Vue & Next.js)
export interface UserAddress {
  id: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailedAddress: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number; // Price at the time of adding to cart (could be discounted)
  quantity: number;
  image?: string; // Optional image URL for display in cart
  dataAiHint?: string;
}
```</change>
  <change>
    <file>/home/user/studio/src/app/dashboard/profile/my-addresses/page.tsx</file>
    <content><![CDATA[
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, PlusCircle, Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UserAddress } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AddressFormDialog } from '@/components/profile/AddressFormDialog'; // Import the dialog component

const mockInitialAddresses: UserAddress[] = [
  { id: 'addr1', recipientName: '张三丰', phone: '13800138001', province: '北京市', city: '北京市', district: '海淀区', detailedAddress: '中关村软件园 10号楼 A座 501室', postalCode: '100085', isDefault: true },
  { id: 'addr2', recipientName: '李小龙', phone: '13912345678', province: '广东省', city: '深圳市', district: '南山区', detailedAddress: '科技园路 88号 腾讯大厦', postalCode: '518057', isDefault: false },
];

export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setAddresses(mockInitialAddresses);
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSaveAddress = (addressData: Omit<UserAddress, 'id'> & { id?: string }) => {
    setAddresses(prevAddresses => {
      let updatedAddresses;
      if (addressData.id) { // Editing existing address
        updatedAddresses = prevAddresses.map(addr => 
          addr.id === addressData.id ? { ...addr, ...addressData } as UserAddress : addr
        );
      } else { // Adding new address
        const newAddress: UserAddress = {
          ...addressData,
          id: `addr-${Date.now().toString()}`,
        };
        updatedAddresses = [newAddress, ...prevAddresses];
      }

      // Ensure only one address is default
      if (addressData.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === (addressData.id || (updatedAddresses.find(na => na.recipientName === addressData.recipientName && na.phone === addressData.phone)?.id)) // find new ID if it's new
            ? { ...addr, isDefault: true } 
            : { ...addr, isDefault: false }
        );
      }
      return updatedAddresses;
    });

    toast({
      title: addressData.id ? "地址已更新" : "地址已添加",
      description: `收货人 ${addressData.recipientName} 的地址信息已保存。`,
    });
    setIsDialogOpen(false);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm("确定要删除此地址吗？")) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast({ title: "地址已删除" });
    }
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prevAddresses => 
      prevAddresses.map(addr => 
        addr.id === addressId 
          ? { ...addr, isDefault: true } 
          : { ...addr, isDefault: false }
      )
    );
    toast({ title: "默认地址已更新" });
  };

  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">正在加载地址信息...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          我的收货地址
        </h2>
        <Button onClick={handleAddAddress} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> 添加新地址
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center text-muted-foreground">
            <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-3" />
            <p>您还没有添加任何收货地址。</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-18rem)] pr-1"> {/* Adjusted height */}
          <div className="space-y-3">
            {addresses.map((address) => (
              <Card key={address.id} className="shadow-sm">
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{address.recipientName} <span className="text-sm font-normal text-muted-foreground ml-1">{address.phone}</span></CardTitle>
                    {address.isDefault && <Badge variant="outline" className="text-xs border-primary text-primary"><Star className="h-3 w-3 mr-1"/>默认</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
                  <p>{`${address.province} ${address.city} ${address.district}`}</p>
                  <p>{address.detailedAddress}</p>
                  {address.postalCode && <p>邮编: {address.postalCode}</p>}
                </CardContent>
                <CardContent className="p-3 pt-1 border-t flex justify-end space-x-2">
                  {!address.isDefault && (
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleSetDefault(address.id)}>
                      设为默认
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleEditAddress(address)}>
                    <Edit className="mr-1 h-3 w-3" /> 编辑
                  </Button>
                  <Button variant="destructive" size="sm" className="text-xs h-7" onClick={() => handleDeleteAddress(address.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> 删除
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      <AddressFormDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingAddress(null); }}
        onSave={handleSaveAddress}
        address={editingAddress}
      />
    </div>
  );
}
