import React, { useCallback, useEffect, useState } from 'react';
import './EditRecipes.scss';
// Nur lokal (Route existiert in Production nicht). Validierung macht server/dev-server.js.

const API_BASE = process.env.REACT_APP_DEV_API || 'http://localhost:3001';

const emptyIngredient = () => ({ amount: '', unit: 'oz', ingredient: '' });
const emptyForm = () => ({ title: '', glassware: '', instructions: '', ingredients: [emptyIngredient()] });

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

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/dev/recipes`);
      if (!res.ok) throw new Error();
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

  const handleEdit = (recipe) => {
    setForm({
      title: recipe.title || '',
      glassware: recipe.glassware || '',
      instructions: recipe.instructions || '',
      ingredients: recipe.ingredients && recipe.ingredients.length ? recipe.ingredients : [emptyIngredient()],
    });
    setEditingId(recipe.id);
    resetMessages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
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
    };

    const isUpdate = editingId !== null;
    try {
      setLoading(true);
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
      fetchRecipes();
    } catch (err) {
      setError(err.message || 'Error saving');
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
                    </div>
                  ))}
                  <button type="button" onClick={addIngredient}>Add Ingredient</button>
                </div>

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
                  <li key={r.id}>
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
        </div>
      </div>
    </section>
  );
}

export default EditRecipes;
