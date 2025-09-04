// src/pages/api/recipes.api.ts
import { getCollection } from 'astro:content';

export async function GET() {
  const md = await getCollection('recipes');

  const all = md.map((r) => ({
    id: r.slug,
    slug: r.slug,
    ...r.data,
  }));

  return new Response(JSON.stringify(all), {
    headers: { 'Content-Type': 'application/json' },
  });
}
