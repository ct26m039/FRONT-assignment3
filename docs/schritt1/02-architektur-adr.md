# ADR-Architektur01

## Status

Open

## Datum

17.10.2026

## Kontext      

Das Project "VibeConnect" ist eine größere Webanwendung, die es den Nutzern ermöglicht, Konferenzen zu planen und zu organisieren. 
Dementsprechend ist eine saubere Architektur und klare Aufteilung der Komponenten wichtig, um die Effizienz und Skalierbarkeit der Anwendung zu gewährleisten.

Während unseres Teamgesprächs haben wir folgende Anforderungen evaluiert:
- Ordnerstuktur: Eine simple und leicht verständliche Struktur, die das Arbeiten erleichtert und die Komponenten besser organisiert.
- Kompoentenschicht: Eine Aufteilung der einzelnen Komponenten in Basiskomponenten, Feature Komponenten und Layout Komponenten.
- Generelle Headless-Aufteilung: Kleinere Logik muss nicht umbedingt in Composables stehen. Für simple Funkionen reicht eine lokale Logik.

## Entscheidung

Folgende Architektur entscheiden wir uns für:
- Headless-Aufteilung: Composables für die Local Storage und die Konferenzdaten. Kleinere Logik findet in dem Komponenten statt.
- Klare Architektur: Vier Ordner mit klarer Aufteilung, Auslagerung wenn möglich
- Erweiterbare Struktur: Ausbaufähig und gute Skalierbarkeit, falls während der Entwicklung neue Komponenten benötigt werden

## Betrachtete Alternativen

### Volle Logik Auslagerung
- Vorteile: Komponenten bleiben JavaScript/TypeScript-frei, klare Aufteilung
- Nachteile: Jede Funktion benötigt eine eigenen Datei, schnell unübersichtlich
- Warum abgelehnt: Leichteres Zurrechtfinden im Projekt, gewohnte Arbeitsweise für das Team

### Feature Based Architektur
- Vorteile: Skalierbarkeit besser, Änderungen bleiben Lokal
- Nachteile: Viele Ordner, große Strukturen. Für ein Projekt in dieser größe schlicht zu viel
- Warum abgelehnt: Zu groß gedacht für die Teamgröße, Typ-basierte Architektur ist einfacher und macht mehr Sinn

## Konsequenzen

### Positiv
- Übersichtlichkeit: Wenige Ordner, klar benannte Dateinamen
- Vertraute Umgebung: Gewohnte Arbeitsweise für das Team
- Testbarkeit: große Logik wird ausgelagert, kann leichter getestet werden

### Negativ
- Logik in Komponenten: Testbarkeit könnte schwieriger werden, wenn die Logik zu groß wird
- Abhängigkeiten: Komponenten könnten in die falsche Richtung verweisen (Base Komponent importiert Feature Code)

### Risiken
- Skalierbarkeit: Möglicherweise zu unübersichtlich, wenn die Anzahl der Komponenten wächst
- Logik: Composables können sehr schnell sehr groß werden