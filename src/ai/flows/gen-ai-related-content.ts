'use server';

/**
 * @fileOverview A flow that analyzes user engagement and dynamically adjusts the sponsored content.
 *
 * - adjustSponsoredContent - A function that handles the adjustment of sponsored content based on user engagement.
 * - AdjustSponsoredContentInput - The input type for the adjustSponsoredContent function.
 * - AdjustSponsoredContentOutput - The return type for the adjustSponsoredContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustSponsoredContentInputSchema = z.object({
  userEngagementData: z
    .string()
    .describe("A JSON string containing data about the user's engagement with different content types (e.g., videos, posts, ads)."),
  currentAdFrequency: z
    .number()
    .describe('The current frequency of sponsored content displayed to the user (e.g., 0.1 for 10% of content being sponsored).'),
  currentAdPlacement: z
    .string()
    .describe('The current placement of sponsored content (e.g., feed, side bar).'),
});
export type AdjustSponsoredContentInput = z.infer<typeof AdjustSponsoredContentInputSchema>;

const AdjustSponsoredContentOutputSchema = z.object({
  adjustedAdFrequency: z
    .number()
    .describe('The adjusted frequency of sponsored content to be displayed to the user.'),
  adjustedAdPlacement: z
    .string()
    .describe('The adjusted placement of sponsored content.'),
  reasoning: z
    .string()
    .describe('Explanation on why the adjustment to ad frequency and placement was made.'),
});
export type AdjustSponsoredContentOutput = z.infer<typeof AdjustSponsoredContentOutputSchema>;

export async function adjustSponsoredContent(input: AdjustSponsoredContentInput): Promise<AdjustSponsoredContentOutput> {
  return adjustSponsoredContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustSponsoredContentPrompt',
  input: {schema: AdjustSponsoredContentInputSchema},
  output: {schema: AdjustSponsoredContentOutputSchema},
  prompt: `You are an expert in user engagement and advertising optimization. You are tasked to analyze user engagement data and determine the optimal frequency and placement of sponsored content to maximize both user experience and ad revenue.

  User Engagement Data: {{{userEngagementData}}}
  Current Ad Frequency: {{{currentAdFrequency}}}
  Current Ad Placement: {{{currentAdPlacement}}}

  Based on the provided data, suggest an adjusted ad frequency and placement. Explain your reasoning for the adjustment.

  Ensure the adjustedAdFrequency value is a floating point number between 0 and 1.
  Ensure the adjustedAdPlacement is either 'feed' or 'side bar'.
  `,
});

const adjustSponsoredContentFlow = ai.defineFlow(
  {
    name: 'adjustSponsoredContentFlow',
    inputSchema: AdjustSponsoredContentInputSchema,
    outputSchema: AdjustSponsoredContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
