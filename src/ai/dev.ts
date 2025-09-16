import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-product-reviews.ts';
import '@/ai/flows/generate-product-image.ts';
import '@/ai/flows/identify-product-from-image.ts';
import '@/ai/flows/generate-shopping-list.ts';