
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
  hadPreviousCheckup?: boolean; // 新增：以前在本机构体检过
  agreesToIntervention?: boolean; // 新增：同意接受健康干预服务
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
export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  diagnosis: string;
  lastVisit: string; // ISO Date string
  avatarUrl?: string; // Optional avatar URL
  contact?: string;
  emergencyContact?: { name: string; phone: string; relationship?: string };
  pastHistory?: string;
  familyHistory?: string;
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
  maritalStatus?: MaritalStatus;
  occupation?: string;
  nationality?: string;
  birthplace?: string;
  address?: string;
  admissionDate?: string; // ISO Date String
  recordDate?: string; // ISO Date String
  informant?: string;
  reliability?: 'reliable' | 'unreliable' | 'partially_reliable';
  
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  
  pastMedicalHistoryDetails?: string;
  pastIllnesses?: string[]; // For checkboxes
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

  familyHistory_father?: string;
  familyHistory_mother?: string;
  familyHistory_siblings?: string;
  familyHistory_children?: string;

  physicalExam_temperature?: string; // e.g., "36.5 ℃"
  physicalExam_pulseRate?: string; // e.g., "75 次/分"
  physicalExam_respiratoryRate?: string; // e.g., "18 次/分"
  physicalExam_bloodPressure?: string; // e.g., "120/80 mmHg"
  physicalExam_height?: string; // e.g., "170 cm"
  physicalExam_weight?: string; // e.g., "65 kg"
  physicalExam_generalAppearance?: string;
  physicalExam_skinAndMucosa?: string;
  // ... add other specific exam fields as needed, or use a general text area

  labAuxiliaryExams?: string; // Lab and auxiliary examinations
  initialDiagnosis?: string;
  treatmentPlanOpinion?: string;

  attendingPhysician?: string;
  chiefPhysician?: string;
  recordingPhysician?: string;
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
  licenseNumber?: string; // Added for doctor specific details
  department?: string; // Added for doctor specific details
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
  maxCallAttempts: number; // Max attempts for this task
  recurrence: CallTaskRecurrence;
  wechatInfo: string; // WeChat name or group name for notification
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
  groupName: string; // Denormalized for display
  content: string;
  scheduledTime: string; // ISO string for datetime-local
  callAttempts: number; // Overall attempts for the group task trigger
  maxCallAttempts: number; // Max attempts for this group task trigger
  recurrence: CallTaskRecurrence;
  wechatInfo: string; // General WeChat info for the group notification
  status: CallTaskStatus; // Status of this specific group task trigger
  creationDate: string; // ISO string
  lastExecutionTime?: string; // ISO string for the last time this group task was triggered
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
  targetDetails: string; // e.g., Customer Segment Name, Employee Department, List Name, Patient ID
  status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  creationDate: string; // ISO date string
  scheduledTime?: string; // ISO date string
  scriptId?: string; // Link to an SOP/script
  assignedTo?: string; // Employee ID if manual
  callCount?: number;
  successCount?: number;
  notes?: string;
}

