# CRA → Vite Migration

**Datum:** 2026-11-12
**Status:** freigegeben

## Ziel

- Dependabot-Alerts aus der unmaintained `react-scripts`-Toolchain loswerden (34 offen im Client, alle Build-/Dev-Tooling).
- Für Besucher ändert sich nichts.
- Netlify-Einstellungen bleiben unverändert: Netlify baut bei jedem Push auf `main` in `client/` mit `npm run build` und veröffentlicht `client/build`.
- Lokaler Workflow bleibt: `npm start` im Root startet Client + Dev-API, `scripts/start-dev-edit.cmd` öffnet den Rezept-Editor auf `localhost:3000`.

## Entscheidungen

| Thema | Entscheidung |
|---|---|
| Bundler | Vite 8 + `@vitejs/plugin-react` |
| JSX in `.js` | Dateien mit JSX per `git mv` in `.jsx` umbenennen (kein Loader-Workaround) |
| Dev-Port | 3000 (`server.port`), damit `start-dev-edit.cmd` unverändert funktioniert |
| Build-Output | `build/` (`build.outDir`), damit Netlify unverändert bleibt |
| `index.html` | von `public/` nach `client/`, `%PUBLIC_URL%` entfernen, `<script type="module" src="/src/index.jsx">` |
| Env | `process.env.NODE_ENV !== 'production'` → `import.meta.env.DEV`; `REACT_APP_DEV_API` → `VITE_DEV_API` |
| Node | `.nvmrc` mit `22` in Root und `client/` (Vite 8 braucht ≥ 20.19) |
| Tests | Vitest mit `globals: true`, Testcode unverändert |
| npm-Scripts | `start` = `vite`, `build` = `vite build`, `test` = `vitest run` |

## Entfernt

`react-scripts`, `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`, `web-vitals`, `node-forge`, `src/reportWebVitals.js`, `src/setupTests.js`, `eslintConfig` und `browserslist` aus `package.json`, `generate-react-cli.json`, CRA-Standard-README.

## Bewusst nicht

- Kein eigenes ESLint-Setup (Vite lintet nicht; nachrüsten, wenn es fehlt).
- Keine Änderungen an Komponenten außer Umbenennung und den zwei Env-Stellen.

## Verifikation

1. `npm run build` erfolgreich, Output in `client/build/`.
2. Production-Bundle enthält keinen Editor-Code (Suche nach `dev-edit-recipes` / `api/dev` in `build/assets/*.js` leer).
3. Fonts landen im Build und laden (keine 404 im Browser).
4. `npm test` grün (8 Tests).
5. `npm audit` im Client: 0 bzw. nahezu 0 Alerts.
6. `npm start` im Root: Client auf :3000, API auf :3001; `start-dev-edit.cmd` öffnet den Editor.
7. Manuelle Abnahme aller Seiten lokal durch den User, erst dann Merge nach `main` (= Netlify-Deploy).
