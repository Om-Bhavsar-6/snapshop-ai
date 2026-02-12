'use server';

/**
 * @fileOverview Polishes a single customer review to be more articulate and grammatically correct.
 *
 * - polishReview - A function that takes a raw customer review and returns a polished version.
 * - PolishReviewInput - The input type for the polishReview function.
 * - PolishReviewOutput - The return type for the polishReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolishReviewInputSchema = z.object({
  productName: z.string().describe('The name of the product the review is for.'),
  review: z.string().describe('A single customer review, which may be short or grammatically incorrect.'),
});
export type PolishReviewInput = z.infer<typeof PolishReviewInputSchema>;

const PolishReviewOutputSchema = z.object({
  polishedReview: z.string().describe('The polished, well-written version of the customer review.'),
});
export type PolishReviewOutput = z.infer<typeof PolishReviewOutputSchema>;

export async function polishReview(
  input: PolishReviewInput
): Promise<PolishReviewOutput> {
  return polishReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'polishReviewPrompt',
  input: {schema: PolishReviewInputSchema},
  output: {schema: PolishReviewOutputSchema},
  prompt: `You are an expert editor. Your task is to take a single customer review for a product and improve it. Paraphrase the review, correct any grammatical errors, fix spelling mistakes, and improve the overall phrasing to make it sound more articulate and helpful for other shoppers.

Preserve the original sentiment and key points of the review. The goal is to polish the user's raw feedback into a well-written review.

Product Name: "{{{productName}}}"
Original Review: "{{{review}}}"

Provide only the polished review in the JSON output.`,
});

const polishReviewFlow = ai.defineFlow(
  {
    name: 'polishReviewFlow',
    inputSchema: PolishReviewInputSchema,
    outputSchema: PolishReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
