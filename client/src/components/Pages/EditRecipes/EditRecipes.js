import React, { useEffect, useState, useRef } from 'react';
import './EditRecipes.scss';
// Uses existing layout classes: .pageWrapper and .fixed_width (page-level layout is applied)

const PASSWORD = '0801';
const API_BASE = process.env.REACT_APP_DEV_API || 'http://localhost:3001';

const emptyIngredient = () => ({ amount: '', unit: '', ingredient: '' });

const validateRecipe = (recipe) => {
  if (!recipe.title || !recipe.instructions) return false;
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) return false;
  // each ingredient must have ingredient name and amount (unit may be empty)
  for (const ing of recipe.ingredients) {
    if (!ing.ingredient || ing.ingredient.trim() === '') return false;
    if (ing.amount === '' || ing.amount === null) return false;
  }
  return true;
};

function EditRecipes() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('editRecipesAuth') === 'true');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // dynamic option lists derived from recipes (unique values)
  const [glassOptions, setGlassOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const [form, setForm] = useState({
    title: '',
    glassware: '',
    instructions: '',
    ingredients: [emptyIngredient()]
  });
  const [editingId, setEditingId] = useState(null);

  // dropdown visibility state for showing full option lists on demand
  const [showGlassDropdown, setShowGlassDropdown] = useState(false);
  const [glassShowAll, setGlassShowAll] = useState(false);
  const [showUnitDropdownIndex, setShowUnitDropdownIndex] = useState(null);
  // when true for an index, show the full list; otherwise show filtered list based on input value
  const [unitShowAllIndex, setUnitShowAllIndex] = useState(null);
  const containerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const scheduleClose = (delay = 150) => {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setShowGlassDropdown(false);
      setGlassShowAll(false);
      setShowUnitDropdownIndex(null);
      setUnitShowAllIndex(null);
    }, delay);
  };

  const cancelClose = () => { clearTimeout(closeTimeoutRef.current); };

  useEffect(() => {
    if (authenticated) fetchRecipes();
  }, [authenticated]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/dev/recipes`);
      if (!res.ok) throw new Error('Failed to load recipes');
      const data = await res.json();
      // sort alphabetically by title (case-insensitive)
      data.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
      setRecipes(data);
      // derive unique glass and unit options from the dataset
      computeOptionsFromData(data);
    } catch (err) {
      setError('Failed to load recipes. Is the dev server running?');
    } finally {
      setLoading(false);
    }
  };

  const computeOptionsFromData = (data) => {
    // count occurrences and sort by frequency (desc), then alphabetically
    const glassCount = new Map();
    const unitCount = new Map();
    for (const r of data) {
      const g = r.glassware && r.glassware.toString().trim();
      if (g) glassCount.set(g, (glassCount.get(g) || 0) + 1);
      if (Array.isArray(r.ingredients)) {
        for (const ing of r.ingredients) {
          const u = ing.unit && ing.unit.toString().trim();
          if (u) unitCount.set(u, (unitCount.get(u) || 0) + 1);
        }
      }
    }

    const glassArr = Array.from(glassCount.entries())
      .sort((a,b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
      .map(([val]) => val);

    const unitArr = Array.from(unitCount.entries())
      .sort((a,b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
      .map(([val]) => val);

    setGlassOptions(glassArr);
    setUnitOptions(unitArr);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (code === PASSWORD) {
      sessionStorage.setItem('editRecipesAuth', 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Wrong code');
    }
  };

  const toggleGlassDropdown = () => { cancelClose(); setShowGlassDropdown(prev => !prev); setGlassShowAll(prev => !prev); setShowUnitDropdownIndex(null); setUnitShowAllIndex(null); };
  const toggleUnitDropdown = (idx) => { cancelClose(); setShowUnitDropdownIndex(prev => (prev === idx ? null : idx)); setUnitShowAllIndex(prev => (prev === idx ? null : idx)); setShowGlassDropdown(false); setGlassShowAll(false); };
  const selectGlassOption = (val) => { cancelClose(); setForm(prev => ({ ...prev, glassware: val })); setShowGlassDropdown(false); setGlassShowAll(false); };
  const selectUnitOption = (idx, val) => { cancelClose(); handleIngredientChange(idx, 'unit', val); setShowUnitDropdownIndex(null); setUnitShowAllIndex(null); };

  // close dropdowns when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        cancelClose();
        setShowGlassDropdown(false);
        setGlassShowAll(false);
        setShowUnitDropdownIndex(null);
        setUnitShowAllIndex(null);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

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

  const addIngredient = () => {
    setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, emptyIngredient()] }));
  };

  const removeIngredient = (idx) => {
    setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }));
  };

  const handleEdit = (recipe) => {
    setForm({
      title: recipe.title || '',
      glassware: recipe.glassware || '',
      instructions: recipe.instructions || '',
      ingredients: recipe.ingredients && recipe.ingredients.length ? recipe.ingredients : [emptyIngredient()]
    });
    setEditingId(recipe.id);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', glassware: '', instructions: '', ingredients: [emptyIngredient()] });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Clean up ingredient rows: trim values and remove empty trailing rows
    const cleanedIngredients = (form.ingredients || []).map(i => ({
      amount: i.amount === null || i.amount === undefined ? '' : i.amount.toString().trim(),
      unit: (i.unit || '').toString().trim(),
      ingredient: (i.ingredient || '').toString().trim()
    })).filter(i => i.ingredient !== '' && i.amount !== '');

    const cleanedForm = {
      title: (form.title || '').toString().trim(),
      glassware: (form.glassware || '').toString().trim(),
      instructions: (form.instructions || '').toString().trim(),
      ingredients: cleanedIngredients
    };

    if (!validateRecipe(cleanedForm)) {
      setError('Please fill out all required fields and complete all ingredients.');
      return;
    }

    // Normalize numeric amounts where possible
    const normalizedIngredients = cleanedForm.ingredients.map(i => {
      const num = Number(i.amount);
      return { ...i, amount: (i.amount !== '' && !Number.isNaN(num)) ? num : i.amount };
    });

    const payload = { ...cleanedForm, ingredients: normalizedIngredients };

    try {
      // debug: show the payload being submitted to the dev server
      console.debug('Submitting recipe payload', { id: editingId, payload });
      setLoading(true);
      let res;
      if (editingId !== null) {
        // Update existing recipe
        res = await fetch(`${API_BASE}/api/dev/recipes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new
        res = await fetch(`${API_BASE}/api/dev/recipes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const status = res.status;
        const statusText = res.statusText || '';
        const detail = err.error || err.details || JSON.stringify(err) || 'Unknown error';
        const msg = `${editingId !== null ? 'Update' : 'Save'} failed: ${detail} (status ${status} ${statusText})`;
        setError(msg);
        return;
      }

      const data = await res.json();
      // add any new glass/unit values into the local option lists immediately (place at front)
      const newGlass = payload.glassware && payload.glassware.toString().trim();
      if (newGlass) {
        setGlassOptions(prev => {
          const arr = prev.filter(x => x !== newGlass);
          return [newGlass, ...arr];
        });
      }
      const formUnits = Array.from(new Set((payload.ingredients || []).map(i => (i.unit && i.unit.toString().trim()) || '').filter(Boolean)));
      if (formUnits.length) {
        setUnitOptions(prev => {
          const arr = prev.filter(x => !formUnits.includes(x));
          return [...formUnits, ...arr];
        });
      }

      if (editingId !== null) {
        setSuccess('Recipe updated successfully (id ' + data.id + ')');
        setEditingId(null);
      } else {
        setSuccess('Recipe saved successfully (id ' + data.id + ')');
      }

      setForm({ title: '', glassware: '', instructions: '', ingredients: [emptyIngredient()] });
      fetchRecipes();
    } catch (err) {
      setError(err.message || 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete recipe?');
    if (!ok) return;
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

  if (!authenticated) {
    return (
      <section className="pageWrapper">
        <div className="fixed_width">
          <div className="edit-recipes auth">
            <h2>Developer: Edit Recipes (local)</h2>
            <form onSubmit={handleAuth} className="auth-form" autoComplete="off">
              <label>4-digit code</label>
              <input type="password" maxLength={4} value={code} onChange={e => setCode(e.target.value)} />
              <button type="submit">Log in</button>
              {error && <p className="error">{error}</p>}
              <p className="note">This page is for local development only. The code is hard-coded.</p>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pageWrapper">
      <div className="fixed_width">
        <div className="edit-recipes" ref={containerRef}>
          <h2>Developer: Edit Recipes (local)</h2>
          <div className="container">
            <form className="recipe-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="row">
                <label>Name</label>
                <input name="title" value={form.title} onChange={handleFormChange} />
              </div>
              <div className="row select-row">
                <label>Glass</label>
                <div className="select-wrapper">
                  <input name="glassware" autoComplete="off" autoCorrect="off" spellCheck={false} value={form.glassware} onChange={(e) => { handleFormChange(e); setShowGlassDropdown(true); setGlassShowAll(false); }} onFocus={() => { cancelClose(); setShowGlassDropdown(true); setGlassShowAll(false); }} onBlur={() => { scheduleClose(); }} />
                  <button type="button" className="small show-options" onClick={toggleGlassDropdown}>▾</button>
                  {showGlassDropdown && (
                    <ul className="options-dropdown">
                      {(glassShowAll ? glassOptions : glassOptions.filter(g => g.toLowerCase().includes((form.glassware || '').toLowerCase()))).map(g => (
                        <li key={g}><button type="button" onClick={() => selectGlassOption(g)}>{g}</button></li>
                      ))}
                    </ul>
                  )}
                </div>
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
                    <div className="small-select-wrapper">
                      <input name={`unit-${i}`} placeholder="Unit" autoComplete="off" autoCorrect="off" spellCheck={false} value={ing.unit} onChange={e => { handleIngredientChange(i, 'unit', e.target.value); setShowUnitDropdownIndex(i); setUnitShowAllIndex(null); }} onFocus={() => { cancelClose(); setShowUnitDropdownIndex(i); setUnitShowAllIndex(null); }} onBlur={() => { scheduleClose(); }} />
                      <button type="button" className="small show-options" onClick={() => toggleUnitDropdown(i)}>▾</button>
                      {showUnitDropdownIndex === i && (
                        <ul className="options-dropdown">
                          {(unitShowAllIndex === i ? unitOptions : unitOptions.filter(u => u.toLowerCase().includes((ing.unit || '').toLowerCase()))).map(u => (
                            <li key={u}><button type="button" onClick={() => selectUnitOption(i, u)}>{u}</button></li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <input placeholder="Ingredient" value={ing.ingredient} onChange={e => handleIngredientChange(i, 'ingredient', e.target.value)} />
                    {form.ingredients.length > 1 && <button type="button" className="small" onClick={() => removeIngredient(i)}>Remove</button>}
                  </div>
                ))}
                <button type="button" onClick={addIngredient}>Add Ingredient</button>
                <datalist id="unit-options">
                  {unitOptions.map(u => (<option key={u} value={u} />))}
                </datalist>
              </div>

              <div className="actions">
            <button type="submit" disabled={loading}>{loading ? (editingId ? 'Saving...' : 'Saving...') : (editingId ? 'Update Recipe' : 'Save Recipe')}</button>
            {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
            <button type="button" className="danger" onClick={() => { sessionStorage.removeItem('editRecipesAuth'); setAuthenticated(false); }}>Logout</button>
              </div>

              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
            </form>

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
