'use server';
/**
 * @fileOverview An image generation AI flow.
 *
 * - generateImage - A function that handles image generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const imageInputSchema = z.object({
  prompt: z.string(),
});

export const generateImage = ai.defineFlow(
  {
    name: 'generateImage',
    inputSchema: imageInputSchema,
    outputSchema: z.object({
      url: z.string(),
    }),
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });
    
    if (!media || !media.url) {
        throw new Error('Image generation failed to return a URL.');
    }

    return {
      url: media.url,
    };
  }
);
