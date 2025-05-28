
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
  dob?: Date | string; 
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
  startDate?: string; 
  endDate?: string; 
}

export interface TreatmentPlanMedication {
  id: string; 
  drugName: string;
  dosage: string;
  frequency: string;
  notes?: string;
  medStartDate?: string; 
  medEndDate?: string;   
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  doctorId: string;
  planName: string;
  startDate: string; 
  endDate?: string;  
  shortTermGoals?: string;
  longTermGoals?: string;
  lifestyleAdjustments?: string;
  medications: TreatmentPlanMedication[];
  isActive?: boolean;
  creationDate: string; 
  updatedAt?: string;   
}

export type TreatmentAdviceStatus = '待执行' | '已执行' | '已取消' | 'pending' | 'acknowledged' | 'implemented' | 'rejected';

export interface TreatmentAdvice {
  id: string;
  patientName?: string; 
  patientId: string;
  doctorId: string;
  advice: string;
  date: string; 
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
  enterpriseId: string; 
  name: string;
  description?: string;
  patientIds: string[]; 
  memberCount: number;
  creationDate: string; 
  createdByUserId?: string; 
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
  membershipLevelId?: string; 
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
  creationDate?: string; 
}

export interface SaasOrder {
  id: string;
  enterpriseId: string;
  servicePackageId: string;
  enterpriseName?: string;
  servicePackageName?: string;
  orderDate: string; 
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'processing';
  amount: number;
  currency: string;
  transactionId?: string;
  billingCycle: 'monthly' | 'annually' | 'one-time';
  renewalDate?: string; 
  invoiceNumber?: string;
  notes?: string;
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
  enterpriseId?: string;
  creatingDoctorId?: string; 
  creatingSaasAdminId?: string; 
  targetType: 'individual_patient' | 'patient_group' | 'custom_list' | 'employee_group';
  targetPatientId?: string; 
  targetGroupId?: string;   
  targetCustomListDetails?: string; 
  targetDescription?: string; 
  targetDetails?: string; 
  status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  creationDate: string; 
  scheduledTime?: string; 
  callContentSummary?: string;
  sopServiceId?: string; 
  assignedToEmployeeId?: string; 
  callCount?: number; 
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
  parametersJson?: string; 
  description?: string;
  creationDate: string; 
  status?: 'active' | 'inactive';
}

export interface SaasPlatformConnection {
  id: string;
  enterpriseId?: string; 
  platform: 'wechat_personal_bot' | 'wechat_enterprise_app' | 'other';
  accountName: string; 
  status: 'connected' | 'disconnected' | 'error' | 'requires_reauth' | 'pending_setup';
  lastSync?: string; 
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
  lastLogSync?: string; 
  creationDate: string; 
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
  timestamp: string; 
  loggedAt: string; 
  isBotMessage?: boolean; 
  metadataJson?: string; 
}

export interface SaasScheduledTask {
  id: string;
  name: string;
  type: 'data_backup' | 'report_generation' | 'notification_push' | 'system_cleanup' | 'external_sync';
  cronExpression: string;
  status: 'enabled' | 'disabled' | 'running' | 'error';
  lastRunAt?: string; 
  nextRunAt?: string; 
  lastRunStatus?: string;
  description?: string;
  jobHandlerIdentifier: string; 
}

// Mall specific types
export type SaasProductStatus = 'active' | 'draft' | 'archived';

export interface SaasProductCategory {
  id: string;
  name: string;
  description?: string;
  enterpriseId?: string; 
  creationDate: string; 
  productCount?: number; 
}

export interface SaasProduct {
  id: string;
  enterpriseId: string; 
  name: string;
  description?: string;
  category?: string; 
  price: number;
  stock: number;
  status: SaasProductStatus;
  images?: string[]; 
  creationDate: string; 
  updatedAt?: string; 
  sku?: string; 
  tags?: string[];
  assignedEmployeeIds?: string[]; 
}

export interface SaasMallOrderItem {
  productId: string;
  productName: string; 
  quantity: number;
  priceAtOrder: number; 
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
  orderNumber: string; 
  enterpriseId: string; 
  customerId: string; 
  customerName?: string; 
  customerContact?: string; 
  products: SaasMallOrderItem[];
  totalAmount: number;
  status: SaasMallOrderStatus;
  orderDate: string; 
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
  notes?: string; 
  lastUpdatedAt: string; 
  salespersonEmployeeId?: string; 
  salespersonName?: string; 
}

export interface SaasProductDistributionAssignment {
  id: string;
  enterpriseId: string;
  productId: string;
  productName?: string; 
  employeeId: string;
  employeeName?: string; 
  commissionRate: number; 
  status: 'active' | 'inactive' | 'paused' | 'terminated';
  assignmentDate: string; 
  notes?: string;
}

export interface SaasMembershipLevel {
  id: string;
  enterpriseId: string; 
  name: string;
  minPoints?: number; 
  discountPercentage?: number; 
  description?: string;
  permissions?: string[]; 
  creationDate: string; 
}

// Marketing specific types
export type SaasPromotionType = 'full_reduction' | 'discount' | 'buy_x_get_y' | 'limited_time_offer';
export type SaasPromotionStatus = 'active' | 'inactive' | 'scheduled' | 'expired';

export interface SaasPromotionRuleCondition {
  type: 'min_purchase_amount' | 'min_item_quantity' | 'specific_products';
  value: number | string | string[]; // e.g., 100 (for amount), 3 (for quantity), ['prod_id1', 'prod_id2']
}

export interface SaasPromotionRuleAction {
  type: 'fixed_amount_off' | 'percentage_off' | 'free_item';
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
  conditions?: SaasPromotionRuleCondition[];
  actions?: SaasPromotionRuleAction[];
  applicableProducts?: string[]; // Product IDs
  usageLimit?: number;
  totalUsed?: number;
}

export type SaasCouponType = 'fixed_amount' | 'percentage';
export type SaasCouponStatus = 'active' | 'inactive' | 'expired' | 'used_up';

export interface SaasCoupon {
  id: string;
  enterpriseId?: string;
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
  enterpriseId?: string;
  actionType: 'per_purchase_amount' | 'registration' | 'product_review' | 'custom_event';
  pointsEarned: number;
  conditionValue?: number; // e.g., For 'per_purchase_amount', this could be '100' (for every 100 RMB spent)
  description: string;
  isActive: boolean;
}

export interface SaasPointsRedemptionRule {
  id: string;
  enterpriseId?: string;
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
  enterpriseId?: string;
  name: string;
  adSlotId: string; // FK to SaasAdSlot
  type: SaasAdvertisementType;
  assetUrl: string; // URL to image/video or HTML content
  linkUrl: string;
  startDate: string; // ISO date string
  endDate?: string;   // ISO date string
  status: SaasAdvertisementStatus;
  impressions?: number;
  clicks?: number;
}

    