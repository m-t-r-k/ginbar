# Cocktail Guide: echte ABV-Werte, „Das mag ich", „Auch interessant" – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Der Cocktail Guide empfiehlt Drinks anhand berechneter ABV-Werte, Geschmacks-Tags und positiver Spirituosen-Auswahl aus einer zentralen Zutatenliste und zeigt Fast-Treffer unter „Also interesting".

**Architecture:** Eine neue Datei `ingredients.json` hält pro Zutat ABV, optionale Basisspirituose und Geschmacks-Tags. `cocktailLogic.js` liest sie über eine case-insensitive Suche mit Regex-Fallback, berechnet ABV/Stärke/Geschmack daraus und bewertet jeden Drink pro Kriterium (`evaluate`). Darauf bauen Hauptempfehlung (alles ok) und Fast-Treffer (genau ein Kriterium daneben) auf. Dev-Server und Editor bekommen Lesen/Schreiben der Zutatenliste, eine Pflichtprüfung beim Speichern und ein Archiv-Flag.

**Tech Stack:** React 18 + Vite 8, Vitest 5 (`globals: true`, `environment: 'node'`), Express-Dev-Server (CommonJS) in `server/`.

**Spec:** `docs/superpowers/specs/2026-11-13-cocktail-guide-abv-design.md`

## Global Constraints

- Branch `feature/cocktail-guide-abv`. **Nicht auf `main` pushen**: ein Push auf main deployt live über Netlify. (Die „Offene Rahmenbedingung" der Spec zu `m-t-r-k/ginbar` gilt hier nicht, das lokale Repo ist beschreibbar.)
- Keine neuen Dependencies.
- UI-Texte auf Englisch, Code-Kommentare wie im Bestand auf Deutsch.
- Alle ABV-Werte unverdünnt, ohne Eisverdünnung.
- `ABV = Σ(Menge_in_oz × abv) / Σ(Menge_in_oz)`. Einheiten wie bisher: `oz: 1, teaspoon: 1/6, dashes: 1/32, drops: 1/160`. `''`, `slices`, `leaves`, `sprig` zählen als 0 Volumen.
- Stärkestufen: Light `< 18`, Balanced `18 bis < 26`, Spirit-forward `≥ 26` (Prozent).
- Spirituosen-IDs: `gin`, `rum`, `whiskey`, `brandy`, `tequila`, `vodka`. Geschmacks-Tags: `sour`, `fruity`, `herbal`, `bitter`, `sweet`.
- Zutaten-Abgleich überall **case-insensitive und getrimmt** (Client, Tests, Server).
- Archivierte Rezepte (`"archived": true`) erscheinen weder im Bar-Menü noch im Guide.
- Ein Gast mit „No egg white"/„No coffee" sieht nie einen solchen Drink, auch nicht unter „Also interesting".
- Testbefehl: `npm test` in `client/`.

**Ergänzung zur Spec (mit Betreiber besprochen 2026-11-13): Auffüller-Flag.** Zutaten, mit denen aufgefüllt wird, bekommen in `ingredients.json` den Eintrag `"filler": true`. Das betrifft `soda water`, `cola`, `ginger beer` und `tonic water`.
- **ABV:** Auffüller zählen voll mit.
- **Geschmacksanteil (`sour`):** Das Volumen der Auffüller zählt nicht mit. Gemessen wird der Drink vor dem Auffüllen.
- **Filterleiste:** Auffüller erscheinen dort nicht als Chips, die Filterleiste bleibt also unverändert.
- **Rezeptkarten und Detailansicht:** Auffüller stehen dort mit Menge.

Die Sour-Schwelle sinkt auf **14 %** (Betreiber, 2026-11-13):
- Tom Collins (23,5 %), Dark & Stormy (24,8 %), Fog Cutter und Long Island (je 14,8 %) zählen als sour.
- Boston Cocktail (13,3 %) zählt nicht als sour. Fog Cutter und Long Island haben exakt denselben Anteil und lassen sich über die Schwelle nicht trennen.

Die Auffüller-Mengen sind Schätzwerte und wirken nur noch auf den ABV:
- Tom Collins bleibt mit 2 bis 4 oz Soda Light.
- Long Island bleibt mit 1 bis 2 oz Cola Balanced.

## Review Focus

1. **Groß-/Kleinschreibung und Leerzeichen** im Zutatennamen („Gin ", „green chartreuse") müssen den Eintrag treffen, nicht den Regex-Fallback. Test in Task 1.
2. **Drink ohne messbares Volumen** (nur Stückzutaten) liefert `getAbv` = `0`, nicht `NaN`. Test in Task 1.
3. **Harte Filter lassen 0 Drinks übrig.** Der Guide springt zu den Ergebnissen, zeigt Fast-Treffer oder den Leer-Hinweis und stürzt nicht ab. Test der Antwortkombinationen in Task 2.
4. **Fast-Treffer mit zwei Fehlern** (z. B. zwei Stärkestufen daneben, oder falsche Spirituose *und* falsche Länge) dürfen nicht erscheinen. Test in Task 2.
5. **Editor: neue Zutat, die sich nur in der Schreibweise unterscheidet** („Gin" vs. „gin"), gilt als bekannt und legt keinen Doppel-Eintrag an. Der Server prüft genauso normalisiert. Manueller Check in Task 5, Server-Check in Task 4.

---

### Task 1: Zutatenliste, ABV-Berechnung, Auffüller, Archiv-Flag

**Files:**
- Create: `client/src/data/ingredients.json`
- Modify: `client/src/data/cocktail-recipes.json` (Tom Collins id 34, Long Island Iced Tea id 6, Cucumber Rose Cooler, Espresso Tonic)
- Modify: `client/src/components/BarMenuList/cocktailLogic.js`
- Test: `client/src/components/BarMenuList/cocktailLogic.test.js`

**Interfaces:**
- Produces:
  - `SPIRITS: string[]` (die sechs IDs), `FLAVOR_TAGS: string[]` (die fünf Tags)
  - `normalizeName(name: string) => string` (trim + lowercase)
  - `findIngredient(name: string, ingredients: object) => entry | undefined` (normalisierter Abgleich gegen beliebige Liste, auch für den Editor)
  - `estimateIngredient(name: string) => { abv: number, spirit?: string, flavors: string[] }` (Regex-Fallback, auch Vorbelegung im Editor)
  - `getIngredient(name: string) => entry` (= `findIngredient(name, INGREDIENTS) ?? estimateIngredient(name)`)
  - `toOz(ing) => number`, `getAbv(recipe) => number` (Prozent, 0–100)
  - `getActiveRecipes(recipes) => recipes` (ohne `archived`)
  - Eintragsform: `{ "abv": number, "spirit"?: SpiritId, "flavors": FlavorTag[], "filler"?: true }`
  - `isFiller(name: string) => boolean` (`getIngredient(name).filler === true`)

- [ ] **Step 0: Branch anlegen**

Run: `git checkout -b feature/cocktail-guide-abv`

- [ ] **Step 1: Failing Tests schreiben** (in `cocktailLogic.test.js` ergänzen, bestehende Tests bleiben vorerst)

```js
import ingredients from '../../data/ingredients.json';
// + getAbv, getIngredient, findIngredient, getActiveRecipes, normalizeName aus './cocktailLogic'

test('ABV comes from the ingredient list', () => {
  expect(getIngredient('Green Chartreuse').abv).toBe(55);
  expect(getIngredient('  green chartreuse ').abv).toBe(55);   // Review Focus 1
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
  expect(getAbv({ ingredients: [{ amount: 1, unit: '', ingredient: 'lemon twist' }] })).toBe(0);  // Review Focus 2
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
```

- [ ] **Step 2: Tests laufen lassen, sie schlagen fehl**

Run: `cd client && npm test`
Expected: FAIL (Import von `ingredients.json` bzw. `getAbv` fehlt)

- [ ] **Step 3: Rezeptdaten ergänzen**

- Tom Collins: `{ "amount": 3, "unit": "oz", "ingredient": "soda water" }`
- Long Island Iced Tea: `{ "amount": 1.5, "unit": "oz", "ingredient": "cola" }`
- Cucumber Rose Cooler und Espresso Tonic: `"archived": true`
- Weitere Auffüller-Fundstellen gibt es nicht: Die Suche nach `top|soda|cola|fill|ginger beer|tonic` trifft nur Tom Collins, Long Island und das archivierte Cucumber Rose Cooler. Dark & Stormy führt Ginger Beer bereits als Zutat.

- [ ] **Step 4: `ingredients.json` anlegen**

67 Einträge: die 65 heutigen Zutaten plus `soda water` und `cola`. Schlüssel genau wie im Rezept geschrieben. Feste Werte aus der Spec: `gin` 40/gin, `adamus dry gin` 44/gin, `sloe gin` 26 ohne spirit `["fruity"]`, `Green Chartreuse` 55 `["herbal"]`, `Yellow Chartreuse` 40, `dry vermouth` 18 `["bitter"]`, `lemon juice`/`lime juice` 0 `["sour"]`, `raspberry syrup` 0 `["fruity"]`, `soda water` 0 `[]`. `"filler": true` bekommen genau `soda water`, `cola`, `ginger beer`, `tonic water`. `spirit` bekommen nur Basisspirituosen: die vier Gins, `light/dark/spiced rum`, `bourbon`/`rye whiskey` → `whiskey`, `brandy`, `tequila`, `vodka`. `apricot brandy`, `sloe gin` und `rosmary geist` bekommen **kein** `spirit`. Simple Syrup, Garnituren und Basisspirituosen bekommen `flavors: []`. Die übrigen Tags folgen der Tabelle in Spec-Abschnitt 4.

- [ ] **Step 5: Logik umbauen in `cocktailLogic.js`**

- `import INGREDIENTS from '../../data/ingredients.json'`, dazu eine einmal gebaute `Map` mit normalisierten Schlüsseln für `getIngredient`. `findIngredient` baut für fremde Listen (Editor) keine Map, sondern nutzt `Object.keys(...).find`.
- `estimateIngredient`: ABV aus der bisherigen Gruppenlogik ×100 (Spirits 40, Wein-artig 17, Likör 25, sonst 0). `spirit` aus den bisherigen Spirituosen-Regexen in `AVOID_OPTIONS`, nur innerhalb der Gruppe Spirits. Tags aus den bisherigen `FLAVOR_PROFILES`-Regexen plus `sour: /lemon juice|lime juice/i`. Die Regexe bleiben **nur** hier.
- `getAbv` ersetzt `estimateAbv` (Prozent statt Anteil) und nutzt `getIngredient(...).abv`. Alle Aufrufer von `estimateAbv` werden auf `getAbv` umgestellt. Die relativen Drittel-Schwellen funktionieren mit Prozentwerten genauso.

- [ ] **Step 6: Tests laufen lassen**

Run: `cd client && npm test`
Expected: PASS (neue Tests und bestehende)

- [ ] **Step 7: Commit**

```bash
git add client/src/data client/src/components/BarMenuList
git commit -m "Add central ingredient list with ABV, fillers and archive flag"
```

---

### Task 2: Guide-Logik: feste Stufen, Tags, Spirituosen, evaluate, Fast-Treffer

**Files:**
- Modify: `client/src/components/BarMenuList/cocktailLogic.js`
- Modify: `client/src/components/BarMenuList/BarMenuList.jsx` (Non-alc-Switch, `isNonAlcoholic`, `react-switch`-Import raus, `data` über `getActiveRecipes`)
- Test: `client/src/components/BarMenuList/cocktailLogic.test.js` (die drei alten Tests ersetzen)

**Interfaces:**
- Consumes: `getIngredient`, `getAbv`, `toOz`, `getActiveRecipes` aus Task 1
- Produces:
  - `STRENGTH_LEVELS = { light: 18, balanced: 26 }` (Obergrenzen, exklusiv), `STRENGTH_OPTIONS` (light/balanced/strong, Labels und Hints wie heute, ohne `nonalc`)
  - `getStrengthLevel(recipe) => 'light' | 'balanced' | 'strong'`
  - `FLAVOR_PROFILES = [{ id, label }]` mit den Labels `Fresh & Sour`, `Fruity`, `Herbal & Floral`, `Bitter & Aromatic`, `Sweet & Creamy`, Reihenfolge wie die Spec-Tabelle
  - `FLAVOR_MIN_SHARE = { sour: 0.14 }` (Tags ohne Eintrag zählen ab einem Treffer)
  - `getFlavorMatches(recipe, tag) => string[]` (Zutatennamen. Bei Tags mit Mindestanteil `[]`, solange der Volumenanteil der getaggten Zutaten unter der Schwelle liegt. **Nenner = Volumen ohne Auffüller**)
  - `SPIRIT_OPTIONS = [{ id, label }]` (die sechs, Label = ID), `EXCLUDE_OPTIONS = [{ id: 'egg', label: 'No egg white' }, { id: 'coffee', label: 'No coffee' }]` (Abgleich per Regex auf den Namen wie bisher: `/egg white/i`, `/coffee|espresso/i`)
  - `getSpirits(recipe) => string[]` (eindeutige `spirit`-Werte)
  - `LENGTH_OPTIONS` unverändert
  - answers: `{ strength?, flavors: [], spirits: [], exclude: [], length? }`
  - `evaluate(recipe, answers) => { strength: { ok, actual, diff }, spirits: { ok, disliked: string[] }, flavor: { ok, matches: string[] }, excluded: { ok, hits: string[] }, length: { ok, actual: 'short' | 'long' } }`. `diff` = Stufenindex(actual) − Stufenindex(gewählt), ohne Antwort `0`. Nicht beantwortet → `ok: true`.
  - `getCandidates(recipes, answers) => recipes` (aktiv, alle Kriterien ok, Eingabereihenfolge)
  - `recommend(recipes, answers, count = 3) => recipes` (Kandidaten nach Score)
  - `getNearMisses(recipes, answers, count = 3) => [{ recipe, reason: string }]`
- Entfällt: `isNonAlcoholic`, `estimateAbv`, `AVOID_OPTIONS`, `narrow`, `strengthThresholds`, `abvFactor`, `scoreRecipe` in alter Form. `INGREDIENT_GROUPS`, `getIngredientGroup`, `getFilterLabel` bleiben für die Filterleiste.

- [ ] **Step 1: Failing Tests schreiben** (die drei alten Tests löschen)

```js
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
    expect(Math.abs(e.strength.diff)).toBeLessThanOrEqual(1);   // Review Focus 4
    expect(reason).toMatch(/^(a bit stronger than you asked|a bit lighter|made with .+|served (long|short))$/);
  });
});

test('archived recipes never appear in guide results', () => {
  const answers = { flavors: ['herbal'], spirits: [], exclude: [] };
  expect(titles(getCandidates(recipes, answers))).not.toContain('Cucumber Rose Cooler');
  expect(titles(getNearMisses(recipes, answers).map(n => n.recipe))).not.toContain('Espresso Tonic');
});

test('every answer combination is consistent', () => {   // Review Focus 3
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

// Prüftabelle für den Betreiber: ABV_REPORT=1 npx vitest run -t "abv report"
test.runIf(process.env.ABV_REPORT)('abv report', () => {
  console.table(getActiveRecipes(recipes).map(r => ({ title: r.title, abv: getAbv(r).toFixed(1), level: getStrengthLevel(r),
    flavors: FLAVOR_PROFILES.map(p => p.id).filter(t => getFlavorMatches(r, t).length).join(' '), spirits: getSpirits(r).join(' ') }))
    .sort((a, b) => a.abv - b.abv));
});
```

- [ ] **Step 2: Tests laufen lassen, sie schlagen fehl**

Run: `cd client && npm test`
Expected: FAIL (`evaluate`, `getNearMisses`, `SPIRIT_OPTIONS` … nicht definiert)

- [ ] **Step 3: Logik implementieren** mit den Signaturen aus dem Interfaces-Block

- Score = Σ über gewählte Profile `Math.min(getFlavorMatches(r, tag).length, 2)`. Stabil sortieren, bei Gleichstand bleibt die Eingabereihenfolge (der Guide mischt vorher).
- `getCandidates` filtert `getActiveRecipes(recipes)` hart. Kein `narrow`-Fallback mehr.
- `getNearMisses` nimmt aktive Rezepte mit `excluded.ok && flavor.ok`, bei denen von `strength`/`spirits`/`length` genau eines nicht ok ist und `|strength.diff| ≤ 1`. Danach nach Score sortieren, auf `count` kürzen. Gründe:
  - `diff > 0` → `'a bit stronger than you asked'`, `diff < 0` → `'a bit lighter'`
  - Spirituose → `` `made with ${disliked.join(' & ')}` ``
  - Länge → `'served long'` / `'served short'` (je nach `length.actual`)

- [ ] **Step 4: `BarMenuList.jsx` anpassen**

`nonAlcoholicOnly`-State, den `toggleSwitch`-Block, den `Switch`-Import und `isNonAlcoholic` entfernen. `data` = `getActiveRecipes(RecipesData)`, danach wie bisher sortiert. `extractUniqueIngredients` überspringt Auffüller (`isFiller`). Dadurch tauchen „soda water" und „cola" nicht als Chips auf. Der heutige Chip „ginger beer" fällt dabei ebenfalls weg. Tonic water betrifft nur archivierte Rezepte. Das Paket `react-switch` bleibt in `package.json` (Nicht-Ziel).

- [ ] **Step 5: Tests laufen lassen**

Run: `cd client && npm test`
Expected: PASS

- [ ] **Step 6: Prüftabelle erzeugen** und ins Abschluss-Reporting übernehmen (für die Kalibrierung mit dem Betreiber)

Run: `cd client && ABV_REPORT=1 npx vitest run -t "abv report"`
Expected: Tabelle mit 33 Drinks (ABV, Stufe, Tags, Spirituosen)

- [ ] **Step 7: Commit**

```bash
git add client/src/components/BarMenuList
git commit -m "Rework cocktail guide logic: fixed ABV bands, flavor tags, liked spirits, near misses"
```

---

### Task 3: Guide-UI

**Files:**
- Modify: `client/src/components/CocktailGuide/CocktailGuide.jsx`
- Modify: `client/src/components/CocktailGuide/CocktailGuide.scss`

**Interfaces:**
- Consumes: `STRENGTH_OPTIONS`, `FLAVOR_PROFILES`, `SPIRIT_OPTIONS`, `EXCLUDE_OPTIONS`, `LENGTH_OPTIONS`, `getCandidates`, `recommend`, `getNearMisses` aus Task 2

- [ ] **Step 1: Schritte umbauen**

- `EMPTY_ANSWERS = { flavors: [], spirits: [], exclude: [] }`
- Schritt 3: `{ key: 'spirits', type: 'multi', question: 'Which spirits do you like?', hint: 'Pick none if you like them all.', options: SPIRIT_OPTIONS, extra: { key: 'exclude', options: EXCLUDE_OPTIONS } }`. Die `extra`-Chips stehen unter den Spirituosen im selben `fieldset` und werden über dasselbe Toggle mit `answers[extra.key]` umgeschaltet. `toggleMulti(key, id)` bekommt dafür den Key als Parameter.
- Die Sonderbedingung `nextAnswers.strength === 'nonalc'` in `advance` entfällt.

- [ ] **Step 2: Ergebnisansicht**

- Picks vorhanden: Überschrift „Our picks for you" + Karten wie bisher.
- Keine Picks: Überschrift „No perfect match – but you might like these".
- Darunter, falls Fast-Treffer vorhanden: Block „Also interesting" (Überschrift nur bei vorhandenen Picks) mit `result_card`s, die zusätzlich `reason` in einem `span.result_reason` zeigen.
- Beides leer: `<p className="guide_hint">Nothing fits all your answers – try fewer restrictions.</p>`. „Start over" steht bereits im Footer.
- Styling: `.guide_also` mit Abstand nach oben und gedämpfter Überschrift, `.result_reason` kursiv in `$medium-grey`, im bestehenden Look.

- [ ] **Step 3: Manuell prüfen**

Run: `cd client && npm start`, `/bar-menu/` öffnen, Guide starten.
Expected:
- (a) Light → (keine Geschmäcker) → nur Gin → long: Ergebnisse mit Gründen.
- (b) „No egg white" + Sweet & Creamy: kein Eiweiß-Drink in keiner Liste.
- (c) Eine Kombination mit 0 Picks zeigt „No perfect match …".
- (d) Der Non-alc-Schalter in der Filterleiste ist weg.
- (e) Console ohne Fehler.

- [ ] **Step 4: Tests + Commit**

Run: `cd client && npm test` → PASS

```bash
git add client/src/components/CocktailGuide
git commit -m "Cocktail guide: liked spirits step and 'also interesting' results"
```

---

### Task 4: Dev-Server: Zutaten-API und Pflichtprüfung

**Files:**
- Modify: `server/dev-server.js`

**Interfaces:**
- Produces:
  - `GET /api/dev/ingredients` → komplettes Objekt aus `client/src/data/ingredients.json`
  - `PUT /api/dev/ingredients` (Body = komplettes Objekt) → `400 { error }` bei ungültigem Eintrag, sonst gespeichertes Objekt (`JSON.stringify(data, null, 2)` wie bei den Rezepten)
  - Rezept-POST/PUT → `400 { error: 'Unknown ingredient: <name>' }`, wenn ein nicht archiviertes Rezept eine Zutat ohne Eintrag nutzt

- [ ] **Step 1: Implementieren**

- `readJson(path)` / `writeJson(path, data)` ersetzen `readData`/`writeData` für beide Dateien.
- `SPIRITS` und `FLAVOR_TAGS` als Konstanten duplizieren (der Server ist CommonJS und eigenständig, ein gemeinsames Modul wäre mehr Aufwand als zwei Zeilen).
- `validateIngredients(obj, recipes)`: Jeder Eintrag hat eine `abv` als Zahl `0–100`, `flavors` als Array aus erlaubten Tags, `spirit` fehlt oder ist erlaubt, und `filler` fehlt oder ist `true`. Kein normalisierter Schlüssel doppelt (Review Focus 5). Jede Zutat aktiver Rezepte behält ihren Eintrag.
- `validateRecipeServer`: Bei `!recipe.archived` muss jede Zutat normalisiert einen Eintrag haben. `archived` muss, falls gesetzt, boolean sein.

- [ ] **Step 2: Mit curl prüfen** (Server: `npm run start:server` im Repo-Root)

```bash
curl -s localhost:3001/api/dev/ingredients | head -c 200                     # JSON mit "gin"
curl -s -X POST localhost:3001/api/dev/recipes -H 'Content-Type: application/json' \
  -d '{"title":"X","instructions":"x","ingredients":[{"amount":1,"unit":"oz","ingredient":"unobtainium"}]}'
# → {"error":"Unknown ingredient: unobtainium"}
curl -s -X PUT localhost:3001/api/dev/ingredients -H 'Content-Type: application/json' -d '{"gin":{"abv":"x","flavors":[]}}'
# → 400 mit Fehlermeldung, ingredients.json unverändert (git diff leer)
```

- [ ] **Step 3: Commit**

```bash
git add server/dev-server.js
git commit -m "Dev server: ingredients API and required ingredient entries"
```

---

### Task 5: Editor: Zutatenfelder, Archiv, Reiter „Ingredients"

**Files:**
- Modify: `client/src/components/Pages/EditRecipes/EditRecipes.jsx`
- Modify: `client/src/components/Pages/EditRecipes/EditRecipes.scss`

**Interfaces:**
- Consumes: `findIngredient`, `estimateIngredient`, `normalizeName`, `SPIRITS`, `FLAVOR_TAGS` (Task 1), die API aus Task 4

- [ ] **Step 1: Zutaten laden und Hinweise anzeigen**

- `ingredients` per `GET /api/dev/ingredients` zusammen mit den Rezepten laden.
- Zeile mit bekannter Zutat (`findIngredient`): kleiner Hinweis, z. B. `40% · gin · herbal`.
- Zeile mit unbekannter, nicht leerer Zutat: darunter ABV (number), Spirituose (`<select>` mit leerer Option + `SPIRITS`), fünf Tag-Chips, Checkbox „Filler (topped up)". Die Ingredients-Tabelle in Step 3 bekommt dieselbe Checkbox. Vorbelegt mit `estimateIngredient(name)`. Der Zwischenstand liegt im State `pending: { [normalizeName(name)]: entry }`.

- [ ] **Step 2: Speichern**

- Pflicht: Ist das Rezept nicht archiviert, braucht jede unbekannte Zutat eine gültige Zahl als ABV. Sonst Fehlermeldung und kein Request.
- Gibt es neue Einträge: zuerst `PUT /api/dev/ingredients` mit `{ ...ingredients, [trimmedName]: entry }`, danach das Rezept. Bei einem Fehler im ersten Request wird das Rezept nicht gesendet.
- `archived` gehört zum Formular (Checkbox „Archived"), `handleEdit` übernimmt es, der Payload sendet es nur bei `true`.

- [ ] **Step 3: Liste und Reiter**

- Rezeptliste: archivierte Einträge bekommen `className="archived"` (`opacity: .5`).
- Tabs „Recipes" / „Ingredients" (State `tab`). Die Ingredients-Tabelle zeigt Name, ABV, Spirituose, Tags (editierbar) und die Anzahl Rezepte, die die Zutat nutzen (normalisiert gezählt, alle Rezepte). „Delete" ist bei Anzahl > 0 deaktiviert. „Save" macht `PUT` des ganzen Objekts. Kein Umbenennen.

- [ ] **Step 4: Manuell prüfen** (`npm start` im Root, `/dev-edit-recipes/`)

Expected:
- (a) Neues Rezept mit „Unobtainium" zeigt vorbelegte Felder. Nach dem Speichern stehen Eintrag und Rezept in den JSON-Dateien.
- (b) „GIN" zeigt den Hinweis von `gin` und legt keinen neuen Eintrag an.
- (c) Espresso Tonic bearbeiten und speichern: `"archived": true` bleibt erhalten.
- (d) Im Reiter ist „Delete" bei `gin` deaktiviert. Ein neu angelegter ungenutzter Eintrag lässt sich löschen.
- (e) Danach `cd client && npm test`: PASS. Testeinträge vor dem Commit wieder entfernen (`git diff client/src/data` leer).

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Pages/EditRecipes
git commit -m "Recipe editor: ingredient entries, archive toggle, ingredients tab"
```

---

### Abschluss

- [ ] `cd client && npm test && npm run build`: beides erfolgreich.
- [ ] Prüftabelle aus Task 2 Step 6 und die Zutatenliste (Name · ABV · Spirituose · Tags) dem Betreiber vorlegen. Die Stufengrenzen und die Sour-Schwelle werden einmal gemeinsam kalibriert.
- [ ] Branch nicht pushen, bevor der Betreiber zugestimmt hat.

---

### Nachtrag (2026-11-13, nach Durchklicken): Geschmack am Rezept

Mit den Zutaten-Tags hatten Drinks im Schnitt 2,2 Geschmäcker, „Fresh & Sour" passte auf 22 von 33 Drinks. Das Ergebnis wirkte dadurch beliebig. Entscheidung des Betreibers:
- Jedes aktive Rezept hat `"flavors"` mit **1–2 Primärgeschmäckern**, den intensivsten. Der Guide filtert und bewertet nur danach.
- Die Zutaten-Tags dienen nur noch als Vorschlag: `suggestFlavors(recipe)` gewichtet die Tags nach Volumen und nimmt die zwei stärksten. Im Editor gibt es dafür den Button „Suggest from ingredients".
- `getFlavorMatches` und `FLAVOR_MIN_SHARE` (Sour-Schwelle) entfallen.
- Server und Editor verlangen 1–2 gültige Geschmäcker für aktive Rezepte.
- Erstbelegung durch den Builder: sour 15, fruity 11, herbal 10, bitter 9, sweet 4 (im Schnitt 1,5 pro Drink). Der Betreiber prüft.
