'use server';
/**
 * @fileOverview Identifies a product from an image and finds it online.
 *
 * - identifyProductFromImage - A function that handles the product identification process.
 * - IdentifyProductFromImageInput - The input type for the identifyProductFromImage function.
 * - IdentifyProductFromImageOutput - The return type for the identifyProductFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyProductFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyProductFromImageInput = z.infer<typeof IdentifyProductFromImageInputSchema>;

const IdentifyProductFromImageOutputSchema = z.object({
  productName: z.string().describe('The name of the identified product.'),
  productLink: z.string().describe('A link to purchase the product online.'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
});
export type IdentifyProductFromImageOutput = z.infer<typeof IdentifyProductFromImageOutputSchema>;

export async function identifyProductFromImage(input: IdentifyProductFromImageInput): Promise<IdentifyProductFromImageOutput> {
  return identifyProductFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyProductFromImagePrompt',
  input: {schema: IdentifyProductFromImageInputSchema},
  output: {schema: IdentifyProductFromImageOutputSchema},
  prompt: `You are an AI assistant that identifies products from images and finds them online.

  Analyze the image and extract the product name. Then, search for the product online and provide a link to purchase it.

  Respond in JSON format with the product name, product link, and a confidence score (0-1) for the identification.

  Image: {{media url=photoDataUri}}
  `,
});

const identifyProductFromImageFlow = ai.defineFlow(
  {
    name: 'identifyProductFromImageFlow',
    inputSchema: IdentifyProductFromImageInputSchema,
    outputSchema: IdentifyProductFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
