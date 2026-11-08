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


### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> ich habe folgende übersichtseite:
>
> ```vue
> <script setup lang="ts">
> import { RouterLink } from 'vue-router';
> import conferences from '../assets/data/conference-data.json';
>
> const sessions = conferences.sessions;
> </script>
>
> <template>
>     <div>
>         <RouterLink to="/program">Your Program</RouterLink>
>     </div>
>     <div>
>         <ul>
>             <li v-for="session in sessions" :key="session.id">
>                 <RouterLink :to="`/sessions/${session.id}`">{{ session.title }}</RouterLink>
>             </li>
>         </ul>
>     </div>
> </template>
>
> <style scoped>
>     li {
>         list-style-type: none;
>         margin: 10px;
>         color: #2d2d2d;
>     }
> </style>
> ```

- **Zweck:** Übersichtsseite (ConferenceList.vue) im gleichen Stil wie die Detailseite gestalten.
- **Antwort:**

> Du hast nichts dazugeschrieben, ich bin deshalb davon ausgegangen, dass die Übersicht optisch zur Detailseite passen soll. Ich habe `ConferenceList.vue` im gleichen Stil neu gebaut, aber noch nicht in deinem Projekt getestet.
>
> **Neu gegenüber deiner Version:**
> - Die Sessions sind nach Tag gruppiert (Überschrift z. B. "Dienstag, 15. September 2026") und nach Uhrzeit sortiert.
> - Jede Zeile zeigt Uhrzeit, den Titel als Link zur Detailseite, die Speaker, ein Track-Badge und den Raum mit Icon.
> - Die Daten kommen weiterhin aus deiner `conference-data.json`, Track, Raum und Speaker löse ich direkt in der Komponente auf.
> - Das feste `color: #2d2d2d` ist weg. Hintergrund und Text werden gemeinsam gesetzt, damit im Dark Mode nichts mehr hell auf hell steht.
> - Farben, Badges und Linien sind dieselben wie in `Conference.vue`: Tokens, wo es sie gibt, und die gleichen vier Werte ohne Token direkt im Style-Block.
>
> Dein Link `/program` führt ins Leere, denn deine Route heißt `/my-program`. Ich habe den Link entfernt, weil `App.vue` bereits "Mein Programm" in der Navigation hat. Willst du ihn zusätzlich hier haben, füge `<RouterLink to="/my-program">Mein Programm</RouterLink>` wieder ein.
>
> Der Import `'../assets/data/conference-data.json'` ist unverändert. Passt dein Pfad, ersetze einfach die Datei. Bei TypeScript-Fehlern zum JSON-Import prüfe, ob in `tsconfig.app.json` `"resolveJsonModule": true` steht.
>
> Die Zeilen zeigen noch keinen Herz-Button zum Speichern in "Mein Programm". Das kann ich ergänzen, wenn dein Kollege `useMyProgram` fertig hat. Dann brauche ich nur die Namen der Funktionen (bei der Detailseite sind es `isSaved` und `toggleSession`).

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> und useConferenceData.js
>
> *(Datei useConferenceData.js angehängt)*

- **Zweck:** Übersichtsseite an die gemeinsame Composable des Kollegen anbinden.
- **Antwort:**

> Danke, das ist hilfreich. Die Composable löst Track, Raum und Speaker schon auf (`session.track`, `session.room`, `session.speakers`) und kann nach Tag gruppieren. Meine Übersicht hat das bisher selbst nachgebaut. Ich stelle sie jetzt auf die Composable um, damit es keine doppelte Logik gibt.
>
> Ich habe `ConferenceList.vue` auf die Composable deines Kollegen umgestellt. Getestet habe ich es nicht, weil ich dein Projekt nicht laufen lassen kann.
>
> **Was sich geändert hat:**
> - Die Übersicht holt sich die Sessions über `groupSessionsByDay()` aus `useConferenceData`. Die eigene Sortier- und Lookup-Logik ist weg.
> - Track, Raum und Speaker kommen direkt aus dem aufgelösten Session-Objekt (`session.track?.name`, `session.room?.name`, `session.speakers`).
> - Der JSON-Import in der Komponente entfällt, die Daten kommen nur noch aus der Composable.
> - Das Aussehen ist unverändert.
>
> Das Script ist jetzt reines JavaScript, ohne `lang="ts"`, genau wie bei `Conference.vue`. Die Composable ist eine `.js`-Datei, und aus TypeScript heraus kann der Import sonst Typfehler auslösen (z. B. beim Build mit `vue-tsc`). Wenn du in der Übersicht lieber TypeScript behalten willst, melde dich, dann ergänze ich die Typen.
>
> Dein Kollege hat auch die Funktionen für `Conference.vue` passend gebaut. `getSessionById` und `getParallelSessions` existieren, und beide liefern `track`, `room` und `speakers` als Objekte. Die Detailseite sollte damit direkt funktionieren.
>
> Die Composable bringt noch mehr mit, was zu eurer App-Idee passt: `filterSessions` (Suche nach Titel, Abstract und Speaker plus Filter nach Track, Tag, Level und Format) und `filterOptions` für Dropdowns. Sagt Bescheid, wenn ich oben in der Übersicht eine Such- und Filterleiste im gleichen Stil ergänzen soll, oder einen Herz-Button pro Zeile für "Mein Programm", denn `isSaved` und `toggleSession` kenne ich ja schon aus der Detailseite.

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> aber d filter option sind noch nciht implementiert wie implenetiere ich das

- **Zweck:** Such- und Filterfunktion in die Übersichtsseite einbauen.
- **Antwort:**

> Das geht ohne viel Aufwand, denn die Composable deines Kollegen liefert dafür schon alles: `filterSessions()` für Suche und Filter und `filterOptions` für die Dropdown-Werte. Ich baue die Filterleiste jetzt in die Übersicht ein.
>
> Ich habe `ConferenceList.vue` um Suche und Filter erweitert. Getestet habe ich es nicht, weil ich dein Projekt nicht laufen lassen kann. Ersetze einfach die Datei, du musst nichts weiter anpassen.
>
> **Was jetzt möglich ist:**
> - **Suche:** über Titel, Beschreibung und Speaker-Namen.
> - **Dropdowns:** Track, Tag, Level und Format. Die Werte kommen aus `filterOptions` der Composable, bleiben also automatisch aktuell, wenn sich die Daten ändern.
> - **Kombination:** Alle Filter wirken zusammen, zum Beispiel "Fortgeschritten" im Track "Rendering & Performance" am zweiten Tag.
> - **Trefferanzahl** ("5 von 20 Sessions") und ein Link **"Filter zurücksetzen"**, der nur erscheint, wenn etwas gefiltert ist.
> - **Leerer Zustand** mit Hinweis, wenn nichts passt.
> - Jede Zeile zeigt zusätzlich Level und Format als Badges, damit man sieht, wonach gefiltert wurde.
>
> **So funktioniert es technisch:** Die Filterwerte liegen in einem `reactive`-Objekt (`filters`). Das Ergebnis von `filterSessions(filters)` wird mit `groupSessionsByDay()` wieder nach Tagen gruppiert. Weil beides `computed` ist, aktualisiert sich die Liste sofort bei jeder Eingabe.
>
> Der Rahmen der Eingabefelder hat einen eigenen Grauton (`#8a8a8a`), weil der helle Linienton (`#dedede`) für Formularfelder zu wenig Kontrast hätte. Er steht wie die anderen Werte ohne Token im Block "Kein Token vorhanden".
>
> Als Nächstes würde der Herz-Button pro Zeile für "Mein Programm" passen. Dafür bräuchte ich nur kurz bestätigt, dass `useMyProgram` weiterhin `isSaved` und `toggleSession` liefert.

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> hier ist die genaue anforderung: Alle 20 Sessions, filterbar nach Track, Konferenztag, Level — Filter kombinierbar (UND-Verknüpfung). useConferenceData() aus Schritt 1 tatsächlich implementieren (nicht mehr nur Konzept), Rendering-Entscheidung aus A für diesen Teil umsetzen. Deliverable: lauffähige, filterbare Übersichtsseite + kurzer README-Bezug zur Rendering-Entscheidung.

- **Zweck:** Stand gegen die Anforderung prüfen und einen README-Bezug zur Rendering-Entscheidung entwerfen.
- **Antwort:**

> Ich habe die Anforderung gegen den Stand geprüft. Zu den Details muss ich noch eine Frage klären, die steht unten.
>
> **Was erfüllt ist:**
> - **Alle 20 Sessions:** Die Übersicht zeigt standardmäßig alle Sessions (Anzeige "20 von 20 Sessions"), nach Tag gruppiert.
> - **Filter nach Track, Konferenztag und Level:** Alle drei sind als Dropdowns vorhanden.
> - **UND-Verknüpfung:** `filterSessions()` in der Composable prüft jedes gesetzte Kriterium mit `&&`. Leere Filter werden ignoriert, mehrere gesetzte Filter müssen alle zutreffen.
> - **`useConferenceData()` implementiert:** Das hat dein Kollege geliefert, und die Übersicht nutzt es jetzt tatsächlich (`filterSessions`, `groupSessionsByDay`, `filterOptions`).
>
> Zusätzlich gibt es eine Textsuche und einen Format-Filter, die in der Anforderung nicht stehen. Sie stören die UND-Logik nicht. Wenn ihr sie nicht wollt, entfernst du in `ConferenceList.vue` das Suchfeld und das Format-Dropdown aus dem Template. Die Composable muss dafür nicht angefasst werden.
>
> Für den README-Teil habe ich einen Entwurf geschrieben, der beschreibt, wie die Übersicht tatsächlich gerendert wird:
>
> Den README-Abschnitt habe ich als `README-Rendering.md` geschrieben. Er ist kurz gehalten und passt zu dem, was im Code tatsächlich passiert: Client-Side Rendering einer Vue-SPA mit statischen Daten, Filterung im Browser, UND-Verknüpfung über `filterSessions()`.
>
> Eine Stelle ist bewusst offen, weil ich deine Rendering-Entscheidung aus Aufgabe A nicht kenne. Sie steht in eurem Material nicht drin, und ich will sie nicht erfinden. Oben im README steht ein Platzhalter für den Satz mit dem Bezug zu A. Auch die Begründung weiter unten stammt von mir aus dem Code und nicht aus eurer Dokumentation. Wenn du mir sagst, wie die Entscheidung in A lautet (z. B. CSR, SSR oder SSG) und was ihr als Begründung genannt habt, setze ich sie ein und gleiche die Begründung an. Falls A etwas anderes als Client-Side Rendering ergeben hat, müssten wir den Abschnitt ändern, denn die jetzige Umsetzung ist reines CSR.
>
> Ob die Seite bei dir läuft, kann ich nicht prüfen, ich habe dein Projekt nicht gestartet. Teste die Anforderung am besten kurz selbst. Mit allen Filtern auf "Alle" siehst du "20 von 20 Sessions", und wenn du Track, Tag und Level zusammen setzt, bleibt nur übrig, was alle drei erfüllt (z. B. Rendering & Performance, 15.09., Experte → nur die Session über Partial Hydration).

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> lass das read.me und gib mir den code

- **Zweck:** Vollständigen Code der Übersichtsseite mit Filtern zum Übernehmen erhalten.
- **Antwort:**

> Hier ist der komplette Code für `src/components/ConferenceList.vue`. Ersetze damit deine bisherige Datei:
>
> *(Code von ConferenceList.vue, siehe Projektdatei)*
>
> Die Datei `README-Rendering.md` kannst du einfach ignorieren oder löschen, sie gehört nicht zu deinem Projekt, solange du sie nicht selbst hineinkopierst.