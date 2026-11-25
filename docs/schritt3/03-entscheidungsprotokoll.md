# Entscheidungsprotokoll

## Optionen

## Entscheidungen

## Szenarien

### 1: Programm ist bereits einmal online geladen worden, dann Flugmodus aktiviert, Session-Übersicht erneut geöffnet

**Aktion:**
Nach dem Online-Laden der Seite wurde der Flugzeug-Modus aktiviert. Die Seite wurde neu geladen mit F5

**Verhalten:**

Website läd sehr schnell nach und sieht nach dem Reload genau so aus wie vorher. Alle Daten der Sessions und der Speaker werden korrekt angezeigt und die Filtersysteme funktionieren ebenso. Links zu den einzelnen Sessions sind funktionstüchtig, sowie die Links zu den jeweiligen Speakern.

### 2: "Mein Programm" offline geöffnet, nachdem zuvor Sessions hinzugefügt wurden

**Aktion:**
Seite Offline geöffnet und drei Sessions zu "Mein Programm" hinzugefügt, dann "Mein Programm geöffnet"

**Verhalten:**

"Mein Programm" öffnet wie erwartet und zeigt zu Beginn eine leere Liste an. Nach dem Hinzufügen von drei Sessions werden diese wie geplant gespeichert und scheinen in "Mein Programm" auch auf. Selbst wenn die Website neu geladen wird bleiben die Sessions bestehen.

### 3: Erstbesuch ohne vorheriges Online-Laden im Offline-Zustand (bewusster Grenzfall - was ist hier akzeptables Verhalten und warum?)

**Aktion:**
Browser Cache gelöscht und Seite im Offline-Modus geöffnet.

**Verhalten:**

Nach öffnen der Seite gab es eine längere Ladezeit, ungefähr 3-4 Sekunden. Nach dieser Zeit öffnete sich die Seite mit der korrekten Visualisierung wie sie auch im Online-Zustand vorhanden ist. Alle Daten der Sessions und der Speaker sind korrekt und vorhanden, "Mein Programm" und das hinzugfügen von Sessions ist möglich und die Filterfunktionen sind ebenfalls nicht negativ betroffen.
