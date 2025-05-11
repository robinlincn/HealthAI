
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
  status: 'pending_reply' | 'replied' | 'closed';
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
  roleTitle?: string; // e.g., "主任医师", "护士长" - This is a descriptive title within the enterprise
  status: 'active' | 'invited' | 'disabled';
  joinDate: string; 
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
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string; 
  transactionId?: string;
  renewalDate?: string; 
}


// SAAS System Specific User and Role
export interface SaasSystemUser {
  id: string;
  name: string;
  email: string;
  systemRoleId: string; // Links to SaasSystemRole
  status: 'active' | 'disabled';
  lastLogin?: string; // ISO date string
}

export interface SaasSystemRole {
  id: string;
  name: string; 
  description?: string;
  permissions: string[]; // Array of permission keys, e.g., "manage_enterprises", "view_orders"
}
