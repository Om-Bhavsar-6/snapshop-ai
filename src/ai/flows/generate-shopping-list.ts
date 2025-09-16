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
    .string()
    .describe('A categorized shopping list with necessary ingredients, formatted in Markdown.'),
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
  prompt: `You are a helpful shopping assistant. Generate a categorized shopping list based on the following description: {{{description}}}.

The output should be a Markdown formatted string.
Each category should be a heading (e.g., '## Produce').
Each item in the list should be a bullet point on a NEW LINE (e.g., '- Apples').
Provide specific, real-world items. For example, if the prompt is 'groceries for a week', suggest items like 'Spinach', 'Pulses', 'Groundnuts', etc.

Example Output:
## Produce
- 1 lb Fresh Spinach
- 2 lbs Tomatoes
- 1 head of Garlic

## Dairy
- 1 gallon Milk
- 1 dozen Eggs

## Pantry
- 1 bag of Lentils
- 2 cans of Chickpeas

Shopping List:`,
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
