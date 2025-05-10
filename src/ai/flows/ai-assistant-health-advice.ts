'use server';

/**
 * @fileOverview An AI assistant that provides personalized health advice and guidance.
 *
 * - aiAssistantHealthAdvice - A function that handles user questions and provides health advice.
 * - AiAssistantHealthAdviceInput - The input type for the aiAssistantHealthAdvice function.
 * - AiAssistantHealthAdviceOutput - The return type for the aiAssistantHealthAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistantHealthAdviceInputSchema = z.object({
  question: z.string().describe('The user question about their health.'),
  name: z.string().describe('The user name.'),
  gender: z.string().describe('The user gender.'),
  age: z.number().describe('The user age.'),
  medicalHistory: z.string().describe('The user medical history.'),
});
export type AiAssistantHealthAdviceInput = z.infer<
  typeof AiAssistantHealthAdviceInputSchema
>;

const AiAssistantHealthAdviceOutputSchema = z.object({
  advice: z.string().describe('The personalized health advice and guidance.'),
});
export type AiAssistantHealthAdviceOutput = z.infer<
  typeof AiAssistantHealthAdviceOutputSchema
>;

export async function aiAssistantHealthAdvice(
  input: AiAssistantHealthAdviceInput
): Promise<AiAssistantHealthAdviceOutput> {
  return aiAssistantHealthAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistantHealthAdvicePrompt',
  input: {schema: AiAssistantHealthAdviceInputSchema},
  output: {schema: AiAssistantHealthAdviceOutputSchema},
  prompt: `You are a helpful AI assistant specialized in providing personalized health advice and guidance.

  Based on the user's question and medical history, provide tailored advice.

  User Question: {{{question}}}
  User Name: {{{name}}}
  User Gender: {{{gender}}}
  User Age: {{{age}}}
  User Medical History: {{{medicalHistory}}}

  Provide clear, concise, and actionable advice.`,
});

const aiAssistantHealthAdviceFlow = ai.defineFlow(
  {
    name: 'aiAssistantHealthAdviceFlow',
    inputSchema: AiAssistantHealthAdviceInputSchema,
    outputSchema: AiAssistantHealthAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
