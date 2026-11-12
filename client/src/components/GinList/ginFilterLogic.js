// Filterwerte pro Gin, alles lowercase damit "New western" und "New Western" zusammenfallen
const tagsOf = (gin) => ({
  country: [gin.originCountry.toLowerCase()],
  type: [gin.type.toLowerCase()],
  taste: gin.mainNote.map(note => note.toLowerCase()),
});

export const CATEGORIES = ['country', 'type', 'taste'];

export const getFilterOptions = (gins) =>
  Object.fromEntries(CATEGORIES.map(cat => [cat, [...new Set(gins.flatMap(gin => tagsOf(gin)[cat]))]]));

// Innerhalb einer Kategorie ODER, zwischen Kategorien UND
export const filterGins = (gins, selected, tipsOnly) =>
  gins.filter(gin => {
    if (tipsOnly && !gin.recommendation) return false;
    const tags = tagsOf(gin);
    return CATEGORIES.every(cat => selected[cat].length === 0 || selected[cat].some(tag => tags[cat].includes(tag)));
  });
