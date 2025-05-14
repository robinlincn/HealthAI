
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
  status: 'pending_reply' | 'replied' | 'closed' | 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation';
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
  pastHistory?: string;
  // familyHistory field removed as it's now part of detailedProfile
  allergies?: string;
  healthDataSummary?: string;
  reports?: ExaminationReport[];
  detailedProfile?: DetailedPatientProfile;
}

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
  operationHistory?: string;
  traumaHistory?: string;
  bloodTransfusionHistory?: string;

  personalHistory_birthPlaceAndResidence?: string;
  personalHistory_livingConditions?: string;
  personalHistory_smokingHistory?: string;
  personalHistory_drinkingHistory?: string;
  personalHistory_drugAbuseHistory?: string;
  personalHistory_menstrualAndObstetric?: string;

  familyHistory_father?: string; // Kept for simple text input if needed, but new structure is preferred
  familyHistory_mother?: string;
  familyHistory_siblings?: string;
  familyHistory_children?: string;
  familyMedicalHistory?: FamilyMedicalHistoryEntry[]; // New structured family history

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
