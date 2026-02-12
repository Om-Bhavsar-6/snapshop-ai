'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a categorized shopping list based on a user's description of their needs.
 *
 * - generateShoppingList - A function that takes a description of shopping needs and returns a categorized shopping list.
 * - GenerateShoppingListInput - The input type for the generateShoppingList function.
 * - GenerateShoppingListOutput - The return type for the generateShoppingList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShoppingListInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A description of the shopping needs, e.g., \'I\'m hosting a pizza night for 4 people\'.'
    ),
});
export type GenerateShoppingListInput = z.infer<
  typeof GenerateShoppingListInputSchema
>;

const GenerateShoppingListOutputSchema = z.object({
  shoppingList: z
    .array(
      z.object({
        category: z.string().describe('The category of the shopping list items.'),
        items: z
          .array(
            z.object({
              name: z.string().describe('The name of the shopping list item.'),
              link: z
                .string()
                .url()
                .describe(
                  'A URL to an e-commerce page for the item. Use a search query link if a direct product is not found.'
                ),
            })
          )
          .describe('An array of items in this category.'),
      })
    )
    .describe('A categorized shopping list with items and purchase links.'),
});
export type GenerateShoppingListOutput = z.infer<
  typeof GenerateShoppingListOutputSchema
>;

export async function generateShoppingList(
  input: GenerateShoppingListInput
): Promise<GenerateShoppingListOutput> {
  return generateShoppingListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShoppingListPrompt',
  input: {schema: GenerateShoppingListInputSchema},
  output: {schema: GenerateShoppingListOutputSchema},
  prompt: `You are a helpful shopping assistant. Your task is to generate a categorized shopping list based on the user's description. For each item in the list, you must also provide a plausible search link to a major e-commerce website (like Amazon, Walmart, or a general Google Shopping search) where the user could find and purchase that item.

User's Description: {{{description}}}

Generate a JSON object that adheres to the output schema. The output must be a JSON array of categories. Each category object should have a "category" name and a list of "items". Each item object must have a "name" and a "link".

For the 'link', if you can't find a specific product, create a search query URL. For example, for "1 lb Fresh Spinach", the link could be "https://www.google.com/search?tbm=shop&q=1+lb+fresh+spinach".

Provide only the JSON output.`,
});

const generateShoppingListFlow = ai.defineFlow(
  {
    name: 'generateShoppingListFlow',
    inputSchema: GenerateShoppingListInputSchema,
    outputSchema: GenerateShoppingListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
