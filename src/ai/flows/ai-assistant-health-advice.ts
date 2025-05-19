
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
  attachmentInfo: z.object({
    name: z.string(),
    type: z.string(),
    size: z.number().optional(),
  }).optional().describe('Information about any attached file.'),
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
  {{#if attachmentInfo}}
  User also sent a file: {{{attachmentInfo.name}}} (Type: {{{attachmentInfo.type}}}{{#if attachmentInfo.size}}, Size: {{{attachmentInfo.size}}} bytes{{/if}}).
  Please acknowledge this file in your response (e.g., "Regarding the file you sent..."). You are not currently equipped to open or analyze the content of these files, but you can acknowledge its presence.
  {{/if}}

  Provide clear, concise, and actionable advice. If the question seems to imply a file was sent (even if no attachmentInfo is present in this system message), politely state you cannot view file contents but can discuss the topic generally.
  If the user asks about analyzing content from an image, document, audio or video, explain that you cannot directly process file content, but they can describe it to you or ask questions based on their own understanding of the file.
  `,
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
