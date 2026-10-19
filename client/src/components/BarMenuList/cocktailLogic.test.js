import recipes from '../../data/cocktail-recipes.json';
import {
  STRENGTH_OPTIONS, FLAVOR_PROFILES, AVOID_OPTIONS, LENGTH_OPTIONS,
  getCandidates, getStrengthLevel, getFilterLabel, recommend
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
