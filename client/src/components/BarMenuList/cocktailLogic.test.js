import recipes from '../../data/cocktail-recipes.json';
import ingredients from '../../data/ingredients.json';
import {
  STRENGTH_OPTIONS, FLAVOR_PROFILES, SPIRIT_OPTIONS, LENGTH_OPTIONS,
  getCandidates, getStrengthLevel, suggestFlavors, getSpirits, FLAVOR_TAGS, evaluate, recommend, getNearMisses,
  getAbv, getIngredient, findIngredient, getActiveRecipes, isFiller
} from './cocktailLogic';

const byTitle = (title) => recipes.find(r => r.title === title);
test('ABV comes from the ingredient list', () => {
  expect(getIngredient('Green Chartreuse').abv).toBe(55);
  expect(getIngredient('  green chartreuse ').abv).toBe(55);
  expect(findIngredient('GIN', ingredients)).toBe(ingredients.gin);
  expect(['soda water', 'cola', 'ginger beer'].every(isFiller)).toBe(true);
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
  const list = [{ title: 'a' }, { title: 'b', archived: true }, { title: 'c', archived: false }];
  expect(getActiveRecipes(list).map(r => r.title)).toEqual(['a', 'c']);
});

const titles = (list) => list.map(r => r.title);

test('fixed strength bands', () => {
  expect(getStrengthLevel(byTitle('Tom Collins'))).toBe('light');
  expect(getStrengthLevel(byTitle('Long Island Iced Tea'))).toBe('balanced');
  expect(getStrengthLevel(byTitle('Negroni'))).toBe('strong');
  expect(getStrengthLevel(byTitle('Martini (Modern)'))).toBe('strong');
  expect(getStrengthLevel(byTitle('Dark & Stormy'))).toBe('light');
});

test('flavors come from the recipe, not the ingredients', () => {
  const answers = { flavors: ['sour'], spirits: [] };
  expect(evaluate({ ...byTitle('Clover Club'), flavors: ['fruity'] }, answers).flavor.ok).toBe(false);
  expect(evaluate({ ...byTitle('Clover Club'), flavors: ['fruity', 'sour'] }, answers).flavor).toEqual({ ok: true, matches: ['sour'] });
});

test('every active recipe has one or two valid primary flavors', () => {
  getActiveRecipes(recipes).forEach(r => {
    expect(r.flavors.length, r.title).toBeGreaterThanOrEqual(1);
    expect(r.flavors.length, r.title).toBeLessThanOrEqual(2);
    r.flavors.forEach(f => expect(FLAVOR_TAGS).toContain(f));
  });
});

test('flavor suggestion ranks ingredient tags by volume', () => {
  expect(suggestFlavors(byTitle('Tom Collins'))).toEqual(['sour']);
  expect(suggestFlavors(byTitle('Negroni'))).toEqual(['bitter']);
  expect(suggestFlavors(byTitle('Clover Club'))).toEqual(['sour', 'fruity']);  // Eiweiß hat kein Volumen
  expect(suggestFlavors({ ingredients: [] })).toEqual([]);
});

test('liked spirits are a hard filter, sloe gin is no gin', () => {
  const result = getCandidates(recipes, { spirits: ['gin'] });
  result.forEach(r => getSpirits(r).forEach(s => expect(s).toBe('gin')));
  expect(titles(result)).toContain('Charlie Chaplin');        // sloe gin + apricot brandy, keine Basis
  expect(titles(result)).not.toContain('Long Island Iced Tea');
});

test('there are no exclusion options any more', () => {
  expect(Object.keys(evaluate(byTitle('Clover Club'), {}))).toEqual(['strength', 'spirits', 'flavor', 'length']);
});

test('near misses miss exactly one criterion and carry a reason', () => {
  const answers = { strength: 'light', flavors: [], spirits: ['gin'], length: 'long' };
  const near = getNearMisses(recipes, answers);
  expect(near.length).toBeGreaterThan(0);
  near.forEach(({ recipe, reason }) => {
    const e = evaluate(recipe, answers);
    expect(Object.values(e).filter(c => !c.ok)).toHaveLength(1);
    expect(Math.abs(e.strength.diff)).toBeLessThanOrEqual(1);
    expect(reason).toMatch(/^(a bit stronger than you asked|a bit lighter|made with .+|served (long|short)|different flavor: .+)$/);
  });
});

test('archived recipes never appear in guide results', () => {
  // Tom Collins ist der leichteste Drink und stünde sonst ganz oben
  const list = recipes.map(r => (r.title === 'Tom Collins' ? { ...r, archived: true } : r));
  const answers = { strength: 'light', flavors: [], spirits: [] };
  expect(titles(recommend(recipes, answers))).toContain('Tom Collins');
  expect(titles(getCandidates(list, answers))).not.toContain('Tom Collins');
  expect(titles(getNearMisses(list, { ...answers, strength: 'balanced' }, 50).map(n => n.recipe))).not.toContain('Tom Collins');
});

test('every answer combination is consistent', () => {
  const subsets = (ids) => [[], ...ids.map(id => [id]), ids.slice(0, 2)];
  for (const strength of [undefined, ...STRENGTH_OPTIONS.map(o => o.id)])
    for (const flavors of subsets(FLAVOR_PROFILES.map(p => p.id)))
      for (const spirits of subsets(SPIRIT_OPTIONS.map(o => o.id)))
        for (const length of [undefined, ...LENGTH_OPTIONS.map(o => o.id)]) {
            const answers = { strength, flavors, spirits, length };
            const picks = recommend(recipes, answers);
            const near = getNearMisses(recipes, answers);
            expect(picks.length).toBeLessThanOrEqual(3);
            expect(near.length).toBeLessThanOrEqual(3);
            picks.forEach(r => expect(Object.values(evaluate(r, answers)).every(c => c.ok)).toBe(true));
            near.forEach(({ recipe }) => expect(Object.values(evaluate(recipe, answers)).filter(c => !c.ok)).toHaveLength(1));
          }
});

// Prüftabelle für den Betreiber: ABV_REPORT=1 npx vitest run -t "abv report" --silent=false
test.runIf(process.env.ABV_REPORT)('abv report', () => {
  console.table(getActiveRecipes(recipes).map(r => ({ title: r.title, abv: getAbv(r).toFixed(1), level: getStrengthLevel(r),
    flavors: (r.flavors || []).join(' '), suggested: suggestFlavors(r).join(' '), spirits: getSpirits(r).join(' ') }))
    .sort((a, b) => a.abv - b.abv));
});

test('picks are ordered by strength first', () => {
  const abvs = (answers) => recommend(recipes, { flavors: [], spirits: [], ...answers }).map(r => getAbv(r));
  const light = abvs({ strength: 'light' });
  expect(light).toEqual([...light].sort((a, b) => a - b));           // leichtester zuerst
  expect(recommend(recipes, { strength: 'light' })[0].title).toBe('Tom Collins');
  expect(recommend(recipes, { strength: 'strong' })[0].title).toBe('Vieux Carré');   // stärkster zuerst
  expect(recommend(recipes, { strength: 'balanced' })[0].title).toBe('Fog Cutter');  // 22,0 % = Mitte
});

test('flavor ranks second, after strength', () => {
  const drink = (id, gin, flavors) => ({ id, title: String(id), glassware: 'Coupe glass', flavors,
    ingredients: [{ amount: gin, unit: 'oz', ingredient: 'gin' }, { amount: 1, unit: 'oz', ingredient: 'lemon juice' }] });
  const answers = { strength: 'strong', flavors: ['sour', 'fruity'] };
  // gleiche Stärke (26,7 %): mehr Geschmackstreffer gewinnt
  expect(recommend([drink(1, 2, ['sour']), drink(2, 2, ['sour', 'fruity'])], answers).map(r => r.id)).toEqual([2, 1]);
  // stärker (30 %) schlägt mehr Geschmackstreffer, weil die Stärke zuerst zählt
  expect(recommend([drink(1, 2, ['sour', 'fruity']), drink(2, 3, ['sour'])], answers).map(r => r.id)).toEqual([2, 1]);
});

test('near misses relax flavor before strength', () => {
  // Kein Balanced-Drink ist bitter: erst Balanced-Drinks mit anderem Geschmack, dann eine Stufe stärkere bittere
  const answers = { strength: 'balanced', flavors: ['bitter'], spirits: [] };
  expect(recommend(recipes, answers)).toEqual([]);
  const near = getNearMisses(recipes, answers, 50);
  const firstStrengthMiss = near.findIndex(n => !evaluate(n.recipe, answers).strength.ok);
  expect(firstStrengthMiss).toBeGreaterThan(0);
  near.slice(0, firstStrengthMiss).forEach(n => expect(n.reason).toMatch(/^different flavor: /));
  near.slice(firstStrengthMiss).forEach(n => expect(n.reason).toBe('a bit stronger than you asked'));
});
