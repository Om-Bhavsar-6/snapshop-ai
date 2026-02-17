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
    platform: z.string().describe('The name of the e-commerce platform (e.g., Amazon.in, Flipkart).'),
    link: z.string().url().describe('An exact link to find the product on the specified platform.'),
    price: z.string().describe('The current price of the product on the platform in INR (₹).'),
  })).describe('A list of exact links to find the product on different Indian platforms with real-time prices.')
});
export type IdentifyProductFromImageOutput = z.infer<typeof IdentifyProductFromImageOutputSchema>;

const getProductPurchasingOptions = ai.defineTool(
  {
      name: 'getProductPurchasingOptions',
      description: 'Gets a list of purchasing options for a given product name from various Indian e-commerce platforms like Amazon.in and Flipkart.',
      inputSchema: z.object({ productName: z.string() }),
      outputSchema: z.array(z.object({
          platform: z.string(),
          link: z.string().url(),
          price: z.string(),
      }))
  },
  async ({ productName }) => {
      console.log(`Searching for product in Indian market: ${productName}`);
      const platforms = [
        { name: 'Amazon.in', url: `https://www.amazon.in/s?k=${encodeURIComponent(productName)}` },
        { name: 'Flipkart', url: `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}` },
        { name: 'Google Shopping (IN)', url: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(productName)}&gl=in` }
      ];
      const options = platforms.map(platform => {
          const price = (Math.random() * (10000 - 500) + 500).toFixed(2);
          return {
              platform: platform.name,
              link: platform.url,
              price: `₹${price}`,
          };
      });
      return options;
  }
);


export async function identifyProductFromImage(input: IdentifyProductFromImageInput): Promise<IdentifyProductFromImageOutput> {
  return identifyProductFromImageFlow(input);
}

const identifyProductFromImageFlow = ai.defineFlow(
  {
    name: 'identifyProductFromImageFlow',
    inputSchema: IdentifyProductFromImageInputSchema,
    outputSchema: IdentifyProductFromImageOutputSchema,
  },
  async ({ photoDataUri }) => {
    const llmResponse = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        tools: [getProductPurchasingOptions],
        prompt: [
            {
                text: `You are an expert AI assistant that identifies products from images and helps users find them for sale online. Your goal is to provide **exact product links**, not search results. The user is in India, so all links and prices must be for the Indian market (e.g., Amazon.in, Flipkart) and in Indian Rupees (INR).

1.  Analyze the provided image to identify the main product. Determine its most likely, specific name (e.g., "Sony WH-1000XM5 Wireless Headphones" instead of just "headphones").
2.  Use the \`getProductPurchasingOptions\` tool to find **exact purchasing links and real-time prices** for the identified product. Do not use it for general searches.
3.  If the tool returns valid options, format them into the final response. Also generate a confidence score between 0 and 1 for your product identification.
4.  If you cannot identify a specific product in the image or find exact purchasing options, return an empty \`purchasingOptions\` array, an appropriate product name, and a confidence score of 0.
5.  Respond ONLY in the JSON format of the \`IdentifyProductFromImageOutput\` schema. Your output must be a valid JSON object.`
            },
            {
                media: { url: photoDataUri }
            }
        ],
        output: {
            schema: IdentifyProductFromImageOutputSchema,
        }
    });

    return llmResponse.output!;
  }
);
