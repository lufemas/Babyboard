// src/pages/api/recipes.json.ts
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  const mdRecipes = await getCollection('recipes');

  // Load extra JSON if present
  const dataDir = path.join(process.cwd(), 'src', 'data', 'recipes');
  let jsonRecipes: any[] = [];
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));
    jsonRecipes = files.map((f) => {
      const raw = fs.readFileSync(path.join(dataDir, f), 'utf-8');
      return JSON.parse(raw);
    });
  }

  const normalizedMd = mdRecipes.map((r) => ({
    id: r.slug,
    ...r.data,
    // fallback slug
    slug: r.slug,
  }));

  // Give IDs to JSON entries too
  const normalizedJson = jsonRecipes.map((r) => ({
    id: r.slug ?? r.title.toLowerCase().replace(/\s+/g, '-'),
    ...r,
    slug: r.slug ?? r.title.toLowerCase().replace(/\s+/g, '-'),
  }));

  const all = [...normalizedMd, ...normalizedJson];

  return new Response(JSON.stringify(all), {
    headers: { 'Content-Type': 'application/json' },
  });
}
