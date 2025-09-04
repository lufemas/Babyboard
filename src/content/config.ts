// src/content/config.ts
import { defineCollection, z } from 'astro:content';

export const recipeSchema = z.object({
  title: z.string(),
  slug: z.string().optional(), // auto from file if omitted
  domain: z.enum(['food-intro']).default('food-intro'),
  age_tags: z.array(z.string()).default([]), // e.g., ["5-6m"]
  ingredients: z.array(z.string()).default([]),
  ingredient_groups: z
    .array(
      z.object({
        group: z.string(), // e.g. "protein", "veg", "fat"
        items: z.array(z.string()),
      })
    )
    .default([]),
  steps: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  // For print grid sizing:
  print: z
    .object({
      size: z.enum(['small', 'medium', 'large']).default('small'),
    })
    .default({ size: 'small' }),
});

const recipes = defineCollection({
  type: 'content',
  schema: recipeSchema,
});

export const collections = { recipes };
