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


## Session-Detailseite:
Stellt spezifische Informationen zu einem Konferenzvortrag dar (Titel, Raum, Zeitslot, etc.). War sind die Konferenzdaten schon vorab geplant und gegeben, können aber in der Realitiät kurzfristigen Änderungen unterliegen (zB. Raumverschiebung). Session-Seiten sind SEO relevant.

## Optionen
- SSG
Vorteile: Gute Performance, keine Serverlast beim Aufruf. 
Nachteile: Kurzfristie Änderungen erfordern einen vollständigen Rebuild oder bleiben bis zum nächten Deployment veraltet. 
- SSR
Vorteile: Beim Aufruf werden Echtzeitdaten geliefert ( wichtig bei kurzfristigen Änderungen). Serverseitiges HTML für SEO. 
Nachteile: Höhere Latenzm benötigt aktive Serverinfrastruktur statt statischem Hosting. 

# Entscheidung
Session-Detailseite: SSR

## Konsequenzen & Begründung
SSR garantiert, dass TeilnehmerInnen stets den aktuellen Stand sehen, ohne, dass die gesamte Application neu gebaut werden muss. In unserer Anwendung wir ddies simuliert. Der leichte Performance-Nachteil gegenüber SSG wird durch die Konsistenz und SEO Unterstützung gerechtfertigt.   


## "Mein Programm"-Dashboard:
Das Dashboard visualisiert die vom Benutzer individuell zusammengestellte Konferenzagenda. Die Auswahl der Sessions wird clientseitig im localStorage des jeweiligen Browser bestehen bleiben. In unserer Anwendung gibt es kein zentrales Benutzerkonto oder Backend.  

## Optionen
- CSR
Vorteile: App läuft direkt im Browser des Benutzers und kann den localStorage sofot auslesen. Wenn Session Hinzugefügt/Entfernt werden,  aktualisiert sich die Ansicht ohne die Neuladen der Seite.
Nachteile: Beim ersten Laden längere Ladedauer und Suchmaschinen sehen die Inhalte nicht sofort. 
- SSR
Vorteile: Server baut die HMTL-Seite vorab zusammen, wodurch ein erster Entwurf schnell angezeigt wird.
Nachteile: Server hat keinen Zugriff auf den Browser-Speicher des Nutzers. 
- ISR
Vorteile: Die Seite wird einmal als fertige Datei abgespeichert und schnell ausgeliefert. Im Hintergrund könnne Änderungen nach und nach erneuert werden.
Nachteile: Eine einmal erstellte Seite gilt für alle Nutzer gleich, der Server kann keine statische Seiten bauen, die für jeden Nutzer andere gemerkte Sessions anzeigt. 

# Entscheidung
"Mein Programm"-Dashboard: CSR F

## Konsequenzen & Begründung
Da die gespeichertes Sessions ausschließlich auf dem Gerät der Nutzers liegen (localStorage) ist CSR die technisch sinnvollste Lösung:
SSR und ISR scheiden aus, weil der Server den lokalen Browser-Speicher nicht lesen kann. 
CSR greift direkt im Browser auf die gespeicherten Daten zu und verknüpft sie mit den Konferenzdaten aus useConferenceData.
Weil es sich um eine private Übersicht handelt, spielen SEO  und das vorab Rendern auf dem Server keine Rolle. 


