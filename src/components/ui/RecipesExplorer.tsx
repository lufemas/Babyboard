// src/components/ui/RecipesExplorer.tsx
import React, { useEffect, useMemo, useState } from 'react';

type Recipe = {
  id: string;
  title: string;
  age_tags?: string[];
  ingredients?: string[];
  steps?: string[];
  print?: { size:'small'|'medium'|'large' };
};

const SELECT_KEY = 'selectedRecipes';

export default function RecipesExplorer({ base = '/' }:{ base?: string }) {
  const BASE = base; // now correct on Pages  const BASE = import.meta.env.BASE_URL; // works in TSX
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredientsFilter, setIngredientsFilter] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(
    () => { try { return JSON.parse(localStorage.getItem(SELECT_KEY) || '[]'); } catch { return []; } }
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE}api/recipes.api`).then(r=>r.json()).then(setRecipes).finally(()=>setLoading(false));
  }, [BASE]);

  const allIngredients = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach(r => r.ingredients?.forEach(i => set.add(i)));
    return Array.from(set).sort();
  }, [recipes]);

  const allAges = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach(r => r.age_tags?.forEach(a => set.add(a)));
    return Array.from(set).sort();
  }, [recipes]);

  const filtered = useMemo(() => {
    return recipes.filter(r => {
      const ingOk = ingredientsFilter.length === 0 ||
        (r.ingredients && ingredientsFilter.every(f => r.ingredients!.includes(f)));
      const ageOk = ageFilter.length === 0 ||
        (r.age_tags && ageFilter.every(f => r.age_tags!.includes(f)));
      return ingOk && ageOk;
    });
  }, [recipes, ingredientsFilter, ageFilter]);

  useEffect(() => {
    localStorage.setItem(SELECT_KEY, JSON.stringify(selected));
  }, [selected]);

  function toggleSelection(id:string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  }

  function openPrint() {
    const q = new URLSearchParams({ ids: selected.join(',') }).toString();
    window.open(`${BASE}print?${q}`, '_blank');
  }

  const FilterPill = ({label, checked, onClick}:{label:string;checked:boolean;onClick:()=>void}) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition
        ${checked ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 text-slate-700 hover:border-slate-400'}`}>
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <details className="rounded-lg border border-slate-200 p-3 open:p-4">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Filtros
          <span className="ml-2 text-sm text-slate-500">(toque para { /* open/close */ } abrir/fechar)</span>
        </summary>

        <div className="mt-3 space-y-3">
          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">Ingredientes</div>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map(i => (
                <FilterPill key={i}
                  label={i}
                  checked={ingredientsFilter.includes(i)}
                  onClick={() =>
                    setIngredientsFilter(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i])
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">Idade</div>
            <div className="flex flex-wrap gap-2">
              {allAges.map(a => (
                <FilterPill key={a}
                  label={a}
                  checked={ageFilter.includes(a)}
                  onClick={() =>
                    setAgeFilter(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev, a])
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="h-44 rounded-xl border border-slate-200 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-10">Nenhuma receita encontrada com os filtros atuais.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((r) => {
            const isSel = selected.includes(r.id);
            return (
              <article key={r.id} className="rounded-xl border border-slate-200 p-4 bg-white shadow-sm">
                <h3 className="font-semibold text-slate-900">{r.title}</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(r.age_tags||[]).map(a => <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{a}</span>)}
                </div>
                <p className="mt-2 text-sm"><b>Ingredientes: </b>{(r.ingredients||[]).join(', ')}</p>
                {r.steps && r.steps.length>0 && (
                  <ol className="mt-2 list-decimal list-inside text-sm space-y-1">
                    {r.steps.map((s,i)=><li key={i}>{s}</li>)}
                  </ol>
                )}
                <button
                  onClick={()=>toggleSelection(r.id)}
                  aria-pressed={isSel}
                  className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm font-medium transition
                    ${isSel
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                >
                  {isSel ? '✓ Adicionada para imprimir' : 'Adicionar para imprimir'}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Mobile sticky print button */}
      {selected.length > 0 && (
        <div className="fixed bottom-3 left-0 right-0 flex justify-center sm:hidden">
          <button onClick={openPrint}
            className="mx-4 w-full max-w-md rounded-full bg-emerald-600 text-white py-3 shadow-lg font-semibold">
            Imprimir selecionadas ({selected.length})
          </button>
        </div>
      )}

      {/* Desktop print button */}
      <div className="hidden sm:flex justify-end">
        <button onClick={openPrint}
          className="rounded-md border border-emerald-600 text-emerald-700 px-4 py-2 hover:bg-emerald-50">
          Imprimir selecionadas ({selected.length})
        </button>
      </div>
    </div>
  );
}
