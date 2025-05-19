
'use server';
/**
 * @fileOverview An AI flow to extract comprehensive personal health profile information
 * from an uploaded document (image or PDF).
 *
 * - extractProfileInfoFlow - A function that handles document processing and information extraction.
 * - ExtractProfileInfoInputSchema - The input schema for the flow.
 * - ExtractProfileInfoOutputSchema - The output schema for the flow.
 * - ExtractProfileInfoInput - The input type for the flow.
 * - ExtractProfileInfoOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type {
  Gender, BloodType, MaritalStatus, ReliabilityOption, FrequencyOption, DietaryIntakeOption,
  ExerciseWorkHoursOption, ExerciseWeeklyFrequencyOption, ExerciseDurationOption, ExerciseIntensityOption,
  SmokingStatusOption, DrinkingStatusOption, AlcoholTypeOption, YesNoOption, SASOption,
  AdherenceBodyOption, AdherenceMindOption, AdherenceComplianceOption, SleepAdequacyOption,
  ContactPreferenceMethod, ContactPreferenceFrequency, ContactPreferenceTime, ServiceSatisfactionOption, ImpactLevelOption
} from '@/lib/types';

export const ExtractProfileInfoInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A document (image or PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This document contains personal health profile information."
    ),
});
export type ExtractProfileInfoInput = z.infer<typeof ExtractProfileInfoInputSchema>;

export const ExtractProfileInfoOutputSchema = z.object({
  // Basic Info
  name: z.string().optional().describe("Patient's full name."),
  gender: z.enum(["male", "female", "other"] as [Gender, ...Gender[]]).optional().describe("Patient's gender ('male', 'female', 'other')."),
  dob: z.string().optional().describe("Patient's date of birth in YYYY-MM-DD format."),
  address: z.string().optional().describe("Patient's home address."),
  contactPhone: z.string().optional().describe("Patient's contact phone number."),
  contactEmail: z.string().email().optional().describe("Patient's contact email address."),
  bloodType: z.enum(["A", "B", "O", "AB", "unknown"] as [BloodType, ...BloodType[]]).optional().describe("Patient's blood type."),
  maritalStatus: z.enum(["unmarried", "married", "divorced", "widowed", "other"] as [MaritalStatus, ...MaritalStatus[]]).optional().describe("Patient's marital status."),
  occupation: z.string().optional().describe("Patient's occupation."),
  educationLevel: z.string().optional().describe("Patient's education level (e.g., 'bachelor', 'master', 'primary_school')."), // Added more options
  hadPreviousCheckup: z.boolean().optional().describe("Whether the patient had a previous checkup at this institution."),
  agreesToIntervention: z.boolean().optional().describe("Whether the patient agrees to health intervention services."),
  recordNumber: z.string().optional().describe("Patient's medical record number (usually institution managed)."),
  admissionDate: z.string().optional().describe("Date of admission in YYYY-MM-DD format (usually institution managed)."),
  recordDate: z.string().optional().describe("Date of record creation in YYYY-MM-DD format (usually institution managed)."),
  informant: z.string().optional().describe("Person providing the medical history (usually institution managed)."),
  reliability: z.enum(["reliable", "partially_reliable", "unreliable"] as [ReliabilityOption, ...ReliabilityOption[]]).optional().describe("Reliability of the informant (usually institution managed)."),

  // Family History
  familyMedicalHistory: z.array(z.object({
    relative: z.enum(["self", "father", "mother", "paternal_grandparents", "maternal_grandparents"]),
    conditions: z.array(z.string()).describe("List of conditions for the relative."),
  })).optional().describe("Patient's family medical history."),

  // Current Symptoms
  currentSymptoms: z.array(z.string()).optional().describe("List of current symptoms."),

  // Allergies
  allergies: z.array(z.string()).optional().describe("List of allergies."),
  otherAllergyText: z.string().optional().describe("Specific text if 'Other' allergy is selected."),

  // Operation History
  operationHistory: z.array(z.string()).optional().describe("List of past operations/surgeries."),

  // Blood Transfusion
  bloodTransfusionHistory: z.string().optional().describe("Details of blood transfusion history, including date and reason."),

  // Medication Categories (not detailed medication history)
  medicationCategories: z.array(z.string()).optional().describe("Categories of medications currently or previously used."),

  // Contact History
  contactHistory: z.array(z.string()).optional().describe("History of exposure to certain substances or environments."),

  // Dietary Habits
  dietaryHabits_breakfastDays: z.string().optional().describe("Average number of days per week patient eats breakfast (e.g., '没有', '1-2天', '7天')."),
  dietaryHabits_lateSnackDays: z.string().optional().describe("Average number of days per week patient eats late-night snacks (e.g., '没有', '1-2天', '7天')."),
  dietaryHabits_badHabits: z.array(z.string()).optional().describe("List of bad dietary habits (e.g., '吃饭时喝水', '吃饭过快')."),
  dietaryHabits_preferences: z.array(z.string()).optional().describe("List of taste preferences (e.g., '咸', '甜', '辣')."),
  dietaryHabits_foodTypePreferences: z.array(z.string()).optional().describe("List of food type preferences (e.g., '油炸食品', '经常吃快餐')."),

  // Dietary Intake
  dietaryIntake_staple: z.string().optional().describe("Daily staple food intake amount (e.g., '<1碗', '2-4碗')."),
  dietaryIntake_meat: z.string().optional().describe("Daily meat intake amount (e.g., '不吃', '1-2两')."),
  dietaryIntake_fish: z.string().optional().describe("Daily fish intake amount."),
  dietaryIntake_eggs: z.string().optional().describe("Daily egg intake amount."),
  dietaryIntake_dairy: z.string().optional().describe("Daily dairy intake amount."),
  dietaryIntake_soy: z.string().optional().describe("Daily soy products intake amount."),
  dietaryIntake_vegetables: z.string().optional().describe("Daily vegetable intake amount."),
  dietaryIntake_fruits: z.string().optional().describe("Daily fruit intake amount."),
  dietaryIntake_water: z.string().optional().describe("Daily water intake amount."),

  // Exercise
  exercise_workHours: z.string().optional().describe("Average daily work hours (e.g., '没有', '5-8小时')."),
  exercise_sedentaryHours: z.string().optional().describe("Average daily sedentary hours."),
  exercise_weeklyFrequency: z.string().optional().describe("Weekly exercise frequency (e.g., '从不', '经常（3-5次/周）')."),
  exercise_durationPerSession: z.string().optional().describe("Duration per exercise session (e.g., '<10分钟', '30-60分钟')."),
  exercise_intensity: z.string().optional().describe("General exercise intensity (e.g., '不锻炼', '中度运动')."),

  // Smoking Status
  smoking_status: z.string().optional().describe("Current smoking status (e.g., '从不', '吸烟', '戒烟')."),
  smoking_cigarettesPerDay: z.string().optional().describe("Cigarettes smoked per day if applicable (e.g., '<5支', '5-15支')."),
  smoking_years: z.string().optional().describe("Total years of smoking if applicable (e.g., '<1年', '10-20年')."),
  smoking_passiveDays: z.string().optional().describe("Days per week exposed to passive smoking (e.g., '没有', '1-2天')."),

  // Drinking Status
  drinking_status: z.string().optional().describe("Current drinking status (e.g., '从不', '饮酒', '戒酒')."),
  drinking_type: z.string().optional().describe("Most common type of alcohol consumed (e.g., '白酒', '啤酒', '其他')."),
  drinking_type_other: z.string().optional().describe("Details if '其他' alcohol type is selected."),
  drinking_amountPerDay: z.string().optional().describe("Average daily alcohol consumption (e.g., '<2两', '2-4两')."),
  drinking_years: z.string().optional().describe("Total years of drinking if applicable (e.g., '<5年', '5-15年')."),

  // Mental Health
  mentalHealth_majorEvents: z.string().optional().describe("Whether patient is troubled by major unexpected events ('是' or '否' or '不详')."),
  mentalHealth_impactOnLife: z.string().optional().describe("Impact of emotions on work/life ('几乎没有', '有一点', '较明显', '很大')."),
  mentalHealth_stressLevel: z.string().optional().describe("Perceived level of mental stress ('几乎没有', '有一点', '较明显', '很大')."),
  mentalHealth_sas_anxiety: z.string().optional().describe("SAS: Anxiety level ('没有或很少有时间有', '小部分时间有', etc.)."),
  mentalHealth_sas_fear: z.string().optional().describe("SAS: Fear level."),
  mentalHealth_sas_panic: z.string().optional().describe("SAS: Panic level."),
  mentalHealth_sas_goingCrazy: z.string().optional().describe("SAS: Feeling of going crazy."),
  mentalHealth_sas_misfortune: z.string().optional().describe("SAS: Premonition of misfortune."),
  mentalHealth_sas_trembling: z.string().optional().describe("SAS: Trembling hands/feet."),
  mentalHealth_sas_bodyPain: z.string().optional().describe("SAS: Body pain."),
  mentalHealth_sas_fatigue: z.string().optional().describe("SAS: Fatigue level."),
  mentalHealth_sas_restlessness: z.string().optional().describe("SAS: Restlessness."),
  mentalHealth_sas_palpitations: z.string().optional().describe("SAS: Palpitations."),
  mentalHealth_sas_dizziness: z.string().optional().describe("SAS: Dizziness."),
  mentalHealth_sas_fainting: z.string().optional().describe("SAS: Fainting spells."),
  mentalHealth_sas_breathingDifficulty: z.string().optional().describe("SAS: Difficulty breathing."),
  mentalHealth_sas_paresthesia: z.string().optional().describe("SAS: Numbness or tingling."),
  mentalHealth_sas_stomachPain: z.string().optional().describe("SAS: Stomach pain/indigestion."),
  mentalHealth_sas_frequentUrination: z.string().optional().describe("SAS: Frequent urination."),
  mentalHealth_sas_sweating: z.string().optional().describe("SAS: Sweating."),

  // Adherence Behavior
  adherence_selfAssessmentBody: z.string().optional().describe("Self-assessment of physical feeling ('很满意', '满意', etc.)."),
  adherence_selfAssessmentMind: z.string().optional().describe("Self-assessment of mental attitude towards health ('很重视', '还算关心', etc.)."),
  adherence_priorityProblems: z.array(z.string()).optional().describe("List of health problems patient wants to solve (max 4)."),
  adherence_doctorAdviceCompliance: z.string().optional().describe("Compliance with doctor's advice ('完全执行', '执行一部分', '完全不执行')."),
  adherence_healthPromotionMethods: z.array(z.string()).optional().describe("Preferred methods for health promotion (e.g., '改变生活形态', '药物', '其他')."),
  adherence_otherHealthPromotion: z.string().optional().describe("Details if '其他' health promotion method is selected."),

  // Sleep
  sleep_adequacy: z.string().optional().describe("Perceived sleep adequacy ('充足', '一般', '不足', '严重不足')."),

  // Other Information
  otherInfo_medicationsUsed: z.string().optional().describe("List of other medications currently used (text description)."),
  otherInfo_contactPreference_method: z.string().optional().describe("Preferred contact method (e.g., '电话', '微信', '其他')."),
  otherInfo_contactPreference_method_other: z.string().optional().describe("Details if '其他' contact method is selected."),
  otherInfo_contactPreference_frequency: z.string().optional().describe("Preferred contact frequency (e.g., '每周一次', '其他')."),
  otherInfo_contactPreference_frequency_other: z.string().optional().describe("Details if '其他' contact frequency is selected."),
  otherInfo_contactPreference_time: z.string().optional().describe("Preferred contact time (e.g., '上午', '下午', '其他')."),
  otherInfo_contactPreference_time_other: z.string().optional().describe("Details if '其他' contact time is selected."),
  otherInfo_suggestions: z.string().optional().describe("Suggestions for the health center."),
  otherInfo_serviceSatisfaction: z.string().optional().describe("Satisfaction with the center's service ('满意', '较好', etc.)."),
});
export type ExtractProfileInfoOutput = z.infer<typeof ExtractProfileInfoOutputSchema>;


const profileExtractionPrompt = ai.definePrompt({
  name: 'profileExtractionPrompt',
  input: { schema: ExtractProfileInfoInputSchema },
  output: { schema: ExtractProfileInfoOutputSchema },
  prompt: `You are an AI assistant specialized in extracting structured personal health profile information from documents (images or PDFs).
The document provided is:
{{media url=fileDataUri}}

Carefully analyze the document and attempt to extract all information relevant to a comprehensive health profile.
Prioritize accuracy. If a piece of information is not clearly found or is ambiguous, omit the field or return null/undefined for it in the JSON output.
For dates, strictly use YYYY-MM-DD format.
For selection-based fields (like gender, blood type, yes/no questions, SAS questionnaire answers, etc.), try to match your output to one of the common options implied by the field's description if possible, or provide the closest textual match from the document.

The target JSON schema for the output is as follows. Fill as many fields as possible based on the document content.

Extracted Information:
{{jsonSchema output}}
`,
});

export async function extractProfileInfoFlow(input: ExtractProfileInfoInput): Promise<ExtractProfileInfoOutput> {
  const { output } = await profileExtractionPrompt(input);
  if (!output) {
    console.error('AI did not return a valid output or failed to parse schema.');
    // Return an empty object or a specific error structure if preferred
    return {}; 
  }
  return output;
}
