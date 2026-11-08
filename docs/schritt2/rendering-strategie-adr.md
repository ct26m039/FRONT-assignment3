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
Speaker-Profile:
Kontext: Die Speaker-Profilseiten präsentieren Infos zu den Vortragneden. Diese Profildaten stammen aus dem Konferenzdatensatz und ändern sich während der Konferenz kaum oder gar nicht. Die Seiten dienen zur Information und sind SEO relevant. 
- SSG
Vorteile: GuteLadezeiten, Ausfallsicherheit und minimale Serverkosten, da alle 18 Speaker-Seiten beim Build komplett als statisches HTML erzeugt und über ein CDN ausgeliefert werden. Perfekt für Suchmaschinen.
Nachteile: Nachträgliche Textänderungen an Biografien erfordern einen erneuten Build- und Deployment-Prozess.
- SSR
Vorteile: Jeder Aufruf generiert die Seite frisch auf dem Server, Speaker-Daten können bis zur letzten Sekunde angepasst werden.
Nachteile: Unnötige Serverauslastung und höhere Antwortzeiten für Daten, die sich praktisch nie zur Laufzeit ändern.
- ISR
Vorteile: Seiten werden statisch ausgeliefert und können bei Bedarf im Hintergrund nach einem festgelegten Zeitintervall neu gebaut werden.
Nachteile: Für einen kleinen, statischen Datensatz von lediglich 18 Speakern ein unnötiger technischer Overhead.


Session-Detailseite
- SSG
- SSR

Die sinnvollsten Lösungen für die Detailseite sind SSG und SSR. 
Da Änderungen auf individueller Konferenzbasis häufiger vorkommen und jede Konferenz besonders viele Datensätze beinhaltet,
ist eine Lösuung mit Server-Side-Rendering besser geeignet als zum Beispiel ISR. Incremental-Static-Regeneration ändert 
nur bestimmte Teile der Seite, jedoch haben die einzelnen Konferenzen über zehn Datensätze, die es zu beachten gilt. Somit
ist ISR eine sehr aufwendige Lösung und die SSR Variante um einiges leicher zu implementieren ist.

Ebenfalls muss der User nichts bezüglich den Daten speicher, weswegen auch Client-Side-Rendering hier nicht angebracht ist.

Static-Site-Generation ist ebenfalls anwendbar, hängt jedoch von der Serverstruktur und etwaigen Datenbankverbindungen ab.
Sind diese vorhanden ist SSG nicht zu empfehlen, da bei kleinen Änderungen direkt die gesamte Seite manuell neugeladen werden muss.


Session-Übersicht:
Kontext: Die Übersichtseite zeigt alle 20 Konferenzen. Eine Filterung soll für Benutzer möglich sein. Dies soll unimittelbar und flüssig ohne Ladezeiten reagieren. 

- SSG
Vorteile: Die Basisliste aller 20 Vorträge wird vorab als HTML generiert. Suchmaschinen können das gesamte Programm sofort crawlen und die Seite lädt extrem schnell.
Nachteile: Die statische Seite zeigt zwar sofort alle Vorträge an, aber das Filtern selbst geht erst, wenn das JavaScript im Browser geladen und aktiv ist.
- CSR
Vorteile: Die Filterung nach Tag, Track und Level reagiert verzögerungsfrei im Browser des Nutzers, ohne Anfragen an einen Server. Die Implementierung mit Vue-Reaktivität (computed) ist schlank und einfach.
Nachteile: Initial leerer HTML-Inhalt, schlechtere SEO-Erkennbarkeit für Suchmaschinen, da der Inhalt erst durch JavaScript im Browser aufgebaut wird.
- SSR
Vorteile: Liefert stets serverseitig gerendertes HTML und kann URL-Filterparameter (z. B. ?track=ai-dx) serverseitig vorfiltern.
Nachteile: Bei jedem Filterwechsel einen Server-Roundtrip auszulösen erzeugt merkliche Latenzen und verschlechtert die Benutzererfahrung (UX) im Vergleich zu lokaler Filterung.

"Mein Programm"-Dashboard 
- CSR
- SSR
- ISR

Die "Mein Programm" Sektion hat viele verschiedene Implementationsmöglichkeiten.

Sofort Ausgeschlossen ist Static-Site-Generation, da das Program des Users sich ständig ändern kann. Es wird eine Liste
an  Konferenzen benötigt, die bearbeitbar ist und sich merkt, welche Konferenzen der User gespeichert hat. Eine SSG
Lösung würde diese Funktionalität nicht ermöglichen.

Client-Side-Rendering ist die einfachste und am schnellsten zu implementierende Lösung. Eine Liste der Konferenzen
wird im Local Storage gespeichert und kann ohne Probleme vom User erweitert oder verringert werden. Sollte der User die
Seite verlassen oder neu laden, sind seine Einträge immer noch erreichbar. Jedoch hat dies den Nachteil, dass die Seite
immer neu geladen werden muss um Änderungen sichtbar zu machen. Wenn reaktivität gefordert ist, ist die Implementierung
etwas umständinger, wenn auch nicht unmöglich.

SSR und ISR sind ebenfalls anwendbar, hängen jedoch von der Serverstruktur des Backends ab. Da das Program nur bestimmte
wichtige Werte der Konferenzen benötigt, ist eine ISR Lösung die bessere Wahl. Eine volle SSR Implementierung wäre bei
solch kleinen Datenmengen nicht notwendig und würde nur die Performanz der Seite beeinträchtigen. Ein entscheidenter Nachteil
ist jedoch, dass bei Ausfall des Servers auch der Stand des Userprogramms verloren gehen kann. Bei der CSR Lösung sind 
die einträge weiterhin im Local Storage gespeichert und bei bedarf abrufbar.

# Entscheidung & Begründung
Speaker-Profile: SSG 

Die Speaker-Profile stellen rein statischen Content dar. Daher bietet SSG die optimale Kombination aus höchstmöglicher Performance, SEO-Sichtbarkeit und Ressourceneffizienz. Ein erneutes Rendern auf dem Server bei jedem Seitenaufruf (SSR) wäre Ressourcenverschwendung. Sollte sich im Vorfeld ein Tippfehler einschleichen, genügt ein kurzer Deployment-Build.


Session-Detailseite: SSG 

Ursprünglich hätten wir uns für einer Server-Side-Rendering Lösung für die Detailseite entschieden, da dies in einer
App mit Serverstruktur und Datenbankzugriff am meisten Sinn macht. Jedoch im Betracht auf die Art wie unsere 
Konferenzdaten gespeichert sind und wie Änderungen an den Datensätzen durchgeführt werden können, haben wir uns für eine
Static-Site-Rendering Lösung entschieden. 

Dies hat mehrere Gründe:
Die Implementierung von SSR ist um einiges komplexer und würde eine gesamte Simulation einer Serverstruktur benötigen.
Da unsere Expertise als Developer diesen Bereich nicht abdeckt, würde dies zu stark erhöhter Entwicklungszeit führen.

Die Daten der Konferenezen kommen aus einem statischen JSON-File und können nur durch direkte Änderungen der Datei
durchgeführt werden. Sollten sich Daten ändern, muss dies nicht sofort für alle User automatisch sichtbar sein, da ein
simpler Reload der Seite ausreicht um die Daten zu aktualisieren. Ebenfalls sind die Daten, die exklusiv auf der Detailseite angezeigt werden
nicht wichtig genug um eine reaktive Aktualisierung zu rechtfertigen.


Session-Übersicht: SSG 

Nutzer wechseln wiederholt Tags, Tracks und Level. Da der gesamte Datensatz kompakt ist (20 Sessions), werden die Daten über useConferenceData() clientseitig vorgehalten. Die Filterlogik läuft verzögerungsfrei und reaktiv direkt im Browser. SSR scheidet wegen der Latenzen beim Filtern aus. CSR liefert hier die flüssigste Bedienung für die Teilnehmenden.


"Mein Programm"-Dashboard: CSR 

Dieser Teil des Projekts ist besonders, da dieser im Gegensatz zu den vorherigen zwingend nicht mit SSG implementiert werden kann.
Nach dem Abwägen der drei möglichen Implementierungsstrategien haben wir uns für das Client-Side-Rendering entschieden.

Das Dashboard ist die einzige Komponente, wo häufige Änderungen durch den User selbst zu erwarten sind und benötigt somit
eine gewissen Art der Reaktivität. SSR sowie ISR sind durchaus geeignet dafür, jedoch sind sie von einer durchgängigen
Verbindung zu einem Server abhängig und somit anfällig für Netzwerkprobleme. Eine CSR Lösung umgeht dieses Problem und bietet
gleichzeitig alle nötigen Funktionalitäten die das Dashboard fordert.

Die gespeicherten Konferenzen werden im Local Storage gespeichert und sind somit auch nach dem Schließen des Browsers
weiterhin erhalten. Für die Anforderungen an die App ist dies ausreichend und ist eine einfach und schnelle Lösung.

## Konsequenzen

Session-Detailseite:

Durch die SSG Implementierung der Detailseite gibt es einige Dinge, die nicht abgedeckt werden können. Zum Beispiel sind
Änderungen die an der JSON-Datei vorgenommen werden nicht sofort sichtbar, dar die Seite nicht automatisch auf etwaige
Änderungen reagieren kann. Sie werden trotzdem nach dem Neuladen der Seite angezeigt, jedoch muss das der User selbst
auslösen. Sollte sich somit ein Raum oder die Startzeit kurfristig geändert haben und der User hat immer noch die 
"alte" Version der Seite geöffnet, so werden die Änderungen nicht angezeigt, was zu einem schlechten Usererlebnis führen kann.

"Mein Programm"-Dashboard:

Die CSR Lösung bietet die notwendige Funktionalität und kann sehr einfach implementiert werden. Ebenfalls gibt es keine
Probleme bei Änderungen im JSON-File, da die Local Storage einträge auf die Konferenz IDs verweisen. Somit kommt es zu
keinen veralteten Einträgen und garantiert die Konsistenz der Anzeige.

Jedoch hat diese Herangehensweise zwei Schwächen. Ersten, sie funktoniert nur auf dem Gerät, dass der User zum Zeitpunkt des Erstellens der Liste benutzt hat. Dies
hat in der derzeitigen Version der VibeConnect-App keine große Auswirkung, sollte sie jedoch in der Zukunft um eine Mobile-App
erweitert werden, kann dies zu Inkonsistenzen führen. 

Zweitens können ähnliche Probleme können beim Wechsel des Desktopgerätes ebenfalls auftreten. Sollte ein benutzer die
Webseite auf einem anderen Gerät öffnen, wird das Program nicht mitgespeichert, da es sich auf den Local Storage des
jeweiligen Browsers bezieht. 

 