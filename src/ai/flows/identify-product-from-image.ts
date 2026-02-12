'use server';
/**
 * @fileOverview Identifies a product from an image and finds it online with price comparisons.
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
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
  purchasingOptions: z.array(z.object({
    platform: z.string().describe('The name of the e-commerce platform (e.g., Amazon, Walmart, Google Shopping).'),
    price: z.string().describe('The price of the product on the platform, including currency symbol.'),
    link: z.string().url().describe('The direct link to the product page.'),
  })).describe('A list of purchasing options from different platforms with price comparisons.')
});
export type IdentifyProductFromImageOutput = z.infer<typeof IdentifyProductFromImageOutputSchema>;

export async function identifyProductFromImage(input: IdentifyProductFromImageInput): Promise<IdentifyProductFromImageOutput> {
  return identifyProductFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyProductFromImagePrompt',
  input: {schema: IdentifyProductFromImageInputSchema},
  output: {schema: IdentifyProductFromImageOutputSchema},
  prompt: `You are an expert AI assistant that identifies products from images and finds them for sale online.

  1. Analyze the provided image to identify the product. Determine its most likely name.
  2. Search for this product on at least 3 major e-commerce platforms (e.g., Amazon, Walmart, eBay, Google Shopping).
  3. For each platform, find the product's price and a direct link to the product page.
  4. Respond in JSON format according to the output schema. Provide the identified product name, a confidence score (0-1) for the identification, and a list of purchasing options with the platform, price, and link.

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
