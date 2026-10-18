# Branding Concept & Design Tokens VibeConnect

## Name & Markenconcept
Teamname: VibeConnect
Positionierung: VibeConnect ist eine einfache und übersichtliche App für Konferenzen, bei der ein personalisierter Timetable im Mittelpunkt steht. Statt sich durch komplexe Menüs zu klicken, können Teilnehmende ihre Lieblingsevents mit einem Klick filtern und speichern, um ihren Tag unkompliziert zu planen. Das Design ist modern und reduziert, um von Anfang an für Orientierung zu sorgen.

## Design
Primary: #850c54
Secondary: #da148a #30041e
Structur Colors: #dedede #ffffff #2d2d2d Darkmode: #212121 
Text Colors: #cccccc #ffffff #2d2d2d 

color-surface-base: Basis-Hintergrund der App (#ffffff im Light Mode, #212121 im Dark Mode).

color-surface-card: Hintergrund für Karten, Container und Modul-Boxen (#cccccc bzw. im JSON neutral.300/800 im Light/Dark Mode).

color-brand-primary: Primäre Markenfarbe (Deep Berry #850c54) für Hauptelemente, Header und primäre CTAs.

color-brand-secondary: Sekundäre Markenfarbe (Aubergine #30041e), genutzt für Badges, Kategorien und Tags.

color-brand-accent: Akzentfarbe (Magenta #da148a) für Info-Icons, aktive Zustände und gezielte Highlights.

color-text-primary: Haupttextfarbe (#2d2d2d im Light Mode, #ffffff im Dark Mode) für maximale Lesbarkeit.

color-text-on-brand: Kontrastierende Textfarbe auf dunklen Markenelementen (#ffffff).

Zusätzlich umfasst das System eine harmonische Spacing-Skala (xs bis xl auf Basis von rem-Einheiten) sowie eine modulare Typografie-Skala (von sm bis xxl), um konsistente Abstände und Textgrößen über alle Ansichten hinweg sicherzustellen.

# WCAG Kontrast Check
Kontraste wurden mit **WebAim Contrast Cechecker** geprüft.

1. Weißer Text (`#ffffff`) auf Primary / Basecolor (`#850c54`):
Kontrastverhältnis: 9.1:1
2.  Weißer Text (#ffffff) auf Secondary Brand / Aubergine (#30041e): *               Kontrastverhältnis: 14.8:1 
3. Weißer Text (#ffffff) auf Accent / Magenta (#da148a):
Kontrastverhältnis: 4.7:1, Erfüllt knapp die WCAG-AA-Norm für normalen Text auf farbigen Highlight-Boxen sollte deshalb nicht für CTA, Fließtext und wichtige Informationen verwendet werden, kann aber für Linien roße Texte, Icosn, verwendet werden.
4. Dunkler Text (`#2d2d2d`) auf weißem Hintergrund (`#ffffff`):
Kontrastverhältnis: 12.0:1
5. Dunkler Text (`#2d2d2d`) auf Hellgrau / Kartenfarbe (`#dedede`):
Kontrastverhältnis: 10.2:1 

## Begründung der Tokens-Architektur
1. Wartbarkeit: Durch die zentrale Definition der Rohwerte in Token-Dateien können globale Farb- oder Layoutanpassungen im gesamten Projekt mit minimalem Aufwand vorgenommen werden.
2. Theming-Erweiterbarkeit (Dark Mode): Die saubere Trennung von primitiven und semantischen Tokens stellt sicher, dass für den Dark Mode lediglich die semantischen Farbzuweisungen umgeschaltet werden müssen. Die HTML- und JSON-Struktur der Komponenten bleibt dabei absolut unangetastet.
3. Konsistenz: Die festgelegte Spacing- und Typografie-Skala erzwingt ein einheitliches, aufgeräumtes Design-Raster über alle Ansichten hinweg.