
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
  // age: number; // Replaced by dob for better precision
  dob?: string; // Date of Birth YYYY-MM-DD
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
  conditions: string[]; // Array of condition names
}

export interface MedicationEntry {
  id: string; // for useFieldArray key
  drugName: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface MedicalHistory {
  // diagnosis: string[]; // This seems to be covered by pastConditions or a more general diagnosis field
  pastMedicalHistoryText?: string; // Replaces pastConditions for a single textarea
  familyMedicalHistory?: FamilyMedicalHistoryEntry[];
  allergies?: string[]; // Kept as array of strings for simplicity
  currentSymptoms?: string[];
  medicationHistory?: MedicationEntry[];
  otherMedicalInfo?: string;
  healthGoals?: string[]; // For "您最希望解决的健康问题"
}


export interface ExaminationReport {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string; // or File object for upload
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

// Updated Consultation type for Firestore linkage
export interface Consultation {
  id: string; // Firestore document ID
  patientId: string;
  patientName: string; // Denormalized for doctor's UI
  doctorName?: string; // Assigned doctor or department
  doctorId?: string; // Actual doctor user ID
  date: string; // YYYY-MM-DD string, derived from timestamp for display
  timestamp: Timestamp | Date; // Firestore Timestamp on write/read, Date object in app state
  question: string;
  status: 'pending_reply' | 'replied' | 'closed';
  reply?: string;
  doctorReplyTimestamp?: Timestamp | Date; // Firestore Timestamp or Date object
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
  [key: string]: any; // For multiple lines or additional data
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
