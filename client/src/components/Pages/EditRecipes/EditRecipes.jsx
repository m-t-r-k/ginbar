import React, { useCallback, useEffect, useState } from 'react';
import './EditRecipes.scss';
import { SPIRITS, FLAVOR_TAGS, normalizeName, findIngredient, estimateIngredient } from '../../BarMenuList/cocktailLogic';
// Nur lokal (Route existiert in Production nicht). Validierung macht server/dev-server.js.

const API_BASE = import.meta.env.VITE_DEV_API || 'http://localhost:3001';

const emptyIngredient = () => ({ amount: '', unit: 'oz', ingredient: '' });
const emptyForm = () => ({ title: '', glassware: '', instructions: '', archived: false, ingredients: [emptyIngredient()] });

// Nur gesetzte optionale Felder speichern, damit ingredients.json schlank bleibt
const cleanEntry = ({ abv, spirit, flavors, filler }) =>
  ({ abv, ...(spirit && { spirit }), flavors, ...(filler && { filler: true }) });
const validAbv = (abv) => typeof abv === 'number' && abv >= 0 && abv <= 100;
const describeEntry = (e) => [`${e.abv}%`, e.spirit, ...e.flavors, e.filler && 'filler'].filter(Boolean).join(' · ');

// ABV, Spirituose, Geschmack, Auffüller – im Rezeptformular für neue Zutaten und im Reiter "Ingredients"
function IngredientFields({ entry, onChange }) {
  const set = (field, value) => onChange({ ...entry, [field]: value });
  const toggleFlavor = (tag) => set('flavors', entry.flavors.includes(tag) ? entry.flavors.filter(t => t !== tag) : [...entry.flavors, tag]);
  return (
    <span className="ingredient-fields">
      <label>ABV <input type="number" min="0" max="100" step="0.1" value={entry.abv}
        onChange={e => set('abv', e.target.value === '' ? '' : Number(e.target.value))} /></label>
      <select value={entry.spirit || ''} onChange={e => set('spirit', e.target.value || undefined)} aria-label="Spirit">
        <option value="">no base spirit</option>
        {SPIRITS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
      </select>
      {FLAVOR_TAGS.map(tag => (
        <button type="button" key={tag} className={entry.flavors.includes(tag) ? 'small tag active' : 'small tag'}
          aria-pressed={entry.flavors.includes(tag)} onClick={() => toggleFlavor(tag)}>{tag}</button>
      ))}
      <label><input type="checkbox" checked={!!entry.filler} onChange={e => set('filler', e.target.checked || undefined)} /> Filler (topped up)</label>
    </span>
  );
}

// "1,5" -> 1.5, ".5" -> 0.5; Nicht-Zahlen ("top up") bleiben Text
const normalizeAmount = (amount) => {
  const str = (amount ?? '').toString().trim().replace(',', '.');
  if (str === '') return '';
  const num = Number(str.startsWith('.') ? '0' + str : str);
  return Number.isNaN(num) ? str : num;
};

// Eindeutige Werte, häufigste zuerst, dann alphabetisch
const byFrequency = (values) => {
  const counts = new Map();
  values.map(v => (v || '').toString().trim()).filter(Boolean)
    .forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
  return [...counts.entries()].sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0])).map(([v]) => v);
};

// Eingabefeld mit Vorschlagsliste: Tippen filtert, ▾ zeigt alle, Pfeiltasten/Enter/Esc
function Combobox({ value, onChange, options, className, ...inputProps }) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const visible = showAll ? options : options.filter(o => o.toLowerCase().includes((value || '').toLowerCase()));

  const openList = (all) => { setOpen(true); setShowAll(all); setHighlight(-1); };
  const close = () => { setOpen(false); setHighlight(-1); };
  const select = (option) => { onChange(option); close(); };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') setHighlight(h => (h < visible.length - 1 ? h + 1 : 0));
    else if (e.key === 'ArrowUp') setHighlight(h => (h > 0 ? h - 1 : visible.length - 1));
    else if (e.key === 'Enter' && visible[highlight]) select(visible[highlight]);
    else if (e.key === 'Escape') close();
    else return;
    e.preventDefault();
  };

  return (
    <div className={className}>
      <input {...inputProps} autoComplete="off" autoCorrect="off" spellCheck={false} value={value}
        onChange={e => { onChange(e.target.value); openList(false); }}
        onFocus={() => openList(false)}
        onBlur={close}
        onKeyDown={handleKeyDown} />
      {/* onMouseDown + preventDefault: Fokus bleibt im Input, onBlur schließt nicht vor dem Klick */}
      <button type="button" className="small show-options" tabIndex={-1}
        onMouseDown={e => { e.preventDefault(); open && showAll ? close() : openList(true); }}>▾</button>
      {open && visible.length > 0 && (
        <ul className="options-dropdown">
          {visible.map((option, idx) => (
            <li key={option} className={highlight === idx ? 'highlighted' : ''}>
              <button type="button" tabIndex={-1} onMouseDown={e => { e.preventDefault(); select(option); }}>{option}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ingredientList, setIngredientList] = useState({});
  // Entwürfe für Zutaten ohne Eintrag, Schlüssel = normalisierter Name
  const [pending, setPending] = useState({});
  const [tab, setTab] = useState('recipes');

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const [res, ingRes] = await Promise.all([
        fetch(`${API_BASE}/api/dev/recipes`),
        fetch(`${API_BASE}/api/dev/ingredients`),
      ]);
      if (!res.ok || !ingRes.ok) throw new Error();
      setIngredientList(await ingRes.json());
      const data = await res.json();
      data.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
      setRecipes(data);
    } catch {
      setError('Failed to load recipes. Is the dev server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  const allIngredients = recipes.flatMap(r => r.ingredients || []);
  const glassOptions = byFrequency(recipes.map(r => r.glassware));
  const unitOptions = byFrequency(allIngredients.map(i => i.unit));
  const ingredientOptions = byFrequency(allIngredients.map(i => i.ingredient));

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (idx, field, value) => {
    setForm(prev => {
      const ingredients = [...prev.ingredients];
      ingredients[idx] = { ...ingredients[idx], [field]: value };
      return { ...prev, ingredients };
    });
  };

  const addIngredient = () => setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, emptyIngredient()] }));
  const removeIngredient = (idx) => setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }));

  const resetMessages = () => { setError(''); setSuccess(''); };

  const draftFor = (name) => pending[normalizeName(name)] ?? estimateIngredient(name);
  const setDraft = (name, entry) => setPending(prev => ({ ...prev, [normalizeName(name)]: entry }));
  const usageCount = (name) => recipes.filter(r => (r.ingredients || []).some(i => normalizeName(i.ingredient) === normalizeName(name))).length;

  const handleEdit = (recipe) => {
    setForm({
      title: recipe.title || '',
      glassware: recipe.glassware || '',
      instructions: recipe.instructions || '',
      archived: !!recipe.archived,
      ingredients: recipe.ingredients && recipe.ingredients.length ? recipe.ingredients : [emptyIngredient()],
    });
    setEditingId(recipe.id);
    resetMessages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
    setPending({});
    resetMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    // Leere Zutatenzeilen fallen weg
    const ingredients = form.ingredients.map(i => ({
      amount: normalizeAmount(i.amount),
      unit: (i.unit || '').toString().trim(),
      ingredient: (i.ingredient || '').toString().trim(),
    })).filter(i => i.ingredient !== '' && i.amount !== '');

    const payload = {
      title: form.title.trim(),
      glassware: form.glassware.trim(),
      instructions: form.instructions.trim(),
      ingredients,
      ...(form.archived && { archived: true }),
    };

    // Neue Zutaten (je Name einmal) brauchen einen Eintrag, bei aktiven Rezepten mit gültigem ABV
    const newNames = [...new Map(ingredients
      .filter(i => !findIngredient(i.ingredient, ingredientList))
      .map(i => [normalizeName(i.ingredient), i.ingredient])).values()];
    const invalid = newNames.find(name => !validAbv(draftFor(name).abv));
    if (invalid && !form.archived) {
      setError(`Please enter an ABV (0–100) for "${invalid}".`);
      return;
    }
    const newEntries = Object.fromEntries(newNames.filter(name => validAbv(draftFor(name).abv))
      .map(name => [name, cleanEntry(draftFor(name))]));

    const isUpdate = editingId !== null;
    try {
      setLoading(true);
      // Erst die Zutaten speichern – der Server lehnt Rezepte mit unbekannten Zutaten ab
      if (Object.keys(newEntries).length) {
        const ingRes = await fetch(`${API_BASE}/api/dev/ingredients`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ingredientList, ...newEntries }),
        });
        const ingData = await ingRes.json().catch(() => ({}));
        if (!ingRes.ok) {
          setError(`Saving ingredients failed: ${ingData.error || ingRes.statusText}`);
          return;
        }
        setIngredientList(ingData);
      }
      const res = await fetch(`${API_BASE}/api/dev/recipes${isUpdate ? `/${editingId}` : ''}`, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(`${isUpdate ? 'Update' : 'Save'} failed: ${data.error || res.statusText} (status ${res.status})`);
        return;
      }
      setSuccess(`Recipe ${isUpdate ? 'updated' : 'saved'} successfully (id ${data.id})`);
      setEditingId(null);
      setForm(emptyForm());
      setPending({});
      fetchRecipes();
    } catch (err) {
      setError(err.message || 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  const saveIngredientList = async () => {
    resetMessages();
    const bad = Object.entries(ingredientList).find(([, e]) => !validAbv(e.abv));
    if (bad) { setError(`Please enter an ABV (0–100) for "${bad[0]}".`); return; }
    const body = Object.fromEntries(Object.entries(ingredientList).map(([name, e]) => [name, cleanEntry(e)]));
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/dev/ingredients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(`Saving ingredients failed: ${data.error || res.statusText}`); return; }
      setIngredientList(data);
      setSuccess('Ingredients saved');
    } catch (err) {
      setError(err.message || 'Error saving ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete recipe?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/dev/recipes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSuccess('Recipe deleted');
      fetchRecipes();
    } catch (err) {
      setError(err.message || 'Error deleting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pageWrapper">
      <div className="fixed_width">
        <div className="edit-recipes">
          <h2>Developer: Edit Recipes (local)</h2>
          <div className="tabs">
            <button type="button" className={tab === 'recipes' ? 'active' : ''} onClick={() => setTab('recipes')}>Recipes</button>
            <button type="button" className={tab === 'ingredients' ? 'active' : ''} onClick={() => setTab('ingredients')}>Ingredients</button>
          </div>
          {tab === 'ingredients' ? (
            <div className="ingredient-table">
              <table>
                <thead><tr><th>Name</th><th>ABV · spirit · flavors · filler</th><th>Recipes</th><th></th></tr></thead>
                <tbody>
                  {Object.entries(ingredientList)
                    .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
                    .map(([name, entry]) => {
                      const used = usageCount(name);
                      return (
                        <tr key={name}>
                          <td>{name}</td>
                          <td><IngredientFields entry={entry} onChange={e => setIngredientList(prev => ({ ...prev, [name]: e }))} /></td>
                          <td>{used}</td>
                          <td>
                            <button type="button" className="small danger" disabled={used > 0}
                              title={used > 0 ? 'Used by recipes' : 'Delete entry'}
                              onClick={() => setIngredientList(({ [name]: _removed, ...rest }) => rest)}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="actions">
                <button type="button" onClick={saveIngredientList} disabled={loading}>Save ingredients</button>
                <button type="button" onClick={fetchRecipes} disabled={loading}>Discard changes</button>
              </div>
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
            </div>
          ) : (
          <div className="container">
            <div className="left-column">
              <form className="recipe-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="row">
                  <label>Name</label>
                  <input name="title" value={form.title} onChange={handleFormChange} />
                </div>
                <div className="row select-row">
                  <label>Glass</label>
                  <Combobox className="select-wrapper" name="glassware" value={form.glassware} options={glassOptions}
                    onChange={value => setForm(prev => ({ ...prev, glassware: value }))} />
                </div>
                <div className="row">
                  <label>Instructions</label>
                  <textarea name="instructions" value={form.instructions} onChange={handleFormChange} />
                </div>

                <div className="ingredients">
                  <label>Ingredients</label>
                  {form.ingredients.map((ing, i) => (
                    <div className="ingredient-row" key={i}>
                      <input placeholder="Amount" value={ing.amount} onChange={e => handleIngredientChange(i, 'amount', e.target.value)} />
                      <Combobox className="small-select-wrapper" placeholder="Unit" value={ing.unit} options={unitOptions}
                        onChange={value => handleIngredientChange(i, 'unit', value)} />
                      <Combobox className="small-select-wrapper ingredient-name-wrapper" placeholder="Ingredient" value={ing.ingredient} options={ingredientOptions}
                        onChange={value => handleIngredientChange(i, 'ingredient', value)} />
                      {form.ingredients.length > 1 && <button type="button" className="small" onClick={() => removeIngredient(i)}>Remove</button>}
                      {ing.ingredient.trim() !== '' && (findIngredient(ing.ingredient, ingredientList)
                        ? <span className="ingredient-hint">{describeEntry(findIngredient(ing.ingredient, ingredientList))}</span>
                        : <div className="new-ingredient">
                            <span>New ingredient – please check:</span>
                            <IngredientFields entry={draftFor(ing.ingredient)} onChange={entry => setDraft(ing.ingredient, entry)} />
                          </div>)}
                    </div>
                  ))}
                  <button type="button" onClick={addIngredient}>Add Ingredient</button>
                </div>

                <label className="archived-toggle">
                  <input type="checkbox" checked={form.archived} onChange={e => setForm(prev => ({ ...prev, archived: e.target.checked }))} />
                  {' '}Archived (hidden from bar menu and guide)
                </label>

                <div className="actions">
                  <button type="submit" disabled={loading}>{loading ? 'Saving...' : (editingId !== null ? 'Update Recipe' : 'Save Recipe')}</button>
                  {editingId !== null && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
              </form>
            </div>

            <div className="recipe-list">
              <h3>Existing Recipes</h3>
              {loading && <p>Loading…</p>}
              {!loading && recipes.length === 0 && <p>No recipes found</p>}
              <ul>
                {recipes.map(r => (
                  <li key={r.id} className={r.archived ? 'archived' : ''}>
                    <span>{r.title}</span>
                    <div>
                      <button className="small" onClick={() => handleEdit(r)}>Edit</button>
                      <button className="small danger" onClick={() => handleDelete(r.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EditRecipes;
