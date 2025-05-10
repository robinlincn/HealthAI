import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface UserProfile {
  name: string;
  gender: string;
  age: number;
  contactPhone: string;
  contactEmail: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalHistory {
  diagnosis: string[];
  pastConditions: string[];
  familyHistory: string[];
  allergies: string[];
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

export interface Consultation {
  id: string;
  doctorName: string;
  date: string;
  summary: string;
  patientNotes?: string;
  doctorReply?: string;
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
  patientId?: string; // Optional: if linking to a patient record system
  date: Date;
  time: string; // e.g., "10:00 AM" or "14:30"
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation';
}
