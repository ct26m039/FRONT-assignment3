## Specifications
Model used: Gemini

### Eintrag
- **Datum:** 2026-11-08
- **Tool:** Gemini
- **Prompt:** "erkläre mir alle rendering optionen"
- **Zweck:** Verständnis und theoretische Aufarbeitung der verschiedenen Rendering-Strategien (CSR, SSR, SSG, ISR, Islands Architecture) inklusive Vor- und Nachteilen zur fundierten Entscheidungsfindung im Architecture Decision Record (ADR).
- **Antwort:**
Hier ist eine verständliche Übersicht aller gängigen Rendering-Strategien in der Webentwicklung – von „alles im Browser“ bis zu modernen Hybrid-Ansätzen:

1. CSR (Client-Side Rendering)
Wie es funktioniert: Der Server schickt dem Browser nur eine fast leere HTML-Datei (oft nur <div id="app"></div>) und ein JavaScript-Bundle. Der Browser lädt das Skript herunter, führt es aus, holt sich ggf. Daten per API und baut die Seite erst im Browser des Nutzers zusammen (typisch für klassische Vue-, React- oder Angular-SPAs).

Vorteile: Sehr flüssige Übergänge nach dem ersten Laden (App-Feeling, kein Neu-Laden der Seite beim Klick).
Geringe Serverkosten: Der Server liefert nur statische Dateien aus.

Nachteile: Längere initiale Wartezeit (Nutzer sieht erst einen weißen Bildschirm, bis JS geladen und ausgeführt ist).
Schlechter für SEO (Suchmaschinen-Crawler sehen anfangs leeres HTML, auch wenn Google etwas JS ausführen kann).

2. SSR (Server-Side Rendering)
Wie es funktioniert: Bei jedem einzelnen Klick/Aufruf einer URL baut der Webserver die Seite on-the-fly zusammen: Er holt die Daten aus der Datenbank, generiert das fertige HTML und schickt es an den Browser. Anschließend lädt der Browser JavaScript nach, um die Seite interaktiv zu machen (Hydration).

Vorteile: Sehr gut für SEO: Crawler bekommen sofort vollständigen Text und Links.
Schneller erster visueller Eindruck (First Contentful Paint), da fertiges HTML ankommt.
Immer tagesaktuelle/minutengenaue Daten (z. B. personalisierte Dashboards, Live-Feeds).

Nachteile: Hohe Serverlast: Bei 10.000 gleichzeitigen Aufrufen muss der Server 10.000 Mal die Seite neu berechnen.
Höhere Latenz zum ersten Byte (Time to First Byte), weil der Server erst arbeiten muss, bevor er antwortet.

3. SSG (Static Site Generation)
Wie es funktioniert: Alle HTML-Seiten werden vorab beim Build-Prozess (beim Ausführen von npm run build bzw. Deployment) generiert. Für jede URL liegt danach eine fertige .html-Datei auf der Festplatte. Diese wird über ein weltweites CDN (Content Delivery Network) ausgeliefert.

Vorteile:Extrem schnell: Dateien liegen fertig vor und müssen nur übertragen werden.
Maximale Ausfallsicherheit und minimale Kosten (kein laufender Node.js-Server nötig).
Perfekt für SEO.

Nachteile: Unflexibel bei Änderungen: Ändert sich ein Text, muss die gesamte Website (oder zumindest Teile) neu gebaut und deployt werden.
Schlecht für nutzerspezifische/dynamische Daten (z. B. Benutzerprofil mit Login).

4. ISR (Incremental Static Regeneration)
Wie es funktioniert: Ein Mittelweg aus SSG und SSR (bekannt geworden durch Next.js/Nuxt). Die Seiten werden statisch ausgeliefert (wie bei SSG). Wird eine Seite aufgerufen, deren Gültigkeitsdauer (z. B. 60 Sekunden) abgelaufen ist, liefert das System zunächst noch den alten Cache aus, baut die Seite aber im Hintergrund auf dem Server neu und aktualisiert den Cache für zukünftige Besucher.

Vorteile:Schnelligkeit von SSG kombiniert mit der Frische von SSR.
Große Websites (z. B. Online-Shops mit 100.000 Produkten) müssen beim Deployment nicht komplett gebaut werden; Seiten können bei Bedarf schrittweise entstehen.

Nachteile:Komplexere Infrastruktur (erfordert Node.js-Runtime oder spezialisierte Hosts wie Vercel/Netlify).
Der erste Nutzer nach Ablauf der Zeit sieht eventuell noch veraltete Daten (stale-while-revalidate).

