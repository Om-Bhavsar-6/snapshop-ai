"use server";

import { z } from "zod";
import { generateShoppingList } from "@/ai/flows/generate-shopping-list";
import { polishReview } from "@/ai/flows/summarize-product-reviews";
import { generateProductImage } from "@/ai/flows/generate-product-image";
import { identifyProductFromImage } from "@/ai/flows/identify-product-from-image";
import { revalidatePath } from "next/cache";

function handleActionError(e: unknown) {
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    if (error.toLowerCase().includes("api key") || error.includes("network error")) {
        return { _server: ["AI service connection failed. Please ensure your GEMINI_API_KEY is set correctly." ]};
    }
    return { _server: [error] };
}


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
    return { type: "success" as const, shoppingList, errors: null, query: validatedFields.data.description };
  } catch (e) {
    return { type: "error" as const, errors: handleActionError(e), shoppingList: null };
  }
}

// Polish Product Review Action
const polishReviewSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters."),
  review: z.string().min(5, "Please provide a review to polish."),
});

export async function polishReviewAction(prevState: any, formData: FormData) {
    const validatedFields = polishReviewSchema.safeParse({
        productName: formData.get('productName'),
        review: formData.get('review'),
    });

    if (!validatedFields.success) {
        return {
            type: "error" as const,
            errors: validatedFields.error.flatten().fieldErrors,
            polishedReview: null,
        };
    }

    try {
        const { polishedReview } = await polishReview(validatedFields.data);
        revalidatePath("/tools/review-summarizer");
        return { type: "success" as const, polishedReview, errors: null, query: validatedFields.data };
    } catch (e) {
        return { type: "error" as const, errors: handleActionError(e), polishedReview: null };
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
        return { type: "success" as const, imageUrl, errors: null, query: validatedFields.data.productName };
    } catch (e) {
        return { type: "error" as const, errors: handleActionError(e), imageUrl: null };
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
        return { type: "success" as const, product, errors: null, query: validatedFields.data.photoDataUri };
    } catch (e) {
        return { type: "error" as const, errors: handleActionError(e), product: null };
    }
}
