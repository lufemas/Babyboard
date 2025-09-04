// src/components/ui/RecipesExplorer.tsx
import React, { useEffect, useMemo, useState } from 'react';
import FilterCheckbox from './FilterCheckbox';

type Recipe = {
  id: string;
  title: string;
  age_tags?: string[];
  ingredients?: string[];
  ingredient_groups?: { group: string; items: string[] }[];
  steps?: string[];
  domain?: string;
  slug?: string;
  print?: { size: 'small' | 'medium' | 'large' };
};

const SELECT_KEY = 'selectedRecipes';

export default function RecipesExplorer() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredientsFilter, setIngredientsFilter] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SELECT_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch('/api/recipes.json')
      .then((r) => r.json())
      .then(setRecipes);
  }, []);

  // build facets
  const allIngredients = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.ingredients?.forEach((i) => set.add(i)));
    return Array.from(set).sort();
  }, [recipes]);

  const allAges = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.age_tags?.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [recipes]);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const ingOk =
        ingredientsFilter.length === 0 ||
        (r.ingredients &&
          ingredientsFilter.every((f) => r.ingredients!.includes(f)));
      const ageOk =
        ageFilter.length === 0 ||
        (r.age_tags && ageFilter.every((f) => r.age_tags!.includes(f)));
      return ingOk && ageOk;
    });
  }, [recipes, ingredientsFilter, ageFilter]);

  useEffect(() => {
    localStorage.setItem(SELECT_KEY, JSON.stringify(selected));
  }, [selected]);

  function toggleSelection(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function onIngredientChange(v: string, c: boolean) {
    setIngredientsFilter((prev) =>
      c ? [...prev, v] : prev.filter((x) => x !== v)
    );
  }
  function onAgeChange(v: string, c: boolean) {
    setAgeFilter((prev) => (c ? [...prev, v] : prev.filter((x) => x !== v)));
  }

  function openPrint() {
    // pass IDs via query for shareability; print page also falls back to localStorage
    const q = new URLSearchParams({ ids: selected.join(',') }).toString();
    window.open(`/print?${q}`, '_blank');
  }

  return (
    <div>
      <div className="toolbar no-print">
        <strong>Filtros:</strong>
        <div>
          {allIngredients.map((i) => (
            <FilterCheckbox
              key={i}
              label={i}
              value={i}
              checked={ingredientsFilter.includes(i)}
              onChange={onIngredientChange}
            />
          ))}
        </div>
        <div>
          {allAges.map((a) => (
            <FilterCheckbox
              key={a}
              label={a}
              value={a}
              checked={ageFilter.includes(a)}
              onChange={onAgeChange}
            />
          ))}
        </div>
        <button className="button filled" onClick={openPrint}>
          Imprimir selecionadas ({selected.length})
        </button>
      </div>

      <div className="grid">
        {filtered.map((r) => (
          <article key={r.id} className="card">
            <h3>{r.title}</h3>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                margin: '4px 0 8px',
              }}
            >
              {(r.age_tags || []).map((a) => (
                <span key={a} className="badge">
                  {a}
                </span>
              ))}
            </div>
            <p>
              <b>Ingredientes:</b> {(r.ingredients || []).join(', ')}
            </p>
            {r.steps && r.steps.length > 0 && (
              <ol>
                {r.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}
            <button
              className="button"
              onClick={() => toggleSelection(r.id)}
              aria-pressed={selected.includes(r.id)}
            >
              {selected.includes(r.id)
                ? 'Remover da impressão'
                : 'Adicionar para imprimir'}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
