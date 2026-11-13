import recipes from '../../data/cocktail-recipes.json';
import ingredients from '../../data/ingredients.json';
import {
  STRENGTH_OPTIONS, FLAVOR_PROFILES, SPIRIT_OPTIONS, EXCLUDE_OPTIONS, LENGTH_OPTIONS,
  getCandidates, getStrengthLevel, getFlavorMatches, getSpirits, evaluate, recommend, getNearMisses,
  getAbv, getIngredient, findIngredient, getActiveRecipes, isFiller
} from './cocktailLogic';

const byTitle = (title) => recipes.find(r => r.title === title);
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

const titles = (list) => list.map(r => r.title);

test('fixed strength bands', () => {
  expect(getStrengthLevel(byTitle('Tom Collins'))).toBe('light');
  expect(getStrengthLevel(byTitle('Long Island Iced Tea'))).toBe('balanced');
  expect(getStrengthLevel(byTitle('Negroni'))).toBe('strong');
  expect(getStrengthLevel(byTitle('Martini (Modern)'))).toBe('strong');
  expect(getStrengthLevel(byTitle('Dark & Stormy'))).toBe('light');
});

test('flavors come from ingredient tags', () => {
  expect(getFlavorMatches(byTitle('Tom Collins'), 'sour')).toEqual(['lemon juice']);
  expect(getFlavorMatches(byTitle('Martini (Modern)'), 'sour')).toEqual([]);
  expect(getFlavorMatches(byTitle('Dark & Stormy'), 'sour')).toEqual(['lime juice']);  // 24,8 % ohne Ginger Beer
  expect(getFlavorMatches(byTitle('Fog Cutter'), 'sour')).toEqual(['lime juice']);      // 14,8 %
  expect(getFlavorMatches(byTitle('Boston Cocktail'), 'sour')).toEqual([]);           // 13,3 % < 14 %
  expect(getFlavorMatches(byTitle('Negroni'), 'bitter').length).toBeGreaterThan(0);
});

test('liked spirits are a hard filter, sloe gin is no gin', () => {
  const result = getCandidates(recipes, { spirits: ['gin'] });
  result.forEach(r => getSpirits(r).forEach(s => expect(s).toBe('gin')));
  expect(titles(result)).toContain('Charlie Chaplin');        // sloe gin + apricot brandy, keine Basis
  expect(titles(result)).not.toContain('Long Island Iced Tea');
});

test('excluded ingredients never show up, not even as near miss', () => {
  const answers = { flavors: [], spirits: [], exclude: ['egg'], strength: 'balanced' };
  const all = [...recommend(recipes, answers), ...getNearMisses(recipes, answers).map(n => n.recipe)];
  all.forEach(r => r.ingredients.forEach(i => expect(i.ingredient).not.toMatch(/egg white/i)));
  expect(titles(getCandidates(recipes, { exclude: ['egg'] }))).not.toContain('Clover Club');
});

test('near misses miss exactly one criterion and carry a reason', () => {
  const answers = { strength: 'light', flavors: [], spirits: ['gin'], exclude: [], length: 'long' };
  const near = getNearMisses(recipes, answers);
  expect(near.length).toBeGreaterThan(0);
  near.forEach(({ recipe, reason }) => {
    const e = evaluate(recipe, answers);
    expect(Object.values(e).filter(c => !c.ok)).toHaveLength(1);
    expect(Math.abs(e.strength.diff)).toBeLessThanOrEqual(1);
    expect(reason).toMatch(/^(a bit stronger than you asked|a bit lighter|made with .+|served (long|short))$/);
  });
});

test('archived recipes never appear in guide results', () => {
  const answers = { flavors: ['herbal'], spirits: [], exclude: [] };
  expect(titles(getCandidates(recipes, answers))).not.toContain('Cucumber Rose Cooler');
  expect(titles(getNearMisses(recipes, answers).map(n => n.recipe))).not.toContain('Espresso Tonic');
});

test('every answer combination is consistent', () => {
  const subsets = (ids) => [[], ...ids.map(id => [id]), ids.slice(0, 2)];
  for (const strength of [undefined, ...STRENGTH_OPTIONS.map(o => o.id)])
    for (const flavors of subsets(FLAVOR_PROFILES.map(p => p.id)))
      for (const spirits of subsets(SPIRIT_OPTIONS.map(o => o.id)))
        for (const exclude of subsets(EXCLUDE_OPTIONS.map(o => o.id)))
          for (const length of [undefined, ...LENGTH_OPTIONS.map(o => o.id)]) {
            const answers = { strength, flavors, spirits, exclude, length };
            const picks = recommend(recipes, answers);
            const near = getNearMisses(recipes, answers);
            expect(picks.length).toBeLessThanOrEqual(3);
            expect(near.length).toBeLessThanOrEqual(3);
            picks.forEach(r => expect(Object.values(evaluate(r, answers)).every(c => c.ok)).toBe(true));
            near.forEach(({ recipe }) => expect(evaluate(recipe, answers).excluded.ok).toBe(true));
          }
});

// Prüftabelle für den Betreiber: ABV_REPORT=1 npx vitest run -t "abv report" --silent=false
test.runIf(process.env.ABV_REPORT)('abv report', () => {
  console.table(getActiveRecipes(recipes).map(r => ({ title: r.title, abv: getAbv(r).toFixed(1), level: getStrengthLevel(r),
    flavors: FLAVOR_PROFILES.map(p => p.id).filter(t => getFlavorMatches(r, t).length).join(' '), spirits: getSpirits(r).join(' ') }))
    .sort((a, b) => a.abv - b.abv));
});
