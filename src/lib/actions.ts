"use server";

import { z } from "zod";
import { generateShoppingList } from "@/ai/flows/generate-shopping-list";
import { summarizeProductReviews } from "@/ai/flows/summarize-product-reviews";
import { generateProductImage } from "@/ai/flows/generate-product-image";
import { identifyProductFromImage } from "@/ai/flows/identify-product-from-image";
import { revalidatePath } from "next/cache";

// Generate Shopping List Action
const shoppingListSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description."),
});

export async function createShoppingListAction(prevState: any, formData: FormData) {
  const validatedFields = shoppingListSchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      type: "error" as const,
      errors: validatedFields.error.flatten().fieldErrors,
      shoppingList: null,
    };
  }

  try {
    const { shoppingList } = await generateShoppingList({
      description: validatedFields.data.description,
    });
    revalidatePath("/dashboard");
    return { type: "success" as const, shoppingList, errors: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    return { type: "error" as const, errors: { _server: [error] }, shoppingList: null };
  }
}

// Summarize Product Reviews Action
const reviewSummarySchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters."),
  reviews: z.string().min(20, "Please provide more review text."),
});

export async function summarizeReviewsAction(prevState: any, formData: FormData) {
    const validatedFields = reviewSummarySchema.safeParse({
        productName: formData.get('productName'),
        reviews: formData.get('reviews'),
    });

    if (!validatedFields.success) {
        return {
            type: "error" as const,
            errors: validatedFields.error.flatten().fieldErrors,
            summary: null,
        };
    }

    try {
        const { summary } = await summarizeProductReviews(validatedFields.data);
        revalidatePath("/tools/review-summarizer");
        return { type: "success" as const, summary, errors: null };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { type: "error" as const, errors: { _server: [error] }, summary: null };
    }
}

// Generate Product Image Action
const productImageSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters."),
});

export async function generateImageAction(prevState: any, formData: FormData) {
    const validatedFields = productImageSchema.safeParse({
        productName: formData.get('productName'),
    });

    if (!validatedFields.success) {
        return {
            type: "error" as const,
            errors: validatedFields.error.flatten().fieldErrors,
            imageUrl: null,
        };
    }

    try {
        const { imageUrl } = await generateProductImage(validatedFields.data);
        revalidatePath("/tools/image-generator");
        return { type: "success" as const, imageUrl, errors: null };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { type: "error" as const, errors: { _server: [error] }, imageUrl: null };
    }
}

// Identify Product From Image Action
const identifyProductSchema = z.object({
  photoDataUri: z.string().min(1, "Image data is required."),
});

export async function identifyProductAction(prevState: any, formData: FormData) {
    const validatedFields = identifyProductSchema.safeParse({
        photoDataUri: formData.get('photoDataUri'),
    });
    
    if (!validatedFields.success) {
        return {
            type: "error" as const,
            errors: validatedFields.error.flatten().fieldErrors,
            product: null,
        };
    }

    try {
        const product = await identifyProductFromImage(validatedFields.data);
        revalidatePath("/visual-search");
        return { type: "success" as const, product, errors: null };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { type: "error" as const, errors: { _server: [error] }, product: null };
    }
}