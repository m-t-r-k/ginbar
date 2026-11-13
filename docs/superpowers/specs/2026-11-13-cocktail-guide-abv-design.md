# Cocktail Guide: Stärke über echte ABV-Werte, „Das mag ich", „Auch interessant"

Stand: 2026-11-13 · Status: Entwurf zur Freigabe

## Warum

Der Cocktail Guide auf `/bar-menu/` soll Drinks empfehlen, die wirklich zu den Antworten passen. Heute klappt das bei der Stärke nicht:

- `estimateAbv` rät über Regex-Gruppen (Spirit = 40 %, Likör = 25 %, Wein-artig = 17 %). Green Chartreuse (55 %) zählt wie ein 25-%-Likör.
- Auffüller (Soda, Cola) stehen nur im Anleitungstext, nicht in den Zutaten. Tom Collins wird dadurch als „Balanced" eingestuft, stärker als ein Clover Club.
- Die Stufen Light/Balanced/Spirit-forward sind Drittel der Rezepte. Es landet immer ein Drittel in „Light", egal wie stark die Drinks sind.
- „Avoid" fragt negativ ab, der Gast denkt aber eher in „was mag ich".

## Ziele

1. Jede Zutat bekommt **einmal zentral** einen Alkoholwert. Der ABV eines Drinks wird daraus berechnet.
2. Stärkestufen sind **feste ABV-Bereiche**, keine Gleichverteilung.
3. „Avoid" bei den Spirituosen wird zu **„Das mag ich"** (positive Auswahl, harter Filter).
4. „Ohne Eiweiß" / „Ohne Kaffee" bleiben als Ausschluss erhalten.
5. **Geschmack** kommt ebenfalls aus der Zutatenliste (Tags pro Zutat) statt aus Regex, mit fünf Richtungen.
6. Die Logik bewertet jeden Drink **pro Kriterium** (passt / passt nicht und warum). Darauf baut ein Block **„Auch interessant"** mit Fast-Treffern auf.
7. **Alkoholfreie Drinks fliegen raus:** Der Non-alc-Filter im Bar-Menü und die Stufe „Non-alc" im Guide entfallen. Die beiden alkoholfreien Rezepte (Cucumber Rose Cooler, Espresso Tonic) werden archiviert.

## Nicht-Ziele (jetzt)

- **Verdünnung durch Eis** wird ignoriert. Alle ABV-Werte sind unverdünnt. *(entschieden)*
- **Ausgegraute Optionen** im Guide gibt es nicht. *(entschieden)*
- Die Filterleiste des Bar-Menüs (`BarMenuList`: Gruppen, `getFilterLabel`) bleibt unverändert, bis auf den entfernten Non-alc-Filter.

## Anti-Ziele

- Der ABV muss nicht pro Rezept-Zutat gepflegt werden. Doppelte Pflege ist genau das, was vermieden werden soll.
- Ein Gast, der „ohne Eiweiß" wählt, bekommt **nie** einen Eiweiß-Drink gezeigt, auch nicht unter „Auch interessant".
- Ein Gast, der Spirituosen gewählt hat, bekommt in der Hauptempfehlung keinen Drink mit einer anderen Spirituose.

## Ansätze (betrachtet)

| | Ansatz | Trade-off |
|---|---|---|
| **A** ✅ | Zentrale Zutatenliste `ingredients.json`: jede Zutat einmal mit ABV (+ Spirituosen-Kategorie) | Einmal pflegen, konsistent, später um Geschmack erweiterbar. Neue Zutaten brauchen einen Eintrag. |
| B | `abv` an jeder Rezept-Zutat | Einfach, Sonderfälle trivial. Aber viel Wiederholung, Werte laufen auseinander. |
| C | Feinere Regex-Tabelle „Stichwort → ABV" | Am wenigsten Arbeit. Neue Zutaten werden weiter geraten. |

**Gewählt: A.** Sonderfälle (z. B. Navy-Strength-Gin) bekommen einen eigenen Eintrag in der Liste.

## Design

### 1. Zutatenliste `client/src/data/ingredients.json`

Schlüssel = Zutatenname genau wie in den Rezepten. Der Abgleich erfolgt **case-insensitive, getrimmt**.

```json
{
  "gin":               { "abv": 40, "spirit": "gin", "flavors": [] },
  "adamus dry gin":    { "abv": 44, "spirit": "gin", "flavors": [] },
  "sloe gin":          { "abv": 26, "flavors": ["fruity"] },
  "Green Chartreuse":  { "abv": 55, "flavors": ["herbal"] },
  "dry vermouth":      { "abv": 18, "flavors": ["bitter"] },
  "lemon juice":       { "abv": 0,  "flavors": ["sour"] },
  "raspberry syrup":   { "abv": 0,  "flavors": ["fruity"] },
  "soda water":        { "abv": 0,  "flavors": [] }
}
```

- `abv`: Prozent, Pflichtfeld. Alkoholfreie Zutaten haben explizit `0`.
- `flavors`: Pflichtfeld, darf leer sein. Erlaubte Tags siehe Abschnitt 4 (Geschmack).
- `spirit` *(optional)*: Basisspirituose für „Das mag ich". Werte: `gin`, `rum`, `whiskey`, `brandy`, `tequila`, `vodka`. Liköre wie Sloe Gin oder Apricot Brandy haben **kein** `spirit`, damit sie nicht als Gin/Brandy zählen. Damit fällt die Regex-Sonderbehandlung dafür weg.
- Erstbefüllung: alle 65 heute verwendeten Zutaten, mit realistischen Durchschnittswerten (Gin 40, Chartreuse grün 55 / gelb 40, Wermut 16–18, Triple Sec 30–40 usw.). Die Werte schlägt der Builder vor, der Betreiber kontrolliert sie.
- **Wer kategorisiert:** Die Erstbefüllung der 65 Zutaten macht der Builder und legt dem Betreiber eine Prüftabelle vor (Zutat · ABV · Spirituose · Tags, dazu die resultierende Einstufung jedes Drinks). Neue Zutaten pflegt der Betreiber im Editor (siehe 5).
- **Unbekannte Zutat zur Laufzeit** (darf nicht vorkommen, der Test in 6 verhindert es): ABV und Tags werden per Regex-Fallback geschätzt, damit die Seite nicht bricht. Die bisherigen Regex-Regeln bleiben nur für diesen Fallback und die Vorbelegung im Editor erhalten.

### 2. Rezeptdaten: Auffüller als echte Zutat

Auffüller kommen als normale Zutat mit geschätzter Menge in die Rezepte. Ein Standardwert je Glas entfällt, weil er z. B. beim Long Island Iced Tea danebenliegt. *(meine Entscheidung nach Diskussion)*

Konkret zu ergänzen (Mengen = Vorschlag, Betreiber prüft):
- Tom Collins: `soda water` ≈ 3 oz
- Long Island Iced Tea: `cola` 1,5 oz *(1–2 oz laut Betreiber)*

Der Builder durchsucht alle Anleitungen nach „top", „soda", „cola", „fill" usw. und listet weitere Fundstellen zur Prüfung auf.

### 3. ABV-Berechnung

`ABV = Σ(Menge_in_oz × abv) / Σ(Menge_in_oz)`. Umrechnung wie bisher (`oz`, `teaspoon`, `dashes`, `drops`). Stückzutaten (`''`, `slices`, `leaves`, `sprig`) zählen 0 Volumen. Keine Verdünnung.

`isNonAlcoholic` und der Non-alc-Filter (`nonAlcoholicOnly` in `BarMenuList`) werden entfernt.

### 3a. Archivieren von Rezepten

- Rezepte bekommen ein optionales Feld `"archived": true`. Archivierte Rezepte erscheinen **weder im Bar-Menü noch im Guide** und zählen nicht zur Datenbasis des Guides. Sie bleiben in `cocktail-recipes.json` erhalten. *(meine Entscheidung: Flag statt Löschen, damit sie reaktivierbar bleiben)*
- Cucumber Rose Cooler und Espresso Tonic werden archiviert.
- Im Editor erscheinen archivierte Rezepte ausgegraut in der Liste, mit Schalter „Archived". So lassen sich Rezepte archivieren und wieder reaktivieren.
- Archivierte Rezepte dürfen Zutaten nutzen, die in der Zutatenliste fehlen. Der Pflicht-Test aus 6 prüft nur aktive Rezepte.

### 4. Guide-Logik (`cocktailLogic.js`)

**Stärkestufen = feste Bereiche** (Konstanten, später nachjustierbar):

| Stufe | ABV (unverdünnt) |
|---|---|
| Light | < 18 % |
| Balanced | 18 bis < 26 % |
| Spirit-forward | ≥ 26 % |

Nach der Umstellung druckt ein Testskript die Verteilung aller Drinks aus. Die Grenzen werden einmal mit dem Betreiber kalibriert. Leere Stufen sind erlaubt.

**Geschmack** (ersetzt `FLAVOR_PROFILES`-Regex). Fünf Richtungen, eine pro Tag:

| Tag | Label im Guide | Typische Zutaten | Zählt ab |
|---|---|---|---|
| `sour` | Fresh & Sour | Zitronen-/Limettensaft | **Mengenanteil** ≥ 15 % des Drink-Volumens |
| `fruity` | Fruity | Beeren, Steinobst, Tropisches, Cassis, Port, Grenadine | ein Treffer |
| `herbal` | Herbal & Floral | Kräuter, Tee, Blüten, Gurke, Chartreuse, Tonic | ein Treffer |
| `bitter` | Bitter & Aromatic | Campari, Wermut, Sherry, Bitters | ein Treffer |
| `sweet` | Sweet & Creamy | Kakao, Kaffee, Sahne, Eiweiß, Vanille, Orgeat | ein Treffer |

- Ob ein Tag nach Mengenanteil oder schon bei einem Treffer zählt, steht als Konfiguration pro Tag in der Logik (Konstante). Nur `sour` zählt nach Menge, damit nicht jeder Drink mit einem Spritzer Zitrone „sauer" ist. Schwellwert nachjustierbar.
- Allgegenwärtige Neutrale (simple syrup, Garnituren) bekommen keine Tags. Spirit-Basen (gin, rum …) ebenfalls keine.
- Score: Anzahl prägender Treffer pro gewähltem Profil (max. 2) wie bisher, `sour` zählt mit 1, wenn die Schwelle erreicht ist.
- Wie bisher ODER-Verknüpfung: Ein Drink passt, wenn er mindestens eines der gewählten Profile trifft. Keine Auswahl = alles passt.

**Schritte des Guides:**
1. *How strong?* – Light / Balanced / Spirit-forward (Non-alc entfällt)
2. *What are you in the mood for?* – die fünf Geschmacksrichtungen oben
3. **„Which spirits do you like?"** – Mehrfachauswahl gin/rum/whiskey/brandy/tequila/vodka. Keine Auswahl = alle okay. Darunter die zwei Ausschluss-Chips **„No egg white"**, **„No coffee"** im selben Schritt. *(meine Entscheidung: ein Schritt statt zwei, damit der Guide nicht länger wird. Die UI-Sprache bleibt Englisch wie die restliche Seite.)*
4. *Short or long?* (wie heute)

**Bewertung pro Drink**: neue Funktion `evaluate(recipe, answers)` liefert z. B.

```js
{
  strength: { ok: false, actual: 'strong', diff: +1 },   // Stufen-Abstand
  spirits:  { ok: false, disliked: ['whiskey'] },
  flavor:   { ok: true,  matches: ['raspberry syrup'] },
  excluded: { ok: true,  hits: [] },                      // Eiweiß/Kaffee
  length:   { ok: true }
}
```

Nicht beantwortete Kriterien sind immer `ok: true`. `spirits.ok` heißt: Der Drink enthält keine *nicht gewählte* Basisspirituose. Ein Drink ganz ohne Basisspirituose (z. B. nur Sherry/Likör) ist also `ok`. *(meine Entscheidung)*

**Hauptempfehlung** = Drinks, bei denen alle Kriterien `ok` sind, sortiert nach Score wie heute (Geschmacks-Treffer, Länge), max. 3. Der Guide endet weiterhin, sobald ≤ 3 Kandidaten übrig sind. Spirituosen und Ausschlüsse sind **harte Filter**. Der bisherige Fallback (`narrow` behält alte Kandidaten, wenn alles rausfliegt) gilt dafür **nicht mehr**.

**„Auch interessant"** = Drinks, die
- beim Ausschluss (Eiweiß/Kaffee) `ok` sind (nie verletzt, Anti-Ziel),
- beim Geschmack `ok` sind, falls Geschmack gewählt wurde,
- **genau ein** weiteres Kriterium verfehlen: Stärke um genau eine Stufe daneben **oder** eine nicht gewählte Spirituose **oder** die Länge.

Max. 3, sortiert nach Score. Jeder Fast-Treffer bekommt einen kurzen Grund, abgeleitet aus `evaluate`: „a bit stronger than you asked", „a bit lighter", „made with whiskey", „served long" / „served short".

**Keine Hauptempfehlung**: Der Guide zeigt „No perfect match – but you might like these" und darunter „Auch interessant". Sind auch das 0 Drinks, kommt ein Hinweis plus „Start over". *(meine Entscheidung)*

### 5. Rezept-Editor (`EditRecipes`, nur Dev) und Dev-Server

- Der Dev-Server bekommt `GET/PUT /api/dev/ingredients` zum Lesen und Schreiben von `ingredients.json` (gleiches Muster wie die Rezepte).
- **Neue Zutat im Rezeptformular:** Hat eine Zutat keinen Eintrag in der Liste, erscheinen darunter Felder für **ABV**, **Spirituose** (Dropdown, optional) und **Geschmack** (fünf Chips). Die Felder sind per Regex-Schätzung **vorausgefüllt**, der Betreiber bestätigt oder korrigiert. Beim Speichern des Rezepts wird der Eintrag in `ingredients.json` angelegt.
- **Pflicht:** Ein Rezept lässt sich erst speichern, wenn jede Zutat einen Eintrag hat (ABV gesetzt). Der Server prüft das ebenfalls.
- Bekannte Zutaten zeigen ABV und Tags als kleinen Hinweis neben dem Namen.
- **Reiter „Ingredients"** im Editor: Tabelle aller Einträge (Name, ABV, Spirituose, Tags), direkt bearbeitbar und speicherbar. Dazu ein Hinweis, in wie vielen Rezepten die Zutat vorkommt. Ein Eintrag lässt sich nur löschen, wenn kein Rezept ihn nutzt. Umbenennen gehört nicht zum Umfang.

### 6. Tests (vitest, `cocktailLogic.test.js`)

- ABV aus Zutatenliste: Chartreuse 55 %, Fallback für unbekannte Zutat.
- Geschmack: Tom Collins ist `sour`, Martini mit Zitronenzeste nicht. Negroni ist `bitter`.
- Tom Collins und Long Island Iced Tea fallen nach dem Ergänzen der Auffüller in die erwartete Stufe.
- „Das mag ich" = nur Gin: kein Drink mit anderer Spirituose in der Hauptempfehlung. Sloe Gin zählt nicht als Gin.
- „No egg white": kein Eiweiß-Drink in Haupt- **und** Auch-interessant-Liste.
- Fast-Treffer verfehlen genau ein Kriterium und tragen einen Grund.
- Bestehender Test „jede Antwortkombination liefert 1–3 Picks" wird ersetzt durch: „jede Kombination liefert ≥ 1 Drink in Haupt- oder Auch-interessant-Liste, oder den Leer-Hinweis".
- Jede in **aktiven** Rezepten verwendete Zutat hat einen Eintrag in `ingredients.json` (verhindert Lücken im Build).
- Archivierte Rezepte tauchen weder im Bar-Menü noch in Guide-Ergebnissen auf.

## Dem Builder überlassen

- Struktur und Namen der Funktionen, Score-Gewichte.
- Exakte ABV-Erstwerte (realistische Durchschnittswerte, zur Prüfung auflisten).
- Styling des „Auch interessant"-Blocks im bestehenden Guide-Look (`CocktailGuide.scss`).

## Offene Rahmenbedingung

Diese Session hat nur Lesezugriff auf `m-t-r-k/ginbar`, Pushen ist nicht möglich. Für die Umsetzung braucht es entweder Schreibzugriff oder die Änderungen gehen als Patch an den Betreiber.
