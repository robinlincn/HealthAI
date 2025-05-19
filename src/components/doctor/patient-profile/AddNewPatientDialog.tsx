
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { DetailedPatientProfile, Gender, DoctorPatient } from "@/lib/types";
import { DoctorPatientProfileForm } from "./DoctorPatientProfileForm"; // Import the full form
import { useEffect, useState } from "react";

// This shell is minimal, DoctorPatientProfileForm will handle defaults for most fields
const newPatientShell: DoctorPatient = {
  id: '', // Will be generated on actual save
  name: '',
  age: 0,
  gender: 'other' as Gender, // Default, will be overridden by form
  diagnosis: '待填写',
  lastVisit: new Date().toISOString().split('T')[0],
  detailedProfile: {
    name: '',
    gender: 'other' as Gender,
    // Initialize all required fields of DetailedPatientProfile with empty/default values
    // This ensures DoctorPatientProfileForm receives a well-structured initialData
    // All optional fields can be omitted or set to undefined/null as appropriate
    // For example:
    familyMedicalHistory: [
        { relative: "self", conditions: [] }, { relative: "father", conditions: [] },
        { relative: "mother", conditions: [] }, { relative: "paternal_grandparents", conditions: [] },
        { relative: "maternal_grandparents", conditions: [] },
    ],
    currentSymptoms: [],
    allergies: [],
    operationHistory: [],
    medicationCategories: [],
    contactHistory: [],
    medicationHistory: [],
    adherence_priorityProblems: Array(4).fill(''),
    adherence_healthPromotionMethods: [],
    // ... and so on for all other fields in DetailedPatientProfile
  }
};

interface AddNewPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DetailedPatientProfile) => void;
  initialDataFromAI?: Partial<DetailedPatientProfile> | null;
}

export function AddNewPatientDialog({ isOpen, onClose, onSave, initialDataFromAI }: AddNewPatientDialogProps) {
  
  const [currentProfileDataForForm, setCurrentProfileDataForForm] = useState<Partial<DetailedPatientProfile>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialDataFromAI) {
        setCurrentProfileDataForForm({
          ...(newPatientShell.detailedProfile || {}), // Start with a base empty shell
          ...initialDataFromAI,
        });
      } else {
        // Reset to a clean slate if no AI data or if explicitly clearing
        setCurrentProfileDataForForm({ ...(newPatientShell.detailedProfile || {}) });
      }
    }
  }, [isOpen, initialDataFromAI]);

  // This patient shell is passed to DoctorPatientProfileForm
  // DoctorPatientProfileForm's internal form.reset will use its detailedProfile part
  const patientForForm: DoctorPatient = {
    ...newPatientShell,
    detailedProfile: {
      ...(newPatientShell.detailedProfile || {}),
      ...currentProfileDataForForm
    } as DetailedPatientProfile, // Cast as DetailedPatientProfile for the form
  };

  const handleFormSave = (data: DetailedPatientProfile) => {
    onSave(data); 
    onClose(); // Close dialog after saving
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={
        (open) => {
            if (!open) {
                onClose(); // Ensure parent's onClose (which clears AI data) is called
            }
        }
    }>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>添加新病人</DialogTitle>
          <DialogDescription>
            填写新病人的详细档案信息。{initialDataFromAI ? "部分信息已由AI预填充，请核对。" : ""}
          </DialogDescription>
        </DialogHeader>
        
        {/* Render the full profile form directly */}
        {/* The DoctorPatientProfileForm handles its own save button internally */}
        <div className="flex-grow overflow-y-auto pr-2">
            <DoctorPatientProfileForm
            patient={patientForForm} // Pass the shell or AI-prefilled data
            onSave={handleFormSave}
            // isEditing prop will be managed internally by DoctorPatientProfileForm or can be set to true
            />
        </div>
        {/* DialogFooter might be redundant if DoctorPatientProfileForm has its own save/cancel */}
        {/* <DialogFooter className="pt-4 mt-auto">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          </DialogClose>
          {/* Save button is now inside DoctorPatientProfileForm * /}
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

    