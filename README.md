
# Baby Recipes (Astro Static)

Static site that generates **recipe cards** from **Markdown** and/or **JSON**.  
Filters (ingredients, age tags) and **select-to-print** use a small **React island**.  
Deployed on **GitHub Pages** via Actions.

## Why Astro
- Content-first with **Content Collections** (strict schemas via Zod).
- **Islands**: only hydrate the filter UI, everything else stays static.
- Zero server, easy to host on GitHub Pages.

## Content Model
We use two collections:
- `recipes` (type: content) → **MD/MDX** in `src/content/recipes/`
- `recipes_json` (type: data) → **JSON** in `src/content/recipes-json/`

Shared fields:
```ts
title, slug?, domain("food-intro"), age_tags[], ingredients[],
ingredient_groups[{group,items[]}], steps[], notes[], print{size}
```
    Tip: If you prefer simpler ops, use only MD.

## Add a Recipe (MD)
Create src/content/recipes/<slug>.md:
```
---
title: "Purê de Carne + Abóbora"
age_tags: ["5-6m"]
domain: "food-intro"
ingredients: ["beef","pumpkin","olive-oil"]
ingredient_groups:
  - group: "protein"
    items: ["beef"]
  - group: "veg"
    items: ["pumpkin"]
  - group: "fat"
    items: ["olive-oil"]
steps:
  - "Cozinhe..."
  - "Bata..."
notes:
  - "Servir após a fórmula."
print: { size: "small" }
---
```

Scripts
```
npm run dev     # local dev (optional)
npm run build   # static build to dist/
npm run preview # local preview (optional)
```

Deployment

Merges to main → GitHub Action builds & deploys to Pages.

PRs → build-only job validates schemas and site compiles.

UI / UX

Clean cards + sidebar filters + top navbar.

“Add to print” stores IDs in localStorage and querystring for shareable print links.

/print uses @media print to render fridge magnet cards (70×90mm).

Roadmap

Search bar (client-side fuzzy).

More sections (domain): e.g., meal plans, allergens, textures.

Content generator page (MD scaffold) with form → file download or PR bot.

Tech

Astro + Content Collections (Zod)

React island for filters

GitHub Pages with Actions

Development (100% online)

---


StackBlitz: New Astro → paste repo files → dev live.

GitHub + github.dev: Create repo → press . → edit → commit → Actions build on PR/main.

Codespaces: If enabled, launch full VS Code in cloud.

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

<!-- ASTRO:REMOVE:START -->

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

<!-- ASTRO:REMOVE:END -->

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

<!-- ASTRO:REMOVE:START -->

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

<!-- ASTRO:REMOVE:END -->

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
