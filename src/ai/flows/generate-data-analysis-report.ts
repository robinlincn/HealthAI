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
      'A string containing health data, including but not limited to: blood sugar levels, blood pressure readings, weight, blood lipid levels, and any other relevant health metrics.'
    ),
  reportType: z
    .string()
    .optional()
    .describe(
      'The type of report to generate, such as weekly, monthly, or custom range. If not provided, defaults to a monthly report.'
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
  reportTitle: z.string().describe('The title of the generated data analysis report.'),
  reportSummary: z.string().describe('A concise summary of the key insights and trends from the data.'),
  reportDetails: z.string().describe('Detailed analysis of the health data, including specific metrics, trends, and anomalies.'),
  recommendations: z
    .string()
    .describe('Personalized recommendations based on the data analysis to help manage the user condition.'),
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
  prompt: `You are an AI assistant specializing in generating data analysis reports based on user health data.

  Analyze the provided health data and generate a comprehensive report including a summary of key insights, detailed analysis, and personalized recommendations.

  Health Data: {{{healthData}}}
  Report Type: {{{reportType}}}
  User Preferences: {{{userPreferences}}}

  Ensure the report is easy to understand and provides actionable insights for the user to better manage their condition.
  Pay attention to time series data to identify trends and anomalies.
  Consider any user preferences specified to tailor the report accordingly.

  Output should be well-formatted and easy to read.
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
    return output!;
  }
);
