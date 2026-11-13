import INGREDIENTS from '../../data/ingredients.json';

// Gemeinsame Logik für Bar-Menü-Filter und Cocktail Guide.
// Alles wird aus den Zutaten abgeleitet – keine Extra-Felder in den Rezepten nötig.

// Erste passende Gruppe gewinnt (Liqueurs vor Spirits wegen "sloe gin", "apricot brandy"),
// Rest landet in "Other" – neue Zutaten aus dem Editor werden so automatisch einsortiert.
export const INGREDIENT_GROUPS = [
  ['Liqueurs & Wine', /liqueur|likör|crème de|curaçao|triple sec|maraschino|chartreuse|bénédictine|campari|aperol|amaretto|apricot brandy|sloe gin|vermouth|sherry|\bport\b|wine|wein/i],
  ['Spirits', /\bgin\b|\brum\b|brandy|whisk|bourbon|tequila|mezcal|vodka|cognac|geist|pisco|calvados/i],
  ['Syrups & Juices', /syrup|sirup|grenadine|juice|saft/i],
];
export const OTHER_GROUP = 'Other';

export const getIngredientGroup = (ingredient) =>
  (INGREDIENT_GROUPS.find(([, regex]) => regex.test(ingredient)) || [OTHER_GROUP])[0];

// Spirits-Varianten im Filter zusammenfassen ("dark rum" -> "rum", "thyme-infused gin" -> "gin").
// Nur innerhalb Spirits, damit z.B. "sloe gin" (Liqueur) eigenständig bleibt.
const COLLAPSED_SPIRITS = ['gin', 'rum'];
export const getFilterLabel = (ingredient) =>
  (getIngredientGroup(ingredient) === 'Spirits' &&
    COLLAPSED_SPIRITS.find(spirit => new RegExp(`\\b${spirit}\\b`, 'i').test(ingredient))) || ingredient;

// ---------- Cocktail Guide ----------

export const SPIRITS = ['gin', 'rum', 'whiskey', 'brandy', 'tequila', 'vodka'];
export const FLAVOR_TAGS = ['sour', 'fruity', 'herbal', 'bitter', 'sweet'];

export const normalizeName = (name) => (name || '').toString().trim().toLowerCase();

// Abgleich gegen eine beliebige Zutatenliste (Editor nutzt die frisch geladene)
export const findIngredient = (name, ingredients) => {
  const wanted = normalizeName(name);
  const key = Object.keys(ingredients).find(k => normalizeName(k) === wanted);
  return key === undefined ? undefined : ingredients[key];
};

// Regex-Schätzung nur als Fallback für unbekannte Zutaten und als Vorbelegung im Editor.
// Der Test "every ingredient of an active recipe has an entry" sorgt dafür, dass sie live nie greift.
const WINE_LIKE = /vermouth|wine|sherry|\bport\b/i;
const SPIRIT_REGEX = {
  gin: /\bgin\b/i, rum: /\brum\b/i, whiskey: /whisk|bourbon|\brye\b/i,
  brandy: /brandy|cognac/i, tequila: /tequila|mezcal/i, vodka: /vodka/i,
};
const FLAVOR_REGEX = {
  sour: /lemon juice|lime juice/i,
  fruity: /raspberry|cassis|apricot|orange juice|grenadine|curaçao|triple sec|maraschino|\bport\b|sloe|mango|passion|pineapple|berry/i,
  herbal: /chartreuse|bénédictine|basil|thyme|rosmary|rosemary|lavender|sage|mint|menthe|earl grey|cucumber|rose water|ginger beer|tonic/i,
  bitter: /campari|aperol|amaro|vermouth|sherry|bénédictine|chartreuse|bitters/i,
  sweet: /cacao|coffee liqueur|half-and-half|cream|egg white|espresso|orgeat|vanilla/i,
};

export const estimateIngredient = (name) => {
  const group = getIngredientGroup(name);
  const abv = group === 'Spirits' ? 40 : group === 'Liqueurs & Wine' ? (WINE_LIKE.test(name) ? 17 : 25) : 0;
  const spirit = group === 'Spirits' ? SPIRITS.find(s => SPIRIT_REGEX[s].test(name)) : undefined;
  const flavors = FLAVOR_TAGS.filter(tag => FLAVOR_REGEX[tag].test(name));
  return spirit ? { abv, spirit, flavors } : { abv, flavors };
};

const INGREDIENT_MAP = new Map(Object.entries(INGREDIENTS).map(([k, v]) => [normalizeName(k), v]));
export const getIngredient = (name) => INGREDIENT_MAP.get(normalizeName(name)) ?? estimateIngredient(name || '');
export const isFiller = (name) => getIngredient(name).filler === true;

export const getActiveRecipes = (recipes) => recipes.filter(r => !r.archived);

const OZ_PER_UNIT = { oz: 1, teaspoon: 1 / 6, dashes: 1 / 32, drops: 1 / 160 };
export const toOz = (ing) => (OZ_PER_UNIT[ing.unit] || 0) * (Number(ing.amount) || 0);

// Volumengewichteter ABV in Prozent, unverdünnt (Eis wird bewusst ignoriert)
export const getAbv = (recipe) => {
  let alcohol = 0;
  let total = 0;
  (recipe.ingredients || []).forEach(ing => {
    const oz = toOz(ing);
    total += oz;
    alcohol += oz * getIngredient(ing.ingredient).abv;
  });
  return total ? alcohol / total : 0;
};

export const STRENGTH_OPTIONS = [
  { id: 'light', label: 'Light', hint: 'Easy-going, less booze' },
  { id: 'balanced', label: 'Balanced', hint: 'Noticeable, but well rounded' },
  { id: 'strong', label: 'Spirit-forward', hint: 'Strong, mostly booze' },
];
// Obergrenzen der Stufen in % ABV (exklusiv, unverdünnt) – mit dem Betreiber kalibrierbar
export const STRENGTH_LEVELS = { light: 18, balanced: 26 };
const LEVEL_ORDER = STRENGTH_OPTIONS.map(o => o.id);

export const getStrengthLevel = (recipe) => {
  const abv = getAbv(recipe);
  if (abv < STRENGTH_LEVELS.light) return 'light';
  if (abv < STRENGTH_LEVELS.balanced) return 'balanced';
  return 'strong';
};

export const FLAVOR_PROFILES = [
  { id: 'sour', label: 'Fresh & Sour' },
  { id: 'fruity', label: 'Fruity' },
  { id: 'herbal', label: 'Herbal & Floral' },
  { id: 'bitter', label: 'Bitter & Aromatic' },
  { id: 'sweet', label: 'Sweet & Creamy' },
];
// Geschmack steht am Rezept ("flavors": max. 2 Primärgeschmäcker, vom Betreiber gepflegt).
// Die Zutaten-Tags liefern nur den Vorschlag dafür im Editor: Tags nach Volumen gewichtet, die zwei stärksten.
export const MAX_RECIPE_FLAVORS = 2;
export const suggestFlavors = (recipe) => {
  const volumeByTag = Object.fromEntries(FLAVOR_TAGS.map(tag => [tag, 0]));
  (recipe.ingredients || []).forEach(ing => getIngredient(ing.ingredient).flavors.forEach(tag => { volumeByTag[tag] += toOz(ing); }));
  return FLAVOR_TAGS.filter(tag => volumeByTag[tag] > 0)
    .sort((a, b) => volumeByTag[b] - volumeByTag[a])
    .slice(0, MAX_RECIPE_FLAVORS);
};

export const SPIRIT_OPTIONS = SPIRITS.map(id => ({ id, label: id }));
export const getSpirits = (recipe) =>
  [...new Set((recipe.ingredients || []).map(i => getIngredient(i.ingredient).spirit).filter(Boolean))];

export const LENGTH_OPTIONS = [
  { id: 'short', label: 'Short & intense', hint: 'Served up or on the rocks' },
  { id: 'long', label: 'Long & refreshing', hint: 'Tall glass, lots of ice' },
];
const isLong = (recipe) => /collins|highball/i.test(recipe.glassware || '');

// answers: { strength, flavors: [], spirits: [], length }
// Nicht beantwortete Kriterien sind immer ok. Drinks ohne Basisspirituose passen zu jeder Spirituosen-Auswahl.
export const evaluate = (recipe, answers) => {
  const { strength, flavors = [], spirits = [], length } = answers;
  const actualStrength = getStrengthLevel(recipe);
  const diff = strength ? LEVEL_ORDER.indexOf(actualStrength) - LEVEL_ORDER.indexOf(strength) : 0;
  const disliked = spirits.length ? getSpirits(recipe).filter(s => !spirits.includes(s)) : [];
  const matches = flavors.filter(f => (recipe.flavors || []).includes(f));
  const actualLength = isLong(recipe) ? 'long' : 'short';
  return {
    strength: { ok: diff === 0, actual: actualStrength, diff },
    spirits: { ok: disliked.length === 0, disliked },
    flavor: { ok: !flavors.length || matches.length > 0, matches },
    length: { ok: !length || actualLength === length, actual: actualLength },
  };
};

// Ranking nach Priorität des Betreibers: erst Stärke, dann Geschmack.
// Stärke = Abstand zum Ziel-ABV der gewählten Stufe: Light leichtester zuerst, Spirit-forward stärkster zuerst.
export const STRENGTH_TARGET = { light: 0, balanced: 22, strong: 100 };
const abvDistance = (recipe, strength) => (strength ? Math.abs(getAbv(recipe) - STRENGTH_TARGET[strength]) : 0);
const flavorScore = (recipe, flavors = []) => flavors.filter(f => (recipe.flavors || []).includes(f)).length;
// Stabil sortiert: Gleichstand behält die Eingabereihenfolge (der Guide mischt vorher)
const rank = (recipes, answers, firstKey = () => 0) => recipes
  .map(recipe => ({ recipe, keys: [firstKey(recipe), abvDistance(recipe, answers.strength), -flavorScore(recipe, answers.flavors)] }))
  .sort((a, b) => a.keys.reduce((diff, key, i) => diff || key - b.keys[i], 0))
  .map(({ recipe }) => recipe);

// Harte Filter: alle Kriterien müssen passen, kein Fallback mehr
export const getCandidates = (recipes, answers) =>
  getActiveRecipes(recipes).filter(r => Object.values(evaluate(r, answers)).every(c => c.ok));

export const recommend = (recipes, answers, count = 3) =>
  rank(getCandidates(recipes, answers), answers).slice(0, count);

const flavorLabel = (id) => (FLAVOR_PROFILES.find(p => p.id === id) || { label: id }).label;
const NEAR_MISS_REASON = {
  length: (e) => `served ${e.length.actual}`,
  spirits: (e) => `made with ${e.spirits.disliked.join(' & ')}`,
  flavor: (e, recipe) => `different flavor: ${(recipe.flavors || []).map(flavorLabel).join(', ')}`,
  strength: (e) => (e.strength.diff > 0 ? 'a bit stronger than you asked' : 'a bit lighter'),
};
// Lockerungs-Reihenfolge = umgekehrte Priorität: zuerst Länge/Spirituose, dann Geschmack, zuletzt Stärke (max. 1 Stufe)
const RELAX_ORDER = ['length', 'spirits', 'flavor', 'strength'];
const failedCriterion = (e) => {
  const failed = RELAX_ORDER.filter(key => !e[key].ok);
  return failed.length === 1 && Math.abs(e.strength.diff) <= 1 ? failed[0] : null;
};

// Fast-Treffer: genau ein Kriterium passt nicht
export const getNearMisses = (recipes, answers, count = 3) => {
  const misses = getActiveRecipes(recipes).filter(r => failedCriterion(evaluate(r, answers)));
  const relaxIndex = (r) => RELAX_ORDER.indexOf(failedCriterion(evaluate(r, answers)));
  return rank(misses, answers, relaxIndex)
    .slice(0, count)
    .map(recipe => {
      const e = evaluate(recipe, answers);
      return { recipe, reason: NEAR_MISS_REASON[failedCriterion(e)](e, recipe) };
    });
};
