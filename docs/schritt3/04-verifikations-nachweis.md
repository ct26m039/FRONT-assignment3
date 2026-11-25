# Verifikationsnachweis

Die Installation und Registrierung des Service Workers war erfolgreich, sw.js wird generiert und ausgeführt. Sichtbar in Screenshot **"ServiceWorkerRegistration.jpg"**. Das Web Manifest ist wurde erstellt und alle eingegebenen Daten sind vorhanden, so wie sie in den Tokens definitert sind. Start-URL ist /FRONT-assignment3/ und display ist standalone wie gefordert. Sichbar in Screenshot **"WebManifest.jpg"**

Offline-Funktionalität ist gegeben, die App kann offline laden und ist voll  funktionstüchtig. Es bestehen keine großen Unterschiede zwischen der Online und Offline Version, vergleich in DevTools ist sichtbar in Screenshots **"OfflineMode.jpg"** und **NetworkTabOnlineMode.jpg**. Ebenfalls wurde die Funktionalität mit den DevTools sowie dem Flugmodus des Rechners getestet. Beide Wege führten zu den gleichen Resultaten. Der static Cache kann ebenfalls in den DevTools eingesehen werden und enthällt alle wichtigen Elemente, wie im Code vorgegeben. Sichtbar in Screenshot **CacheArchitectureStatus.jpg**.

Die drei Szenarien in Abschnitt D wurden durchgearbeitet und es wurden keine großen Fehler oder Probleme festgestellt, bis auf eine besonders lange Ladezeit bei der ersten Verbindung im Offline-Mode (Szenario 3). 

Verifikation Cross review
Szenario 1: Programm ist bereits einmal online geladen worden, dann Flugmodus aktiviert, Session-Übersicht erneut geöffnet:

Online:
![alt text](image-1.png)

Offline:
![alt text](image.png)

Szenario 2: Mein Programm" offline geöffnet, nachdem zuvor Sessions hinzugefügt wurden:

Szenario 3: Erstbesuch ohne vorheriges Online-Laden im Offline-Zustand (bewusster Grenzfall — was ist hier akzeptables Verhalten und warum?: