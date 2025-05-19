
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating data analysis reports based on user health data.
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
      'A string containing health data, including but not limited to: blood sugar levels, blood pressure readings, weight, blood lipid levels, and any other relevant health metrics recorded during the specified report period.'
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
      'Any specific user preferences or requirements for the report, such as specific metrics to focus on or desired format.'
    ),
});
export type GenerateDataAnalysisReportInput = z.infer<typeof GenerateDataAnalysisReportInputSchema>;

const GenerateDataAnalysisReportOutputSchema = z.object({
  reportTitle: z.string().describe('The title of the generated data analysis report, reflecting the report type (e.g., "张三的健康周报").'),
  reportSummary: z.string().describe('A concise summary of the key insights and trends from the data for the specified period.'),
  reportDetails: z.string().describe('Detailed analysis of the health data, including specific metrics, trends, and anomalies observed during the period.'),
  recommendations: z
    .string()
    .describe('Personalized recommendations based on the data analysis to help manage the user condition, considering the report period.'),
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

  Based on the provided health data for a patient, and the specified report type (cycle), generate a comprehensive report.
  The report should include a suitable title, a summary of key insights, detailed analysis of trends and anomalies, and actionable recommendations.

  Health Data: {{{healthData}}}
  Report Type: {{{reportType}}}
  User Preferences (Doctor's Notes): {{{userPreferences}}}

  Instructions based on Report Type:
  - If Report Type is "daily_report": Focus on data from the last 24-48 hours. Analyze daily fluctuations, adherence to short-term goals (e.g., medication, specific diet instructions for the day). Title should reflect it's a daily report.
  - If Report Type is "weekly_report": Focus on data from the last 7 days. Identify weekly trends, consistency in readings, and average values for key metrics over the week.
  - If Report Type is "biweekly_report": Focus on data from the last 14-15 days. Summarize progress over the half-month period.
  - If Report Type is "monthly_report": Focus on data from the last 30 days. Provide a broader overview of the month's progress, identify patterns, and assess if monthly targets are being met.
  - If Report Type is "quarterly_report": Focus on data from the last 3 months. Analyze longer-term trends, effectiveness of treatment plans over this period.
  - If Report Type is "semiannual_report": Focus on data from the last 6 months. Provide a comprehensive review of health status changes and progress towards long-term goals.
  - If Report Type is "annual_report": Focus on data from the last 12 months. Generate a year-in-review, highlighting major changes, achievements, and areas for continued focus.
  - If Report Type is not specified or unclear, assume a general analysis based on the most recent prominent data or a monthly summary if data spans that long.

  Key elements to include in the report:
  1.  **Report Title**: Clearly indicate the patient (if name is in healthData) and the report period (e.g., "张三 - 健康周报 (2024-W20)").
  2.  **Report Summary**: A brief overview of the patient's status for the period, highlighting significant findings.
  3.  **Detailed Analysis**:
      *   **Data Statistics**: Mention key average values, highs, lows for metrics like blood sugar, blood pressure etc., relevant to the period.
      *   **Trend Analysis**: Describe if key metrics are stable, improving, or worsening over the period.
      *   **Anomaly Detection**: Point out any significantly abnormal readings or concerning patterns.
  4.  **Recommendations**: Provide actionable advice for the doctor or patient based on the analysis. This could include medication adjustments, lifestyle changes, or further tests.

  Ensure the report is easy to understand for a medical professional and provides actionable insights.
  Pay attention to time series data if present in the healthData to identify trends.
  Consider any user preferences or doctor's notes specified.
  Output should be well-formatted and clearly structured.
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

