// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const recipe = defineCollection({
  type: 'content', // MD/MDX only
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    domain: z.enum(['food-intro']).default('food-intro'),
    age_tags: z.array(z.string()).default([]),     // e.g. ["5-6m"]
    ingredients: z.array(z.string()).default([]),  // e.g. ["beef","pumpkin"]
    ingredient_groups: z.array(z.object({
      group: z.string(), items: z.array(z.string())
    })).default([]),
    steps: z.array(z.string()).default([]),
    notes: z.array(z.string()).default([]),
    print: z.object({ size: z.enum(['small','medium','large']).default('small') })
           .default({ size: 'small' }),
  }),
});

export const collections = { recipes: recipe };
