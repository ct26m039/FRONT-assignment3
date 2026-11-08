# Rendering Strategie und Begründung
Dieses ADR definiert die Rendering Strategie der einzelnen Komponenten der Konferenzplattform, 
um für einen hohen Userkomfort zu sorgen.
Bei der Auswahl der Rendering Strategie gibt es die Wahl zwischen vier verschiedenen Methoden.
- Static-Site-Generation (SSG)
- Client-Side-Rendering (CSR)
- Server-Side-Rendering (SSR)
- Incremental Static Regeneration (ISR)

Jede dieser Methoden hat verschiedenen Vorteile und Nachteile. SSG ist schnell und einfach zu implementieren, kann 
jedoch die Seite nicht selbstständig neu laden, wodurch personalierte Daten oder kurzfristige Änderungen nur durch
manuelles Laden erscheinen können. 

CSR benutzt den localhost um zwischengespeicherte Daten der Users abzurufen. Nachdem die Seite das erste mal geladen 
wurde, ist sie genau so schnell wie SSG und lagert das Rendering auf den Browser aus. Dafür ist der erste Aufruf einer 
Seite sehr langsam und sie ist nicht gut für SEO geeignet.

SSR lagert das Rendering auf den Server aus, der Browser erhält sofort die vollständingen Inhalte. Sobald das JavaScript
geladen ist, wird die Seite interaktiv und kann auf etwaige Änderungen reagieren. Jedoch ist SSR sehr komplex und 
aufwenidger zu implementieren (z.B: State-Management).

ISR beschränkt die Interaktivität auf bestimmte Teilbereiche, nicht die gesamte Seite. Die Laufzeit wird schneller, 
die Seite muss nicht vollständig neugeladen werden und der Server hat weniger Rechenaufwand. 

Die Auswahl der Renderstrategie orientiert sich an dem Entwicklungsaufwand, den Eigenschaften der vorliegenden Daten, 
ob ein Server vorhanden ist, dem Userkomfort, der Änderungsfrequenz der Daten, SEO, der gewünchsten Geschwindigkeit,
der Latenz und der Verfügbarkeit bei nichtvorhandenem Internet.

## Optionen
Speaker-Profile F
- SSG
- SSR
- ISR

Session-Detailseite M
- SSG
- SSR

Session-Übersicht F
- SSG
- CSR
- SSR

"Mein Programm"-Dashboard M
- CSR
- SSR
- ISR

# Entscheidung
Speaker-Profile: SSG F

Session-Detailseite: SSR M

Session-Übersicht: SSG F

"Mein Programm"-Dashboard: CSR M

## Konsequenzen & Begründung


