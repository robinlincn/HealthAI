
import type { ExtractProfileInfoOutput } from "@/ai/flows/extract-profile-info-flow";
import type {
  DetailedPatientProfile,
  Gender,
  BloodType,
  MaritalStatus,
  ReliabilityOption,
  FrequencyOption,
  DietaryIntakeOption,
  ExerciseWorkHoursOption,
  ExerciseWeeklyFrequencyOption,
  ExerciseDurationOption,
  ExerciseIntensityOption,
  SmokingStatusOption,
  DrinkingStatusOption,
  AlcoholTypeOption,
  YesNoOption,
  ImpactLevelOption,
  SASOption,
  AdherenceBodyOption,
  AdherenceMindOption,
  AdherenceComplianceOption,
  SleepAdequacyOption,
  ContactPreferenceMethod,
  ContactPreferenceFrequency,
  ContactPreferenceTime,
  ServiceSatisfactionOption,
  FamilyMedicalHistoryEntry
} from "@/lib/types";
import { isValid, parseISO, format } from "date-fns";

// Define default empty states for structure matching DetailedPatientProfile
const defaultDetailedProfileBase: Omit<DetailedPatientProfile, 'id' | 'name' | 'gender' | 'age' | 'dob' > = {
  familyMedicalHistory: [
    { relative: "self", conditions: [] }, { relative: "father", conditions: [] },
    { relative: "mother", conditions: [] }, { relative: "paternal_grandparents", conditions: [] },
    { relative: "maternal_grandparents", conditions: [] },
  ],
  currentSymptoms: [],
  allergies: [],
  otherAllergyText: "",
  operationHistory: [],
  medicationCategories: [],
  contactHistory: [],
  medicationHistory: [],
  adherence_priorityProblems: Array(4).fill(''),
  adherence_healthPromotionMethods: [],
  pastIllnesses: [],
  infectiousDiseases: [],
};


export function mapAiOutputToDetailedProfile(aiOutput: ExtractProfileInfoOutput): Partial<DetailedPatientProfile> {
  const mappedProfile: Partial<DetailedPatientProfile> = {};

  // Basic Info
  if (aiOutput.name) mappedProfile.name = aiOutput.name;
  if (aiOutput.gender) mappedProfile.gender = aiOutput.gender as Gender;
  if (aiOutput.dob) {
    try {
      const parsedDate = parseISO(aiOutput.dob); // AI output is YYYY-MM-DD string
      if (isValid(parsedDate)) {
        mappedProfile.dob = format(parsedDate, 'yyyy-MM-dd'); // Store as "yyyy-MM-dd" string for form
      } else {
        console.warn("AI returned invalid DOB string:", aiOutput.dob);
      }
    } catch (e) {
      console.warn("Error parsing DOB from AI:", aiOutput.dob, e);
    }
  }
  if (aiOutput.address) mappedProfile.address = aiOutput.address;
  if (typeof aiOutput.hadPreviousCheckup === 'boolean') mappedProfile.hadPreviousCheckup = aiOutput.hadPreviousCheckup;
  if (typeof aiOutput.agreesToIntervention === 'boolean') mappedProfile.agreesToIntervention = aiOutput.agreesToIntervention;
  if (aiOutput.contactPhone) mappedProfile.contactPhone = aiOutput.contactPhone;
  if (aiOutput.contactEmail) mappedProfile.contactEmail = aiOutput.contactEmail;
  if (aiOutput.bloodType) mappedProfile.bloodType = aiOutput.bloodType as BloodType;
  if (aiOutput.maritalStatus) mappedProfile.maritalStatus = aiOutput.maritalStatus as MaritalStatus;
  if (aiOutput.occupation) mappedProfile.occupation = aiOutput.occupation;
  if (aiOutput.educationLevel) mappedProfile.educationLevel = aiOutput.educationLevel;
  if (aiOutput.recordNumber) mappedProfile.recordNumber = aiOutput.recordNumber;
  if (aiOutput.admissionDate) {
      try {
          const parsedDate = parseISO(aiOutput.admissionDate);
          if(isValid(parsedDate)) mappedProfile.admissionDate = format(parsedDate, 'yyyy-MM-dd');
      } catch(e) { console.warn("Error parsing admissionDate from AI", e); }
  }
  if (aiOutput.recordDate) {
      try {
          const parsedDate = parseISO(aiOutput.recordDate);
          if(isValid(parsedDate)) mappedProfile.recordDate = format(parsedDate, 'yyyy-MM-dd');
      } catch(e) { console.warn("Error parsing recordDate from AI", e); }
  }
  if (aiOutput.informant) mappedProfile.informant = aiOutput.informant;
  if (aiOutput.reliability) mappedProfile.reliability = aiOutput.reliability as ReliabilityOption;


  // Family History
  if (aiOutput.familyMedicalHistory && Array.isArray(aiOutput.familyMedicalHistory)) {
    const defaultRelativesOrder = defaultDetailedProfileBase.familyMedicalHistory!.map(entry => entry.relative);
    const processedHistory: FamilyMedicalHistoryEntry[] = defaultRelativesOrder.map(relativeType => {
        const aiEntry = aiOutput.familyMedicalHistory!.find(ae => ae.relative === relativeType);
        return {
            relative: relativeType,
            conditions: aiEntry && Array.isArray(aiEntry.conditions) ? aiEntry.conditions.filter(c => typeof c === 'string') : []
        };
    });
    mappedProfile.familyMedicalHistory = processedHistory;
  } else {
    mappedProfile.familyMedicalHistory = defaultDetailedProfileBase.familyMedicalHistory;
  }


  // Current Symptoms
  if (aiOutput.currentSymptoms && Array.isArray(aiOutput.currentSymptoms)) {
    mappedProfile.currentSymptoms = aiOutput.currentSymptoms.filter(s => typeof s === 'string');
  }

  // Allergies
  if (aiOutput.allergies && Array.isArray(aiOutput.allergies)) {
    mappedProfile.allergies = aiOutput.allergies.filter(a => typeof a === 'string');
    if (aiOutput.otherAllergyText && typeof aiOutput.otherAllergyText === 'string' && aiOutput.otherAllergyText.trim() !== "") {
      mappedProfile.otherAllergyText = aiOutput.otherAllergyText;
      if (!mappedProfile.allergies.includes("其他")) {
        mappedProfile.allergies.push("其他");
      }
    }
  }
  if (!mappedProfile.allergies?.includes("其他") && mappedProfile.otherAllergyText) {
    mappedProfile.otherAllergyText = "";
  }


  // Operation History
  if (aiOutput.operationHistory && Array.isArray(aiOutput.operationHistory)) {
    mappedProfile.operationHistory = aiOutput.operationHistory.filter(op => typeof op === 'string');
  }

  // Blood Transfusion
  if (typeof aiOutput.bloodTransfusionHistory === 'string') {
    mappedProfile.bloodTransfusionHistory = aiOutput.bloodTransfusionHistory;
  }

  // Medication Categories
  if (aiOutput.medicationCategories && Array.isArray(aiOutput.medicationCategories)) {
    mappedProfile.medicationCategories = aiOutput.medicationCategories.filter(mc => typeof mc === 'string');
  }

  // Contact History
  if (aiOutput.contactHistory && Array.isArray(aiOutput.contactHistory)) {
    mappedProfile.contactHistory = aiOutput.contactHistory.filter(ch => typeof ch === 'string');
  }

  // Dietary Habits
  if (aiOutput.dietaryHabits_breakfastDays) mappedProfile.dietaryHabits_breakfastDays = aiOutput.dietaryHabits_breakfastDays as FrequencyOption;
  if (aiOutput.dietaryHabits_lateSnackDays) mappedProfile.dietaryHabits_lateSnackDays = aiOutput.dietaryHabits_lateSnackDays as FrequencyOption;
  if (aiOutput.dietaryHabits_badHabits && Array.isArray(aiOutput.dietaryHabits_badHabits)) mappedProfile.dietaryHabits_badHabits = aiOutput.dietaryHabits_badHabits.filter(s=>typeof s === 'string');
  if (aiOutput.dietaryHabits_preferences && Array.isArray(aiOutput.dietaryHabits_preferences)) mappedProfile.dietaryHabits_preferences = aiOutput.dietaryHabits_preferences.filter(s=>typeof s === 'string');
  if (aiOutput.dietaryHabits_foodTypePreferences && Array.isArray(aiOutput.dietaryHabits_foodTypePreferences)) mappedProfile.dietaryHabits_foodTypePreferences = aiOutput.dietaryHabits_foodTypePreferences.filter(s=>typeof s === 'string');

  // Dietary Intake
  const intakeFields: (keyof ExtractProfileInfoOutput & keyof DetailedPatientProfile)[] = [
    'dietaryIntake_staple', 'dietaryIntake_meat', 'dietaryIntake_fish', 'dietaryIntake_eggs',
    'dietaryIntake_dairy', 'dietaryIntake_soy', 'dietaryIntake_vegetables', 'dietaryIntake_fruits', 'dietaryIntake_water'
  ];
  intakeFields.forEach(field => {
    if (aiOutput[field]) (mappedProfile as any)[field] = aiOutput[field] as DietaryIntakeOption;
  });

  // Exercise
  if (aiOutput.exercise_workHours) mappedProfile.exercise_workHours = aiOutput.exercise_workHours as ExerciseWorkHoursOption;
  if (aiOutput.exercise_sedentaryHours) mappedProfile.exercise_sedentaryHours = aiOutput.exercise_sedentaryHours as ExerciseWorkHoursOption;
  if (aiOutput.exercise_weeklyFrequency) mappedProfile.exercise_weeklyFrequency = aiOutput.exercise_weeklyFrequency as ExerciseWeeklyFrequencyOption;
  if (aiOutput.exercise_durationPerSession) mappedProfile.exercise_durationPerSession = aiOutput.exercise_durationPerSession as ExerciseDurationOption;
  if (aiOutput.exercise_intensity) mappedProfile.exercise_intensity = aiOutput.exercise_intensity as ExerciseIntensityOption;

  // Smoking Status
  if (aiOutput.smoking_status) mappedProfile.smoking_status = aiOutput.smoking_status as SmokingStatusOption;
  if (aiOutput.smoking_status === '吸烟' || aiOutput.smoking_status === '戒烟') {
      if (aiOutput.smoking_cigarettesPerDay) mappedProfile.smoking_cigarettesPerDay = aiOutput.smoking_cigarettesPerDay;
      if (aiOutput.smoking_years) mappedProfile.smoking_years = aiOutput.smoking_years;
  }
  if (aiOutput.smoking_passiveDays) mappedProfile.smoking_passiveDays = aiOutput.smoking_passiveDays as FrequencyOption;

  // Drinking Status
  if (aiOutput.drinking_status) mappedProfile.drinking_status = aiOutput.drinking_status as DrinkingStatusOption;
  if (aiOutput.drinking_status === '饮酒' || aiOutput.drinking_status === '戒酒') {
    if (aiOutput.drinking_type) mappedProfile.drinking_type = aiOutput.drinking_type as AlcoholTypeOption | string;
    if (aiOutput.drinking_type === '其他' && aiOutput.drinking_type_other) mappedProfile.drinking_type_other = aiOutput.drinking_type_other;
    if (aiOutput.drinking_amountPerDay) mappedProfile.drinking_amountPerDay = aiOutput.drinking_amountPerDay;
    if (aiOutput.drinking_years) mappedProfile.drinking_years = aiOutput.drinking_years;
  }
  if (mappedProfile.drinking_type !== '其他' && mappedProfile.drinking_type_other) {
    mappedProfile.drinking_type_other = "";
  }

  // Mental Health
  if (aiOutput.mentalHealth_majorEvents) mappedProfile.mentalHealth_majorEvents = aiOutput.mentalHealth_majorEvents as YesNoOption;
  if (aiOutput.mentalHealth_impactOnLife) mappedProfile.mentalHealth_impactOnLife = aiOutput.mentalHealth_impactOnLife as ImpactLevelOption;
  if (aiOutput.mentalHealth_stressLevel) mappedProfile.mentalHealth_stressLevel = aiOutput.mentalHealth_stressLevel as ImpactLevelOption;

  const sasKeys = Object.keys(aiOutput).filter(k => k.startsWith('mentalHealth_sas_')) as (keyof ExtractProfileInfoOutput & keyof DetailedPatientProfile)[];
  sasKeys.forEach(key => {
    if (aiOutput[key]) (mappedProfile as any)[key] = aiOutput[key] as SASOption;
  });

  // Adherence Behavior
  if (aiOutput.adherence_selfAssessmentBody) mappedProfile.adherence_selfAssessmentBody = aiOutput.adherence_selfAssessmentBody as AdherenceBodyOption;
  if (aiOutput.adherence_selfAssessmentMind) mappedProfile.adherence_selfAssessmentMind = aiOutput.adherence_selfAssessmentMind as AdherenceMindOption;
  if (aiOutput.adherence_priorityProblems && Array.isArray(aiOutput.adherence_priorityProblems)) {
      const problems = aiOutput.adherence_priorityProblems.filter(s => typeof s === 'string').slice(0,4);
      mappedProfile.adherence_priorityProblems = [...problems, ...Array(Math.max(0, 4 - problems.length)).fill('')];
  } else {
      mappedProfile.adherence_priorityProblems = Array(4).fill('');
  }
  if (aiOutput.adherence_doctorAdviceCompliance) mappedProfile.adherence_doctorAdviceCompliance = aiOutput.adherence_doctorAdviceCompliance as AdherenceComplianceOption;
  if (aiOutput.adherence_healthPromotionMethods && Array.isArray(aiOutput.adherence_healthPromotionMethods)) {
      mappedProfile.adherence_healthPromotionMethods = aiOutput.adherence_healthPromotionMethods.filter(s=>typeof s === 'string');
  }
  if (aiOutput.adherence_otherHealthPromotion) {
      mappedProfile.adherence_otherHealthPromotion = aiOutput.adherence_otherHealthPromotion;
      if(mappedProfile.adherence_healthPromotionMethods && !mappedProfile.adherence_healthPromotionMethods.includes("其他")) {
          mappedProfile.adherence_healthPromotionMethods = [...(mappedProfile.adherence_healthPromotionMethods || []), "其他"];
      }
  }
  if (!mappedProfile.adherence_healthPromotionMethods?.includes("其他") && mappedProfile.adherence_otherHealthPromotion) {
    mappedProfile.adherence_otherHealthPromotion = "";
  }

  // Sleep
  if (aiOutput.sleep_adequacy) mappedProfile.sleep_adequacy = aiOutput.sleep_adequacy as SleepAdequacyOption;

  // Other Information
  if (aiOutput.otherInfo_medicationsUsed) mappedProfile.otherInfo_medicationsUsed = aiOutput.otherInfo_medicationsUsed;

  if (aiOutput.otherInfo_contactPreference_method) mappedProfile.otherInfo_contactPreference_method = aiOutput.otherInfo_contactPreference_method as ContactPreferenceMethod | string;
  if (aiOutput.otherInfo_contactPreference_method_other) mappedProfile.otherInfo_contactPreference_method_other = aiOutput.otherInfo_contactPreference_method_other;
  if (mappedProfile.otherInfo_contactPreference_method !== '其他' && mappedProfile.otherInfo_contactPreference_method_other) {
    mappedProfile.otherInfo_contactPreference_method_other = "";
  }

  if (aiOutput.otherInfo_contactPreference_frequency) mappedProfile.otherInfo_contactPreference_frequency = aiOutput.otherInfo_contactPreference_frequency as ContactPreferenceFrequency | string;
  if (aiOutput.otherInfo_contactPreference_frequency_other) mappedProfile.otherInfo_contactPreference_frequency_other = aiOutput.otherInfo_contactPreference_frequency_other;
   if (mappedProfile.otherInfo_contactPreference_frequency !== '其他' && mappedProfile.otherInfo_contactPreference_frequency_other) {
    mappedProfile.otherInfo_contactPreference_frequency_other = "";
  }

  if (aiOutput.otherInfo_contactPreference_time) mappedProfile.otherInfo_contactPreference_time = aiOutput.otherInfo_contactPreference_time as ContactPreferenceTime | string;
  if (aiOutput.otherInfo_contactPreference_time_other) mappedProfile.otherInfo_contactPreference_time_other = aiOutput.otherInfo_contactPreference_time_other;
  if (mappedProfile.otherInfo_contactPreference_time !== '其他' && mappedProfile.otherInfo_contactPreference_time_other) {
    mappedProfile.otherInfo_contactPreference_time_other = "";
  }

  if (aiOutput.otherInfo_suggestions) mappedProfile.otherInfo_suggestions = aiOutput.otherInfo_suggestions;
  if (aiOutput.otherInfo_serviceSatisfaction) mappedProfile.otherInfo_serviceSatisfaction = aiOutput.otherInfo_serviceSatisfaction as ServiceSatisfactionOption;

  return mappedProfile;
}

    