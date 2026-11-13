const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, '..', 'client', 'src', 'data', 'cocktail-recipes.json');
const INGREDIENTS_PATH = path.join(__dirname, '..', 'client', 'src', 'data', 'ingredients.json');
// Gleiche Werte wie SPIRITS / FLAVOR_TAGS in client/src/components/BarMenuList/cocktailLogic.js
const SPIRITS = ['gin', 'rum', 'whiskey', 'brandy', 'tequila', 'vodka'];
const FLAVOR_TAGS = ['sour', 'fruity', 'herbal', 'bitter', 'sweet'];

app.use(cors());
app.use(express.json());

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

const readData = () => readJson(DATA_PATH);
const writeData = (data) => writeJson(DATA_PATH, data);

const normalizeName = (name) => (name || '').toString().trim().toLowerCase();
const ingredientNames = (ingredients) => new Set(Object.keys(ingredients).map(normalizeName));

function validateIngredients(ingredients, recipes) {
  if (!ingredients || typeof ingredients !== 'object' || Array.isArray(ingredients)) return { ok: false, error: 'Missing ingredients object' };
  const seen = new Set();
  for (const [name, entry] of Object.entries(ingredients)) {
    const key = normalizeName(name);
    if (!key) return { ok: false, error: 'Empty ingredient name' };
    if (seen.has(key)) return { ok: false, error: `Duplicate ingredient: ${name}` };
    seen.add(key);
    if (!entry || typeof entry.abv !== 'number' || !(entry.abv >= 0 && entry.abv <= 100)) return { ok: false, error: `Invalid abv for ${name}` };
    if (!Array.isArray(entry.flavors) || entry.flavors.some(f => !FLAVOR_TAGS.includes(f))) return { ok: false, error: `Invalid flavors for ${name}` };
    if (entry.spirit !== undefined && !SPIRITS.includes(entry.spirit)) return { ok: false, error: `Invalid spirit for ${name}` };
    if (entry.filler !== undefined && entry.filler !== true) return { ok: false, error: `Invalid filler for ${name}` };
  }
  const missing = recipes.filter(r => !r.archived).flatMap(r => r.ingredients.map(i => i.ingredient))
    .find(name => !seen.has(normalizeName(name)));
  if (missing) return { ok: false, error: `Ingredient still used by a recipe: ${missing}` };
  return { ok: true };
}

function validateRecipeServer(recipe) {
  if (!recipe || typeof recipe !== 'object') return { ok: false, error: 'Missing recipe object' };
  if (!recipe.title || recipe.title.toString().trim() === '') return { ok: false, error: 'Missing title' };
  if (!recipe.instructions || recipe.instructions.toString().trim() === '') return { ok: false, error: 'Missing instructions' };
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) return { ok: false, error: 'Missing ingredients' };
  for (let i = 0; i < recipe.ingredients.length; i++) {
    const ing = recipe.ingredients[i];
    if (!ing || !ing.ingredient || ing.ingredient.toString().trim() === '') return { ok: false, error: `Ingredient at index ${i} missing name` };
    if (ing.amount === '' || ing.amount === null || ing.amount === undefined) return { ok: false, error: `Ingredient at index ${i} missing amount` };
  }
  if (recipe.archived !== undefined && typeof recipe.archived !== 'boolean') return { ok: false, error: 'archived must be a boolean' };
  // Aktive Rezepte brauchen für jede Zutat einen Eintrag in ingredients.json (ABV, Geschmack)
  if (!recipe.archived) {
    const { flavors } = recipe;
    if (!Array.isArray(flavors) || flavors.length < 1 || flavors.length > 2 || flavors.some(f => !FLAVOR_TAGS.includes(f))) {
      return { ok: false, error: 'Pick one or two primary flavors' };
    }
    const known = ingredientNames(readJson(INGREDIENTS_PATH));
    const unknown = recipe.ingredients.find(ing => !known.has(normalizeName(ing.ingredient)));
    if (unknown) return { ok: false, error: `Unknown ingredient: ${unknown.ingredient}` };
  }
  return { ok: true };
}

// Get all recipes
app.get('/api/dev/recipes', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Unable to read recipes file.' });
  }
});

// Add a new recipe
app.post('/api/dev/recipes', (req, res) => {
  try {
    const recipe = req.body;
    const valid = validateRecipeServer(recipe);
    if (!valid.ok) {
      console.error('POST validation failed:', valid.error, recipe);
      return res.status(400).json({ error: valid.error });
    }

    const data = readData();
    const maxId = data.reduce((max, r) => (r.id > max ? r.id : max), -1);
    const newId = maxId + 1;
    const newRecipe = { ...recipe, id: newId };
    data.push(newRecipe);
    writeData(data);
    res.json(newRecipe);
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ error: 'Unable to save recipe.', details: err.message || String(err) });
  }
});

// Update an existing recipe
app.put('/api/dev/recipes/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
    const recipe = req.body;
    const valid = validateRecipeServer(recipe);
    if (!valid.ok) {
      console.error('PUT validation failed:', valid.error, recipe);
      return res.status(400).json({ error: valid.error });
    }

    const data = readData();
    const idx = data.findIndex(r => r.id === id);
    if (idx === -1) {
      console.error('PUT: recipe id not found:', id, 'available ids:', data.map(r => r.id));
      return res.status(404).json({ error: 'Recipe not found.', id, availableIds: data.map(r => r.id) });
    }

    const updated = { ...recipe, id };
    data[idx] = updated;
    writeData(data);
    res.json(updated);
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ error: 'Unable to update recipe.', details: err.message || String(err) });
  }
});

// Zutatenliste lesen / komplett ersetzen
app.get('/api/dev/ingredients', (req, res) => {
  try {
    res.json(readJson(INGREDIENTS_PATH));
  } catch (err) {
    res.status(500).json({ error: 'Unable to read ingredients file.' });
  }
});

app.put('/api/dev/ingredients', (req, res) => {
  try {
    const valid = validateIngredients(req.body, readData());
    if (!valid.ok) {
      console.error('PUT ingredients validation failed:', valid.error);
      return res.status(400).json({ error: valid.error });
    }
    writeJson(INGREDIENTS_PATH, req.body);
    res.json(req.body);
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ error: 'Unable to save ingredients.', details: err.message || String(err) });
  }
});

// Delete recipe by id
app.delete('/api/dev/recipes/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readData();
    const newData = data.filter(r => r.id !== id);
    if (newData.length === data.length) return res.status(404).json({ error: 'Recipe not found.' });
    writeData(newData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete recipe.' });
  }
});

app.listen(PORT, () => {
  console.log(`Dev API listening on http://localhost:${PORT}`);
});
