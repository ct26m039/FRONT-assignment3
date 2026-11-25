# Verifikationsnachweis

Die Installation und Registrierung des Service Workers war erfolgreich, sw.js wird generiert und ausgeführt. Sichtbar in Screenshot **"ServiceWorkerRegistration.jpg"**. Das Web Manifest ist wurde erstellt und alle eingegebenen Daten sind vorhanden, so wie sie in den Tokens definitert sind. Start-URL ist /FRONT-assignment3/ und display ist standalone wie gefordert. Sichbar in Screenshot **"WebManifest.jpg"**

Offline-Funktionalität ist gegeben, die App kann offline laden und ist voll  funktionstüchtig. Es bestehen keine großen Unterschiede zwischen der Online und Offline Version, vergleich in DevTools ist sichtbar in Screenshots **"OfflineMode.jpg"** und **NetworkTabOnlineMode.jpg**. Ebenfalls wurde die Funktionalität mit den DevTools sowie dem Flugmodus des Rechners getestet. Beide Wege führten zu den gleichen Resultaten. Der static Cache kann ebenfalls in den DevTools eingesehen werden und enthällt alle wichtigen Elemente, wie im Code vorgegeben. Sichtbar in Screenshot **CacheArchitectureStatus.jpg**.

Die drei Szenarien in Abschnitt D wurden durchgearbeitet und es wurden keine großen Fehler oder Probleme festgestellt, bis auf eine besonders lange Ladezeit bei der ersten Verbindung im Offline-Mode (Szenario 3). 

Ergänzend bestätigt der durchgeführte Lighthouse-Audit (Screenshots LighthouseReport_1.jpg bis LighthouseReport_5.jpg) die hohe technische Qualität der PWA mit **100 Punkten** in *Performance* und *Accessibility*, **96 Punkten** in *Best Practices* sowie **90 Punkten** in *SEO*.

Die drei Szenarien aus Abschnitt D wurden vollständig verifiziert: Bei bereits gecachter App (Szenario 1) sowie unter „Mein Programm“ Szenario 2, inklusive offline Entfernen vorgemerkter Sessions aus dem localStorag traten keine Fehler auf. Im Lighthouse-Report ein kleiner Konsolenfehler bei pwa-192x192.png (404) und eine fehlende Meta-Description unter SEO bestehen.



Notes Verifikation Cross review
Szenario 1: Programm ist bereits einmal online geladen worden, dann Flugmodus aktiviert, Session-Übersicht erneut geöffnet:

Online:
![alt text](image-1.png)

Offline:
![alt text](image.png)

Session-Übersicht weiste keine veränderungen auf. Filterfunktionen blieben erhalten.

Szenario 2: Mein Programm" offline geöffnet, nachdem zuvor Sessions hinzugefügt wurden:

Online:
![alt text](<Screenshot 2026-11-25 165650.png>)

Offline:
![alt text](image.png)
MyProgramm behielt nach dem Neuladen der Seite alle Session. Das Entfernen der Sessions hat auch funkioniert ist blieb nach dem Neuladen erhalten.


Szenario 3: Erstbesuch ohne vorheriges Online-Laden im Offline-Zustand (bewusster Grenzfall — was ist hier akzeptables Verhalten und warum?):

Offline Erstaufruf:
Offline und Cache gelöscht
![alt text](image.png)

Seite braucht etwas länger zum laden. Danach funktionieren alle Funktionen, sowohl in der Session übersicht als auch My Programm. 

Ergbenisse stimmen mit Entscheidungsprotokoll überein.

