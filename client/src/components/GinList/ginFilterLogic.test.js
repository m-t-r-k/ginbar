import { getFilterOptions, filterGins } from './ginFilterLogic';

const gins = [
  { id: 'a', originCountry: 'Deutschland', type: 'New Western Dry Gin', mainNote: ['Zitrus', 'herb'], recommendation: true },
  { id: 'b', originCountry: 'Spanien', type: 'New western Dry Gin', mainNote: ['fruchtig'], recommendation: false },
  { id: 'c', originCountry: 'Deutschland', type: 'London Dry Gin', mainNote: ['fruchtig'], recommendation: false },
];
const none = { country: [], type: [], taste: [] };
const ids = (list) => list.map(g => g.id);

test('options are unique and lowercase', () => {
  expect(getFilterOptions(gins)).toEqual({
    country: ['deutschland', 'spanien'],
    type: ['new western dry gin', 'london dry gin'],
    taste: ['zitrus', 'herb', 'fruchtig'],
  });
});

test('no selection returns all gins', () => {
  expect(ids(filterGins(gins, none, false))).toEqual(['a', 'b', 'c']);
});

test('OR within a category', () => {
  expect(ids(filterGins(gins, { ...none, country: ['spanien', 'deutschland'] }, false))).toEqual(['a', 'b', 'c']);
});

test('AND between categories', () => {
  expect(ids(filterGins(gins, { ...none, country: ['deutschland'], taste: ['fruchtig'] }, false))).toEqual(['c']);
});

test('tips only keeps recommendations', () => {
  expect(ids(filterGins(gins, none, true))).toEqual(['a']);
});
