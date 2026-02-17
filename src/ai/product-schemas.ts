import { z } from 'genkit';

export const IdentifyProductFromImageOutputSchema = z.object({
  productName: z.string().describe('The name of the identified product.'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
  purchasingOptions: z.array(z.object({
    platform: z.string().describe('The name of the e-commerce platform (e.g., Amazon.in, Flipkart).'),
    link: z.string().url().describe('An exact link to find the product on the specified platform.'),
    price: z.string().describe('The current price of the product on the platform in INR (₹).'),
  })).describe('A list of exact links to find the product on different Indian platforms with real-time prices.')
});
