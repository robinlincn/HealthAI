
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating data analysis reports based on user health data,
 * focusing on six key pillars: Diet, Exercise, Sleep, Medication, Emotion, and Toxins.
 *
 * - generateDataAnalysisReport - A function that generates a data analysis report.
 * - GenerateDataAnalysisReportInput - The input type for the generateDataAnalysisReport function.
 * - GenerateDataAnalysisReportOutput - The return type for the generateDataAnalysisReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataAnalysisReportInputSchema = z.object({
  healthData: z
    .string()
    .describe(
      'A string containing comprehensive health data for a patient. This should include information relevant to diet (e.g., meal logs, nutritional intake), exercise (e.g., activity levels, types of exercise), sleep (e.g., duration, quality, patterns), medication (e.g., adherence, types of medication, side effects if reported), emotion (e.g., stress levels, mood reports, relevant life events), and toxins (e.g., smoking habits, alcohol consumption, environmental exposures). Also include general health metrics like blood sugar levels, blood pressure, weight, lipids, etc., along with the report period or relevant dates.'
    ),
  reportType: z
    .string()
    .optional()
    .describe(
      'The type of report to generate, such as "daily_report", "weekly_report", "monthly_report", "quarterly_report", "semiannual_report", "annual_report". This will guide the time focus of the analysis.'
    ),
  userPreferences: z
    .string()
    .optional()
    .describe(
      'Any specific user preferences or doctor notes for the report, such as specific metrics to focus on or desired format.'
    ),
});
export type GenerateDataAnalysisReportInput = z.infer<typeof GenerateDataAnalysisReportInputSchema>;

const PillarAnalysisSchema = z.object({
  analysis: z.string().describe("Detailed analysis for this pillar based on the provided health data. (Generated in Simplified Chinese)"),
  recommendations: z.string().describe("Specific, actionable recommendations for this pillar. (Generated in Simplified Chinese)"),
});

const GenerateDataAnalysisReportOutputSchema = z.object({
  reportTitle: z.string().describe('The title of the generated data analysis report, reflecting the patient (if name available in healthData) and report type/period (e.g., "张三的健康周报"). (Generated in Simplified Chinese)'),
  reportSummary: z.string().describe('A concise overall summary of the key insights and trends from the data for the specified period, touching upon all six pillars if relevant data is present. (Generated in Simplified Chinese)'),
  dietAnalysis: PillarAnalysisSchema.describe("Analysis and recommendations related to diet and nutrition. (Generated in Simplified Chinese)"),
  exerciseAnalysis: PillarAnalysisSchema.describe("Analysis and recommendations related to physical activity and exercise. (Generated in Simplified Chinese)"),
  sleepAnalysis: PillarAnalysisSchema.describe("Analysis and recommendations related to sleep patterns and quality. (Generated in Simplified Chinese)"),
  medicationAnalysis: PillarAnalysisSchema.describe("Analysis and recommendations related to medication adherence, effects, and potential issues. (Generated in Simplified Chinese)"),
  emotionAnalysis: PillarAnalysisSchema.describe("Analysis and recommendations related to emotional well-being, stress, and mental health. Avoid making clinical diagnoses. (Generated in Simplified Chinese)"),
  toxinAnalysis: PillarAnalysisSchema.describe("Analysis and recommendations related to exposure to toxins such as smoking, alcohol, and relevant environmental factors. (Generated in Simplified Chinese)"),
});
export type GenerateDataAnalysisReportOutput = z.infer<typeof GenerateDataAnalysisReportOutputSchema>;

export async function generateDataAnalysisReport(
  input: GenerateDataAnalysisReportInput
): Promise<GenerateDataAnalysisReportOutput> {
  return generateDataAnalysisReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDataAnalysisReportPrompt',
  input: {schema: GenerateDataAnalysisReportInputSchema},
  output: {schema: GenerateDataAnalysisReportOutputSchema},
  prompt: `You are an AI assistant specializing in generating health data analysis reports for doctors managing patients with chronic diseases.
Analyze the provided health data for a patient and generate a comprehensive report structured around six key pillars: Diet, Exercise, Sleep, Medication, Emotion, and Toxins.
The report should include a suitable title, an overall summary, and then detailed analysis and actionable recommendations for each of the six pillars.

**IMPORTANT: Please ensure the entire report (including title, summary, analysis for each pillar, and recommendations for each pillar) is generated in Simplified Chinese.**

Patient Health Data:
{{{healthData}}}

Report Type / Period Focus: {{{reportType}}}
User Preferences / Doctor's Notes: {{{userPreferences}}}

Instructions:
1.  **Report Title**: Create a clear title in Simplified Chinese indicating the patient (if name is identifiable in healthData) and the report period/type (e.g., "张三的健康周报").
2.  **Overall Summary**: Provide a brief overview in Simplified Chinese of the patient's status for the period, highlighting significant findings across the six pillars if data allows.
3.  **For each of the Six Pillars (Diet, Exercise, Sleep, Medication, Emotion, Toxins)**:
    *   **Analysis (分析)**: Based on the 'Patient Health Data', analyze the patient's status concerning this pillar. Identify trends, significant data points, potential concerns, or areas of improvement. If no specific data is available for a pillar, state that information is lacking for a full analysis of this aspect. (Use Simplified Chinese)
    *   **Recommendations (建议)**: Provide specific, actionable advice related to this pillar. Recommendations should be practical and tailored to a patient managing a chronic disease. (Use Simplified Chinese)

Details for each pillar (all output in Simplified Chinese):
*   **Diet (饮食)**: Analyze dietary habits, intake patterns (e.g., types of food, meal frequency, portion sizes if available), and nutritional status if inferable. Identify concerns like high intake of unhealthy foods, insufficient intake of beneficial nutrients, or irregular eating patterns. Recommendations should focus on dietary modifications, healthy food choices, meal planning, etc.
*   **Exercise (运动)**: Evaluate physical activity levels, types of exercise, duration, frequency, and sedentary behavior. Identify if activity levels meet guidelines or if there are barriers. Recommendations should include suitable types of exercise, intensity, duration, and strategies to increase activity or overcome barriers.
*   **Sleep (睡眠)**: Assess sleep patterns, duration, and perceived quality if data is available (e.g., from wearables or patient logs). Identify potential issues like insufficient sleep, irregular sleep schedules, or signs of sleep disturbances. Recommendations should cover sleep hygiene, lifestyle adjustments for better sleep, and when to seek further medical advice for sleep problems.
*   **Medication (药物)**: Review medication adherence (if data available), reported side effects, and potential impact on health data (e.g., blood sugar changes after medication adjustment). Identify any discrepancies or concerns. Recommendations might include reminders for adherence, discussion points for the doctor regarding side effects or efficacy, and general advice on medication management. Do not suggest specific drug changes, but rather areas for the physician to review.
*   **Emotion (情绪)**: Consider any indications of emotional state, stress levels, or mental well-being from the provided data (e.g., patient's notes, reported mood, SAS scores if available). Identify potential impacts of emotional state on chronic disease management. Recommendations should focus on general stress management techniques, mindfulness, seeking social support, or suggesting a consultation with a mental health professional if significant concerns are noted. Avoid making clinical psychiatric diagnoses.
*   **Toxins (毒素)**: Analyze exposure to harmful substances like tobacco (smoking status, amount), alcohol (consumption patterns), or known environmental/occupational toxins if mentioned. Identify risks associated with these exposures. Recommendations should include strategies for cessation or reduction, support resources, and minimizing exposure.

Ensure the report is easy to understand for a medical professional and provides actionable insights.
Pay attention to time series data if present in the healthData to identify trends relevant to the specified 'Report Type / Period Focus'.
Consider any 'User Preferences / Doctor's Notes'.
Output should be well-formatted and clearly structured according to the defined output schema.
If specific data for a pillar is completely absent in the input, the analysis for that pillar should state "该方面缺乏足够数据进行详细分析。" (Insufficient data provided for a detailed analysis of [Pillar Name].) and recommendations might be general or state "因数据不足，无法提供具体建议。" (Specific recommendations cannot be made without more data.)
`,
});

const generateDataAnalysisReportFlow = ai.defineFlow(
  {
    name: 'generateDataAnalysisReportFlow',
    inputSchema: GenerateDataAnalysisReportInputSchema,
    outputSchema: GenerateDataAnalysisReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null, handle potential null response from the prompt
    if (!output) {
        throw new Error("AI prompt did not return a valid output.");
    }
    return output;
  }
);

