'use server';

/**
 * @fileOverview Generates an illustrative image for a given product and finds web matches for it.
 *
 * - generateProductImage - A function that generates an image for a product and finds purchase options.
 * - GenerateProductImageInput - The input type for the generateProductImage function.
 * - GenerateProductImageOutput - The return type for the generateProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { identifyProductFromImage } from './identify-product-from-image';
import { IdentifyProductFromImageOutputSchema } from '@/ai/product-schemas';

const GenerateProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the product to generate an image for.'),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
  product: IdentifyProductFromImageOutputSchema.optional().describe('The identified product details and purchasing options.'),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;

export async function generateProductImage(input: GenerateProductImageInput): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}


const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async input => {
    // 1. Generate the image
    const imagePrompt = `Generate a representative illustrative image for the following product: ${input.productName}. The image should be suitable for display in a shopping list application.`;
    
    const {media} = await ai.generate({
      prompt: imagePrompt,
      model: 'googleai/imagen-4.0-fast-generate-001',
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error("Image generation failed.");
    }

    // 2. Identify the product from the generated image
    let product;
    try {
        // Use the generated image data URI to find matching products online.
        product = await identifyProductFromImage({ photoDataUri: imageUrl });
    } catch (e) {
        console.error("Failed to identify product from generated image:", e);
        // If product identification fails, we can proceed without it.
        product = undefined;
    }
    
    // 3. Return both the image and the product matches
    return { imageUrl, product };
  }
);
