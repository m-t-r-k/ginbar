import recipes from '../../data/cocktail-recipes.json';
import ingredients from '../../data/ingredients.json';
import {
  STRENGTH_OPTIONS, FLAVOR_PROFILES, AVOID_OPTIONS, LENGTH_OPTIONS,
  getCandidates, getStrengthLevel, getFilterLabel, recommend,
  getAbv, getIngredient, findIngredient, getActiveRecipes, isFiller
} from './cocktailLogic';

const byTitle = (title) => recipes.find(r => r.title === title);
const levelOf = (title) => {
  const strong = getCandidates(recipes, { strength: 'strong' });
  const light = getCandidates(recipes, { strength: 'light' });
  if (strong.includes(byTitle(title))) return 'strong';
  if (light.includes(byTitle(title))) return 'light';
  return 'other';
};

test('strength levels follow the alcohol share', () => {
  expect(levelOf('Negroni')).toBe('strong');
  expect(levelOf('Martini (Modern)')).toBe('strong');
  expect(levelOf('Dark & Stormy')).toBe('light');
  const nonalc = getCandidates(recipes, { strength: 'nonalc' }).map(r => r.title).sort();
  expect(nonalc).toEqual(['Cucumber Rose Cooler', 'Espresso Tonic']);
  expect(getStrengthLevel(byTitle('Espresso Tonic'), [0, 1])).toBe('nonalc');
});

test('avoiding gin removes gin spirits but keeps sloe gin', () => {
  const result = getCandidates(recipes, { avoid: ['gin'] });
  result.forEach(r => r.ingredients.forEach(i => expect(getFilterLabel(i.ingredient || '')).not.toBe('gin')));
  expect(result.map(r => r.title)).toContain('Charlie Chaplin'); // sloe gin
});

test('every answer combination yields 1-3 picks', () => {
  const subsets = (ids) => [[], ...ids.map(id => [id]), ids.slice(0, 2)];
  for (const strength of [undefined, ...STRENGTH_OPTIONS.map(o => o.id)]) {
    for (const flavors of subsets(FLAVOR_PROFILES.map(p => p.id))) {
      for (const avoid of subsets(AVOID_OPTIONS.map(o => o.id))) {
        for (const length of [undefined, ...LENGTH_OPTIONS.map(o => o.id)]) {
          const picks = recommend(recipes, { strength, flavors, avoid, length });
          expect(picks.length).toBeGreaterThanOrEqual(1);
          expect(picks.length).toBeLessThanOrEqual(3);
        }
      }
    }
  }
});

test('ABV comes from the ingredient list', () => {
  expect(getIngredient('Green Chartreuse').abv).toBe(55);
  expect(getIngredient('  green chartreuse ').abv).toBe(55);
  expect(findIngredient('GIN', ingredients)).toBe(ingredients.gin);
  expect(['soda water', 'cola', 'ginger beer', 'tonic water'].every(isFiller)).toBe(true);
  expect(isFiller('lemon juice')).toBe(false);
});

test('unknown ingredients fall back to an estimate', () => {
  expect(findIngredient('mystery whisky', ingredients)).toBeUndefined();
  expect(getIngredient('mystery whisky')).toMatchObject({ abv: 40, spirit: 'whiskey' });
  expect(getIngredient('passion fruit juice')).toMatchObject({ abv: 0 });
});

test('recipe ABV is volume-weighted and never NaN', () => {
  expect(getAbv({ ingredients: [{ amount: 1, unit: 'oz', ingredient: 'gin' }, { amount: 1, unit: 'oz', ingredient: 'lemon juice' }] })).toBe(20);
  expect(getAbv({ ingredients: [{ amount: 1, unit: '', ingredient: 'lemon twist' }] })).toBe(0);
  expect(getAbv(byTitle('Tom Collins'))).toBeLessThan(getAbv(byTitle('Clover Club')));
});

test('every ingredient of an active recipe has an entry', () => {
  const missing = getActiveRecipes(recipes).flatMap(r => r.ingredients.map(i => i.ingredient))
    .filter(name => !findIngredient(name, ingredients));
  expect(missing).toEqual([]);
});

test('archived recipes are filtered out', () => {
  const titles = getActiveRecipes(recipes).map(r => r.title);
  expect(titles).not.toContain('Cucumber Rose Cooler');
  expect(titles).not.toContain('Espresso Tonic');
  expect(titles).toHaveLength(33);
});
