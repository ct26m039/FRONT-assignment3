# ADR-1026: Frontend-Architektur, Tooling & Deployment-Strategie für VibeConnect

## Status

Open

## Datum

2026-10-18

## Kontext

Für die VibeConnect Konferenz-App benötigen wir ein performantes, wartbares Frontend-Setup mit schneller Entwicklung, sauberem State-Management für den Timetable und einer kollaborativen Testumgebung.

Im Team haben wir folgende Rahmenbedingungen evaluiert:
- **Framework-Wahl:** Vorkenntnisse und praktische Erfahrung mit Vue.js im Team.
- **Routing-Unsicherheit:** Zu Beginn war unklar, ob eine komplexe Multi-View-Struktur nötig ist. Full-Stack-Frameworks wie Nuxt erzwingen ein festes Routing. Wir wollten jedoch modular entscheiden, um agiler zu bleiben.
- **Deployment & Präsentation:** `localhost` reicht für Stakeholder-Präsentationen nicht aus. Wir benötigten eine praxisnahe, lokalunabhängige Testumgebung.

## Entscheidung

Wir treffen folgende technologische Entscheidungen für das Frontend-Setup von VibeConnect:

1. **Vue 3 (Composition API):** Genutzt wegen Team-Erfahrung und hoher Wartbarkeit.
2. **Vite:** Ersetzt traditionelle Bundler durch schnelles HMR und einen schlanken Entwicklungsprozess.
3. **Vue Router (modular):** Gezielter Einsatz, um modular zu entscheiden, wann Views benötigt werden, ohne Framework-Overhead.
4. **GitHub Pages:** Direkte Publikation für eine echte, öffentlich erreichbare URL ohne `localhost` für unkompliziertes Testen.

## Betrachtete Alternativen

### Nuxt.js (Full-Stack Meta-Framework)
- Vorteile: Stark standardisiert, automatisches Routing, integriertes SSR.
- Nachteile: Erzwingt vordefinierte Strukturen, was unseren agilen, modularen Ansatz eingeschränkt hätte.
- Warum abgelehnt: Zu starr für unsere Findungsphase; eine modulare SPA mit Vue + Vite bietet mehr Freiheit.

### Reine CSS Custom Properties ohne JSON-Datei
- Vorteile: Sofortige Browser-Einsatzfähigkeit ohne zusätzliche Build-Tools oder Parser.
- Nachteile: Fest an CSS gebunden; keine plattformunabhängige "Single Source of Truth" oder Figma-Schnittstelle.
- Warum abgelehnt: Die tokens.json nach W3C-Standard ist das zukunftssichere Fundament für unser Design-System.

### Reines Lokales Hosting (Localhost / ZIP)
- Vorteile: Keine externe Plattform nötig, offline steuerbar.
- Nachteile: Keine echte Praxisnähe, umständlich für Team-Reviews und Präsentationen.
- Warum abgelehnt: GitHub Pages liefert ohne Mehraufwand eine echte Test-URL.

## Konsequenzen

### Positiv
- **Hohe Entwicklungsgeschwindigkeit:** Vertraute Technologien (Vue + Vite).
- **Agile Flexibilität:** Modulare Routing-Nutzung statt Framework-Zwang.
- **Echte Praxisnähe:** Live-URL auf GitHub Pages ohne Kommandozeilen-Hürden.
- **Geringer Overhead:** Keine komplexe CI/CD-Pipeline notwendig.

### Negativ / Herausforderungen
- Client-Side-Routes müssen für GitHub Pages konfiguriert werden (z. B. `404.html`-Fallback gegen 404-Fehler).

### Risiken
- Bei künftigem SSR- oder SEO-Bedarf wäre eine Migration nötig. Für die Konferenz-App mit personalisiertem Timetable reicht die SPA-Architektur jedoch vollkommen aus.

## Verwandte Entscheidungen

- Schritt 1: Design-Token-Architektur (W3C DTCG Format, Light/Dark Mode Vorbereitung)
- VibeConnect Konferenz-Daten-Integration (`conference-data.json`)