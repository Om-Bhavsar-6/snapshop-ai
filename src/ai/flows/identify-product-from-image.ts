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
    platform: z.string().describe('The name of the e-commerce platform (e.g., Google Shopping, Amazon, Walmart).'),
    link: z.string().url().describe('A search link to find the product on the specified platform.'),
  })).describe('A list of search links to find the product on different platforms.')
});
export type IdentifyProductFromImageOutput = z.infer<typeof IdentifyProductFromImageOutputSchema>;

export async function identifyProductFromImage(input: IdentifyProductFromImageInput): Promise<IdentifyProductFromImageOutput> {
  return identifyProductFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyProductFromImagePrompt',
  input: {schema: IdentifyProductFromImageInputSchema},
  output: {schema: IdentifyProductFromImageOutputSchema},
  prompt: `You are an expert AI assistant that identifies products from images and helps users find them for sale online.

1.  Analyze the provided image to identify the product. Determine its most likely name.
2.  For the identified product, generate plausible search links for major e-commerce platforms (like Google Shopping, Amazon, Walmart).
3.  The links should be search query URLs that allow the user to find the item themselves. For example, for a "Nike Air Max shoe", a Google Shopping link would be "https://www.google.com/search?tbm=shop&q=Nike+Air+Max". Do not provide prices, as you cannot know them in real-time.
4.  Respond in JSON format according to the output schema. Provide the identified product name, a confidence score (0-1), and a list of purchasing options.

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
