const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, '..', 'client', 'src', 'data', 'cocktail-recipes.json');

app.use(cors());
app.use(express.json());

function readData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
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
