# CRA → Vite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `client/` von react-scripts (CRA) auf Vite 8 + Vitest umstellen, ohne Verhaltensänderung für Besucher und ohne Netlify-Änderung.

**Architecture:** Vite ersetzt die CRA-Toolchain; `vite.config.js` pinnt Port 3000 und Output `build/`. JSX-Dateien werden zu `.jsx`, `index.html` wandert nach `client/`. Vitest ersetzt Jest für die zwei bestehenden Logik-Tests.

**Tech Stack:** React 18, Vite 8.3.x, @vitejs/plugin-react 6.x, Vitest 5.x, Sass, Node 22.

**Spec:** `docs/superpowers/specs/2026-11-12-cra-to-vite-design.md`

## Global Constraints

- Arbeit auf Branch `chore/vite`; **kein Push auf `main`** vor Abnahme durch den User (Push auf `main` = Netlify-Live-Deploy).
- Dev-Server-Port: `3000`. Dev-API bleibt `3001`.
- Build-Output: `client/build/`. Script-Namen bleiben `start`, `build`, `test`.
- Node: `.nvmrc` mit Inhalt `22` in Repo-Root und `client/`.
- Env: `import.meta.env.DEV` statt `process.env.NODE_ENV !== 'production'`; `VITE_DEV_API` statt `REACT_APP_DEV_API`, Fallback `http://localhost:3001`.
- Komponenten-Inhalte nicht ändern außer: Umbenennung, Import-Pfade mit expliziter `.js`-Endung, die zwei Env-Stellen.

## Review Focus

- Deep Link / Reload auf `/gins/<id>` im Dev-Server und im Build (Netlify `_redirects` muss in `build/` landen) → Task 1 Step 6.
- Fonts aus `_fonts.scss` (relative `../../../public/fonts/...`-Pfade) laden im Build ohne 404 → Task 1 Step 6.
- Hintergrundbilder/Videos über Laufzeit-Pfade `../images/...` funktionieren auf verschachtelten Routen weiter → Task 3 Abnahme.
- Rezept-Editor `/dev-edit-recipes/` fehlt im Production-Bundle, funktioniert aber im Dev-Server → Task 1 Step 6 + Task 3.
- Explizite `.js`-Import-Pfade auf umbenannte Dateien (bekannt: `GinList` → `GinOverviewTile.js`) → Task 1 Step 3.

---

### Task 1: Toolchain auf Vite umstellen

**Files:**
- Create: `client/vite.config.js`, `client/.nvmrc`, `.nvmrc`
- Move: `client/public/index.html` → `client/index.html`
- Rename: alle 33 `client/src/**/*.js` mit JSX → `.jsx` (Liste: `grep -rlE "<[A-Za-z]" client/src --include=*.js`); `*.test.js` und `*Logic.js` bleiben `.js`
- Modify: `client/package.json`, `client/src/index.jsx`, `client/src/components/AnimatedRouts.jsx:25`, `client/src/components/Pages/EditRecipes/EditRecipes.jsx:5`, `client/src/components/GinList/GinList.jsx:2`
- Delete: `client/src/reportWebVitals.js`, `client/generate-react-cli.json`, `client/README.md`

**Interfaces:**
- Produces: `npm start` → Vite-Dev-Server auf :3000; `npm run build` → `client/build/`

- [ ] **Step 1: Dependencies tauschen** (in `client/`)

```bash
npm uninstall react-scripts web-vitals node-forge
npm install -D vite@8 @vitejs/plugin-react@6
```

In `package.json`: Scripts `start: "vite"`, `build: "vite build"`, `preview: "vite preview"`; Blöcke `eslintConfig` und `browserslist` löschen.

- [ ] **Step 2: `vite.config.js` anlegen**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, strictPort: true },
  build: { outDir: 'build' },
});
```

`.nvmrc` (Root + `client/`) mit `22`.

- [ ] **Step 3: Dateien umbenennen und Imports fixen**

`git mv` jeder JSX-Datei auf `.jsx`. Danach `grep -rnE "from ['\"][^'\"]+\.js['\"]" client/src` → jede Fundstelle, die auf eine umbenannte Datei zeigt, auf endungslos ändern (bekannt: `GinList.jsx:2`).

- [ ] **Step 4: `index.html` umziehen**

`git mv client/public/index.html client/index.html`; alle `%PUBLIC_URL%` entfernen (`%PUBLIC_URL%/x` → `/x`); CRA-Hinweiskommentare löschen; vor `</body>`: `<script type="module" src="/src/index.jsx"></script>`. Cookiebot/gtag unverändert.

- [ ] **Step 5: Env und Entry anpassen**

- `AnimatedRouts.jsx`: Bedingung → `import.meta.env.DEV && (...)`
- `EditRecipes.jsx`: `import.meta.env.VITE_DEV_API || 'http://localhost:3001'`
- `index.jsx`: Import und Aufruf von `reportWebVitals` entfernen; Datei löschen.

- [ ] **Step 6: Build verifizieren**

Run (in `client/`):
```bash
rm -rf build && npm run build
ls build/_redirects build/index.html
grep -l "api/dev\|dev-edit-recipes" build/assets/*.js   # Expected: keine Ausgabe
ls build/assets | grep -iE "woff2|ttf"                  # Expected: Font-Dateien vorhanden
```
Expected: Build ohne Fehler; `_redirects` vorhanden; kein Editor-Code; Fonts im Output.

- [ ] **Step 7: Dev-Server verifizieren**

`npm start` im Repo-Root → Ausgabe zeigt Vite auf `localhost:3000` und API auf `:3001`. `curl -s localhost:3000/gins/momentum_gin | grep -c 'id="root"'` → `1`.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "Migrate client from CRA to Vite"
```

### Task 2: Tests auf Vitest

**Files:**
- Modify: `client/vite.config.js`, `client/package.json`
- Delete: `client/src/setupTests.js`

**Interfaces:**
- Consumes: `vite.config.js` aus Task 1
- Produces: `npm test` → Vitest, einmaliger Lauf

- [ ] **Step 1: Pakete tauschen**

```bash
npm uninstall @testing-library/jest-dom @testing-library/react @testing-library/user-event
npm install -D vitest@5
```
Script `test: "vitest run"`.

- [ ] **Step 2: Config**

In `vite.config.js` ergänzen: `test: { globals: true, environment: 'node' }`. `src/setupTests.js` löschen.

- [ ] **Step 3: Tests laufen lassen**

Run: `npm test` (in `client/`)
Expected: 2 Test-Files, 8 Tests passed — `cocktailLogic.test.js`, `ginFilterLogic.test.js` unverändert.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Switch tests from Jest to Vitest"
```

### Task 3: Audit und Abnahme

- [ ] **Step 1: Audit**

Run: `npm audit` in `client/` und `server/`
Expected: Client 0 (oder nur Alerts ohne verfügbaren Fix — dann einzeln im Abschlussbericht nennen), Server 0.

- [ ] **Step 2: Lokale Abnahme durch den User**

Dev-Server starten; User prüft: Home (Videos), Gin Types + How to Taste (Slider, Pfeile), Gins (Filter) + Detailseite per Direktaufruf/Reload, Bar Menu (Filter, Guide, Overlay), Imprint, `/dev-edit-recipes/` (laden, Combobox, speichern), `scripts/start-dev-edit.cmd`. Zusätzlich `npm run build && npx vite preview --port 4173` → Reload auf `/gins/momentum_gin`, Fonts sichtbar.

- [ ] **Step 3: Merge nach Freigabe**

Nur nach expliziter User-Freigabe: `git checkout main && git merge --ff-only chore/vite && git push origin main` (geht live). Danach Netlify-Deploy-Status vom User bestätigen lassen.
