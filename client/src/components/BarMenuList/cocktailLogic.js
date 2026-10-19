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

// Alkoholfrei = keine Zutat aus Spirits oder Liqueurs & Wine (Bitters-Dashes zählen nicht)
const ALCOHOLIC_GROUPS = ['Spirits', 'Liqueurs & Wine'];
export const isNonAlcoholic = (recipe) =>
  !(recipe.ingredients || []).some(i => ALCOHOLIC_GROUPS.includes(getIngredientGroup(i.ingredient || '')));

// ---------- Cocktail Guide ----------

const OZ_PER_UNIT = { oz: 1, teaspoon: 1 / 6, dashes: 1 / 32, drops: 1 / 160 };
const toOz = (ing) => (OZ_PER_UNIT[ing.unit] || 0) * (Number(ing.amount) || 0);

const WINE_LIKE = /vermouth|wine|sherry|\bport\b/i;
// ponytail: grobe ABV-Faktoren pro Gruppe, ohne Verdünnung durch Eis – reicht zum Sortieren nach Stärke
const abvFactor = (ingredient) => {
  const group = getIngredientGroup(ingredient);
  if (group === 'Spirits') return 0.4;
  if (group === 'Liqueurs & Wine') return WINE_LIKE.test(ingredient) ? 0.17 : 0.25;
  return 0;
};

export const estimateAbv = (recipe) => {
  let alcohol = 0;
  let total = 0;
  (recipe.ingredients || []).forEach(ing => {
    const oz = toOz(ing);
    total += oz;
    alcohol += oz * abvFactor(ing.ingredient || '');
  });
  return total ? alcohol / total : 0;
};

export const STRENGTH_OPTIONS = [
  { id: 'nonalc', label: 'Non-alc', hint: 'No alcohol at all' },
  { id: 'light', label: 'Light', hint: 'Easy-going, less booze' },
  { id: 'balanced', label: 'Balanced', hint: 'Noticeable, but well rounded' },
  { id: 'strong', label: 'Spirit-forward', hint: 'Strong, mostly booze' },
];

// Stärkestufen = Drittel der alkoholischen Rezepte nach geschätztem ABV,
// damit neue Rezepte aus dem Editor automatisch passend einsortiert werden.
const strengthThresholds = (recipes) => {
  const abvs = recipes.filter(r => !isNonAlcoholic(r)).map(estimateAbv).sort((a, b) => a - b);
  return [abvs[Math.floor(abvs.length / 3)], abvs[Math.floor((abvs.length * 2) / 3)]];
};

export const getStrengthLevel = (recipe, thresholds) => {
  if (isNonAlcoholic(recipe)) return 'nonalc';
  const abv = estimateAbv(recipe);
  if (abv < thresholds[0]) return 'light';
  if (abv < thresholds[1]) return 'balanced';
  return 'strong';
};

// ODER innerhalb eines Profils, aber nur über Zutaten, die das Profil wirklich prägen
// (kein simple syrup / lemon juice – die stecken in fast allem).
export const FLAVOR_PROFILES = [
  { id: 'fruity', label: 'Fruity & Sour', regex: /raspberry|cassis|apricot|orange juice|grenadine|curaçao|triple sec|maraschino|\bport\b|sloe|mango|passion|pineapple|berry/i },
  { id: 'herbal', label: 'Herbal & Fresh', regex: /chartreuse|bénédictine|basil|thyme|rosmary|rosemary|lavender|sage|mint|menthe|earl grey|cucumber|rose water|ginger beer|tonic/i },
  { id: 'bitter', label: 'Bitter & Aromatic', regex: /campari|aperol|amaro|vermouth|sherry|bénédictine|chartreuse|bitters/i },
  { id: 'sweet', label: 'Sweet & Creamy', regex: /cacao|coffee liqueur|half-and-half|cream|egg white|espresso|orgeat|vanilla/i },
];

export const getFlavorMatches = (recipe, profileId) => {
  const profile = FLAVOR_PROFILES.find(p => p.id === profileId);
  return (recipe.ingredients || [])
    .map(i => i.ingredient || '')
    .filter(name => profile.regex.test(name));
};

// Basisspirituosen nur innerhalb der Spirits-Gruppe prüfen ("apricot brandy", "sloe gin" sind Liköre)
const spirit = (regex) => (name) => getIngredientGroup(name) === 'Spirits' && regex.test(name);
export const AVOID_OPTIONS = [
  { id: 'gin', label: 'gin', matches: spirit(/\bgin\b/i) },
  { id: 'rum', label: 'rum', matches: spirit(/\brum\b/i) },
  { id: 'whiskey', label: 'whiskey', matches: spirit(/whisk|bourbon|\brye\b/i) },
  { id: 'brandy', label: 'brandy', matches: spirit(/brandy|cognac/i) },
  { id: 'tequila', label: 'tequila', matches: spirit(/tequila|mezcal/i) },
  { id: 'vodka', label: 'vodka', matches: spirit(/vodka/i) },
  { id: 'egg', label: 'egg white', matches: (name) => /egg white/i.test(name) },
  { id: 'coffee', label: 'coffee', matches: (name) => /coffee|espresso/i.test(name) },
];

export const LENGTH_OPTIONS = [
  { id: 'short', label: 'Short & intense', hint: 'Served up or on the rocks' },
  { id: 'long', label: 'Long & refreshing', hint: 'Tall glass, lots of ice' },
];
const isLong = (recipe) => /collins|highball/i.test(recipe.glassware || '');

const containsAvoided = (recipe, avoid) =>
  AVOID_OPTIONS.filter(o => avoid.includes(o.id))
    .filter(o => (recipe.ingredients || []).some(i => o.matches(i.ingredient || '')));

// Antwort als harter Filter – würde er alles wegfiltern, bleiben die bisherigen Kandidaten
// und die Antwort wirkt nur noch über das Ranking. Ergebnis ist damit nie leer.
const narrow = (candidates, predicate) => {
  const next = candidates.filter(predicate);
  return next.length ? next : candidates;
};

// answers: { strength, flavors: [], avoid: [], length }
export const getCandidates = (recipes, answers) => {
  const thresholds = strengthThresholds(recipes);
  const { strength, flavors = [], avoid = [], length } = answers;
  let candidates = recipes;
  if (strength) candidates = narrow(candidates, r => getStrengthLevel(r, thresholds) === strength);
  if (avoid.length) candidates = narrow(candidates, r => containsAvoided(r, avoid).length === 0);
  if (flavors.length) candidates = narrow(candidates, r => flavors.some(f => getFlavorMatches(r, f).length));
  if (length) candidates = narrow(candidates, r => isLong(r) === (length === 'long'));
  return candidates;
};

const STRENGTH_TARGET = { light: 0, balanced: 0.5, strong: 1 };

const scoreRecipe = (recipe, answers, abvRange) => {
  const { strength, flavors = [], avoid = [], length } = answers;
  let score = 0;
  if (strength in STRENGTH_TARGET) {
    const [min, max] = abvRange;
    const position = max > min ? (estimateAbv(recipe) - min) / (max - min) : 0.5;
    score += 2 * (1 - Math.abs(position - STRENGTH_TARGET[strength]));
  }
  flavors.forEach(f => { score += Math.min(getFlavorMatches(recipe, f).length, 2); });
  if (length && isLong(recipe) === (length === 'long')) score += 1;
  score -= 10 * containsAvoided(recipe, avoid).length;
  return score;
};

// Top-Vorschläge (max. 3) nach Score; stabil sortiert, Gleichstand behält Eingabereihenfolge
export const recommend = (recipes, answers, count = 3) => {
  const abvs = recipes.filter(r => !isNonAlcoholic(r)).map(estimateAbv);
  const abvRange = [Math.min(...abvs), Math.max(...abvs)];
  return getCandidates(recipes, answers)
    .map(recipe => ({ recipe, score: scoreRecipe(recipe, answers, abvRange) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ recipe }) => recipe);
};
