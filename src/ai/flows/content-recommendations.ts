'use server';

/**
 * @fileOverview Provides personalized content recommendations based on user activity and interests.
 *
 * - recommendContent - A function that generates content recommendations.
 * - RecommendContentInput - The input type for the recommendContent function.
 * - RecommendContentOutput - The return type for the recommendContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendContentInputSchema = z.object({
  userHistory: z
    .string()
    .describe('The user history of viewed videos and interactions.'),
  interests: z.string().describe('The user interests.'),
  sponsoredContentRequest: z
    .string()
    .describe('Request to decide when to show sponsored content.'),
});
export type RecommendContentInput = z.infer<typeof RecommendContentInputSchema>;

const RecommendationSchema = z.object({
  videoTitle: z.string().describe('Title of the recommended video.'),
  creatorName: z.string().describe('Name of the video creator.'),
  reason: z.string().describe('Reason for recommending the content.'),
  sponsored: z
    .boolean()
    .describe('Whether the recommended content is sponsored.'),
});

const RecommendContentOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('List of content recommendations.'),
});
export type RecommendContentOutput = z.infer<typeof RecommendContentOutputSchema>;

export async function recommendContent(input: RecommendContentInput): Promise<RecommendContentOutput> {
  return recommendContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendContentPrompt',
  input: {schema: RecommendContentInputSchema},
  output: {schema: RecommendContentOutputSchema},
  prompt: `You are a content recommendation expert for a short video app.

Based on the user's history and interests, recommend videos.

User History: {{{userHistory}}}
User Interests: {{{interests}}}
Sponsored Content Request: {{{sponsoredContentRequest}}}

Ensure some of the recommended content is sponsored, if appropriate.

Output should be in JSON format.
`,
});

const recommendContentFlow = ai.defineFlow(
  {
    name: 'recommendContentFlow',
    inputSchema: RecommendContentInputSchema,
    outputSchema: RecommendContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
