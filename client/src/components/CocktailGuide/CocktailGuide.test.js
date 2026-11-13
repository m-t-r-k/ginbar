import recipes from '../../data/cocktail-recipes.json';
import { getCandidates } from '../BarMenuList/cocktailLogic';
import { STEPS, clearStep } from './CocktailGuide';

const stepFor = (key) => STEPS.find(s => s.key === key);

test('going back clears the answers of the step you leave', () => {
  const answers = { strength: 'light', flavors: ['sour'], spirits: ['gin'], exclude: ['egg'], length: 'long' };
  expect(clearStep(answers, stepFor('length'))).toEqual({ ...answers, length: undefined });
  expect(clearStep(answers, stepFor('spirits'))).toEqual({ ...answers, spirits: [], exclude: [] });
});

test('a stale length answer no longer filters after going back', () => {
  // Nur 4 aktive Drinks sind "long" – ohne Zurücksetzen springt der Guide nach einer neuen Stärke sofort zu den Ergebnissen
  let answers = { strength: 'balanced', flavors: [], spirits: [], exclude: [], length: 'long' };
  for (const key of ['length', 'spirits', 'flavors']) answers = clearStep(answers, stepFor(key));
  expect(getCandidates(recipes, { ...answers, strength: 'strong' }).length).toBeGreaterThan(3);
});
