# Branding Concept & Design Tokens VibeConnect

## Name & Markenconcept
Teamname: VibeConnect
Positionierung: VibeConnect ist eine einfache und übersichtliche App für Konferenzen, bei der ein personalisierter Timetable im Mittelpunkt steht. Statt sich durch komplexe Menüs zu klicken, können Teilnehmende ihre Lieblingsevents mit einem Klick filtern und speichern, um ihren Tag unkompliziert zu planen. Das Design ist modern und reduziert, um von Anfang an für Orientierung zu sorgen.

## Design
Primary: #850c54
Secondary: #da148a #30041e
Structur Colors: #dedede #ffffff #2d2d2d Darkmode: #212121 
Text Colors: #cccccc #ffffff #2d2d2d 

* `color-surface-base`: Basis-Hintergrund der App (`#ffffff` im Light Mode, `#212121` im Dark Mode).
* `color-surface-card`: Hintergrund für Karten und Container (`#dedede` im Light Mode, `#2d2d2d` im Dark Mode).
* `color-brand-primary`: Primäre Markenfarbe für Hauptelemente und CTAs (`#850c54` Deep Berry).
* `color-brand-secondary`: Sekundäre Akzentfarbe (`#da148a`). C, Hoveromment: Für Hinweis
* `color-brand-accent`: Zusätzlicher Akzentton (`#30041e`). Comment: Für Tags,Active State
* `color-text-primary`: Haupttextfarbe (`#2d2d2d` im Light Mode, `#ffffff` im Dark Mode).
* `color-text-on-brand`: Textfarbe auf Markenelementen (`#ffffff`)

# WCAG Kontrast Check
Kontraste wurden mit **WebAim Contrast Cechecker** geprüft.

1. Weißer Text (`#ffffff`) auf Primary / Basecolor (`#850c54`):
   * Kontrastverhältnis: 9.1:1
2. Dunkler Text (`#2d2d2d`) auf weißem Hintergrund (`#ffffff`):
   * Kontrastverhältnis: 12.0:1
3. Dunkler Text (`#2d2d2d`) auf Hellgrau / Kartenfarbe (`#dedede`):
   * Kontrastverhältnis: 10.2:1 

## Begründung der Tokens-Architektur
1. Wartbarkeit: Durch die zentrale Definition der Rohwerte in Token-Dateien können globale Farb- oder Layoutanpassungen im gesamten Projekt mit minimalem Aufwand vorgenommen werden.
2. Theming-Erweiterbarkeit (Dark Mode): Die saubere Trennung von primitiven und semantischen Tokens stellt sicher, dass für den Dark Mode lediglich die semantischen Farbzuweisungen umgeschaltet werden müssen. Die HTML- und JSON-Struktur der Komponenten bleibt dabei absolut unangetastet.
3. Konsistenz: Die festgelegte Spacing- und Typografie-Skala erzwingt ein einheitliches, aufgeräumtes Design-Raster über alle Ansichten hinweg.