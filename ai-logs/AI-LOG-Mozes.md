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

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> was mach ich mit der component SearchBar

- **Zweck:** Klären, wie die SearchBar-Komponente in die Übersicht eingebunden werden soll.
- **Antwort:**

> Ich kenne deine `SearchBar`-Komponente nicht, die Datei habe ich bisher nicht gesehen. Sie lässt sich aber vermutlich direkt in die Übersicht einbauen, denn dort gibt es schon ein Suchfeld, das sie ersetzen kann.
>
> **Variante 1: Du willst die SearchBar verwenden.** Entferne in `ConferenceList.vue` den Block `<div class="field search">…</div>` und setze stattdessen deine Komponente ein:
>
> ```vue
> <script setup>
> import SearchBar from './SearchBar.vue'
> // ... Rest bleibt wie bisher
> </script>
>
> <template>
>   <!-- statt des alten Suchfelds -->
>   <SearchBar v-model="filters.query" />
> </template>
> ```
>
> Das klappt, wenn die SearchBar `v-model` unterstützt, also `modelValue` als Prop hat und `update:modelValue` auslöst. Löst sie stattdessen ein eigenes Event aus (z. B. `@search`), nimm:
>
> ```vue
> <SearchBar @search="filters.query = $event" />
> ```
>
> Die Filterung selbst muss dafür nicht geändert werden, denn `filterSessions()` liest `filters.query` ohnehin.
>
> **Variante 2: Du brauchst sie nicht.** Die Anforderung nennt nur Track, Konferenztag und Level. Die Textsuche ist ein Extra von mir. Dann kannst du die SearchBar-Datei weglassen oder löschen, wenn sie nirgends sonst benutzt wird.
>
> **Zum Aussehen:** Wenn die SearchBar eigene Farben hat, passt sie womöglich nicht zu den übrigen Filtern (Rahmen, Dark Mode). Dann kann ich sie dem Rest anpassen.
>
> Schick mir die Datei `SearchBar.vue`, dann baue ich sie passend ein, mit richtigem `v-model` und gleichem Stil. Sag mir dazu, ob sie in der Übersicht oder auch auf anderen Seiten benutzt werden soll, etwa bei den Speakern.

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> gib mir den neuen code für SearchBar.vue und ConferenceList.vue

- **Zweck:** Neue SearchBar-Komponente erstellen und in die Übersicht einbinden.
- **Antwort:**

> Deine bisherige `SearchBar.vue` kenne ich nicht, deshalb schreibe ich sie neu. Sie ist so gebaut, dass sie direkt mit `v-model` funktioniert und zu den anderen Filtern passt. Getestet habe ich beide Dateien nicht, weil ich dein Projekt nicht laufen lassen kann.
>
> **`src/components/SearchBar.vue`**
>
> *(Code von SearchBar.vue, siehe Projektdatei)*
>
> **`src/components/ConferenceList.vue`**
>
> *(Code von ConferenceList.vue, siehe Projektdatei)*
>
> **Was neu ist:**
> - `SearchBar.vue` nutzt `v-model`, hat eine Lupe, einen Löschen-Button (erscheint nur bei Eingabe) und denselben Stil wie die Dropdowns, auch im Dark Mode.
> - In `ConferenceList.vue` ersetzt `<SearchBar v-model="filters.query" />` das alte Suchfeld. Die Filterlogik ist unverändert, `filterSessions()` liest weiter `filters.query`.
> - Die `id` wird per Prop gesetzt, damit Label und Eingabefeld verknüpft bleiben. Willst du die Komponente mehrfach auf einer Seite nutzen, gib jeder eine eigene `id`.
>
> Hattest du bereits eine eigene `SearchBar.vue` mit anderem Verhalten (z. B. Suchen erst bei Enter), schick sie mir, dann baue ich das passend ein.

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> in einen combaseMenu, BaseList

- **Zweck:** Unklare Anforderung klären, bevor Komponenten gebaut werden.
- **Antwort:**

> Ich bin mir nicht sicher, was du mit "combaseMenu, BaseList" meinst, und möchte nicht raten. Was soll ich bauen?
>
> *(Auswahl: 1. Wiederverwendbare Komponenten: BaseMenu (Filter-Dropdown) und BaseList (Session-Liste) aus der Übersicht auslagern, 2. Eine durchsuchbare Combobox statt der normalen Dropdowns, 3. Etwas anderes (ich beschreibe es kurz))*

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> BaseMenu ist wo die searchbar ufilter sind und BAseList ie Compnt

- **Zweck:** Übersicht in die Komponenten BaseMenu (Suche und Filter) und BaseList (Session-Liste) aufteilen.
- **Antwort:**

> Ich habe die Übersicht in drei Teile aufgeteilt, so wie du es beschrieben hast:
> - `BaseMenu.vue`: Suchleiste, Filter, Trefferanzahl und "Filter zurücksetzen"
> - `BaseList.vue`: die Session-Liste nach Tagen, mit leerem Zustand
> - `ConferenceList.vue`: die Seite, die beides verbindet
>
> Ich habe die Übersicht in `BaseMenu.vue`, `BaseList.vue` und eine schlankere `ConferenceList.vue` aufgeteilt. Getestet habe ich das nicht, weil ich dein Projekt nicht laufen lassen kann. Das Aussehen sollte unverändert bleiben.
>
> **Wer macht was:**
> - **`BaseMenu.vue`:** Suchleiste (deine `SearchBar`), die Dropdowns für Track, Tag, Level und Format sowie die Trefferanzahl "x von 20 Sessions" und "Filter zurücksetzen". Die Filterwerte kommen per `v-model` herein. Bei jeder Änderung schickt die Komponente ein neues Objekt zurück, sie verändert das Objekt der Seite also nicht selbst.
> - **`BaseList.vue`:** Nimmt die schon gefilterten und nach Tag gruppierten Sessions entgegen und zeigt sie an, mit Zeit, Titel-Link, Speakern, Badges und Raum. Gibt es keine Treffer, zeigt sie den Hinweis "Keine Sessions gefunden" mit Zurücksetzen-Link.
> - **`ConferenceList.vue`:** Holt die Daten aus `useConferenceData()`, wendet `filterSessions()` an (UND-Verknüpfung), gruppiert mit `groupSessionsByDay()` und reicht das Ergebnis an die beiden Komponenten weiter. Die Seitenüberschrift "Programm" und der Rahmen bleiben hier.
>
> `BaseMenu` zeigt die Dropdowns anhand einer kleinen Liste statt vier einzelner Blöcke, und alle Optionen kommen als `{ value, label }`. Dadurch ist die Komponente nicht an die Konferenzdaten gebunden. Tag-Beschriftungen wie "Dienstag, 15. September 2026" erzeugt die Seite, deshalb gibt es `formatDay` nur noch einmal.
>
> `SearchBar.vue` bleibt unverändert, die Version von vorhin passt weiter. Alle drei Dateien liegen direkt in `src/components/`. Die Namen `BaseMenu` und `BaseList` habe ich übernommen, wie du sie genannt hast.
>
> Wenn du mit "BaseMenu" etwas anderes gemeint hast, zum Beispiel eine Navigation oder ein Aufklapp-Menü, sag mir kurz Bescheid, dann baue ich es um.

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> ist asd as eine bessere implementierung?

- **Zweck:** Bewerten, ob die Aufteilung in BaseMenu und BaseList besser ist als die einteilige Version.
- **Antwort:**

> Teilweise. Besser ist die Aufteilung vor allem, wenn du die Teile an mehreren Stellen brauchst, sonst ist sie nur anders organisiert.
>
> **Was für die Aufteilung spricht:**
> - **Wiederverwendung:** `BaseList` kann später in `MyProgram.vue` oder auf der Speaker-Seite dieselben Session-Zeilen anzeigen, ohne dass du das Markup kopierst.
> - **Übersichtlichkeit:** `ConferenceList.vue` besteht nur noch aus Datenlogik und Verdrahtung. Aussehen und Filterbedienung stehen in je einer eigenen Datei.
> - **Teamarbeit:** Ihr könnt an Filter und Liste getrennt arbeiten, ohne euch in dieselbe Datei zu schreiben.
>
> **Was dagegen spricht:**
> - **Mehr Code für dieselbe Funktion:** Props und Events (`v-model`, `reset`) sind zusätzlicher Aufwand. Für 20 Sessions und eine Seite war die einteilige Version einfacher zu lesen.
> - **Wiederholte Farbdefinitionen:** Jede Komponente hat ihren eigenen Block mit `--c-bg`, `--c-text` und so weiter. Das ist mit mehr Dateien eher schlechter geworden, denn eine Farbänderung müsstest du an vier Stellen nachziehen. Sauberer wäre, diese Variablen einmal global zu definieren, etwa in der `style.css`.
> - **Die Namen stimmen nicht ganz:** "Base"-Komponenten sind üblicherweise allgemeine Bausteine ohne Fachbezug (z. B. `BaseButton`). `BaseList` kennt aber die Struktur einer Session, und `BaseMenu` ist ein Session-Filter. Passender wären `SessionList` und `FilterMenu`. Wenn eure Aufgabe die Namen vorgibt, bleibt es natürlich bei `BaseList` und `BaseMenu`.
>
> Ich habe die aufgeteilte Version außerdem nicht im Browser getestet, die einteilige lief bei dir schon.
>
> Wenn es um Wiederverwendung geht (vor allem `MyProgram`), bleib bei der Aufteilung und lass uns die Farbvariablen zentralisieren. Wenn die Übersicht nur auf einer Seite vorkommt und niemand etwas daraus wiederverwendet, ist die einteilige Version einfacher und reicht völlig. Soll ich dir die Variablen in die `style.css` ziehen und die Namen anpassen?

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> hast du den code in conference list auch verändert?

- **Zweck:** Nachvollziehen, was sich an ConferenceList.vue durch die Aufteilung geändert hat.
- **Antwort:**

> Ja, `ConferenceList.vue` ist komplett verändert, nicht nur in Details. Ich habe sie ersetzt. Das habe ich oben mit "eine schlankere `ConferenceList.vue`" nur knapp erwähnt.
>
> **Script:**
> - `reactive` ist jetzt `ref`. Statt einzelne Felder zu ändern, wird das ganze Filterobjekt ersetzt (`filters.value = …`), weil `BaseMenu` immer ein neues Objekt zurückschickt.
> - Entfernt, weil es jetzt in den Komponenten steckt: `hasFilters` (in `BaseMenu`), `speakerNames` (in `BaseList`) und der `RouterLink`-Import (in `BaseList`).
> - Neu: Die Dropdown-Optionen werden zu `{ value, label }` umgebaut (`trackOptions`, `dayOptions`, `levelOptions`, `formatOptions`). Außerdem bekommt jede Tagesgruppe ihr Label (z. B. "Dienstag, 15. September 2026") mit.
> - Unverändert: `useConferenceData()`, `filterSessions()` (UND-Verknüpfung), `groupSessionsByDay()` und `formatDay`.
>
> **Template:**
> - Das gesamte Markup für Suche, Dropdowns, Trefferanzahl, Liste und leeren Zustand ist raus. Stattdessen stehen dort nur noch `<BaseMenu>` und `<BaseList>`.
> - Die Überschrift "Programm" ist geblieben.
>
> **Style:**
> - Fast alles ist in die beiden neuen Komponenten gewandert. In `ConferenceList.vue` bleiben nur der Rahmen der Seite (Breite, Hintergrund, Rand) und der Seitentitel.
>
> Die Funktion sollte gleich bleiben (Filter, Suche, Gruppierung, Zurücksetzen), und ich habe versucht, das Aussehen zu erhalten. Getestet habe ich es aber nicht, weil ich dein Projekt nicht laufen lassen kann. Prüf bitte kurz im Browser, ob alle vier Dropdowns, die Suche und das Zurücksetzen noch so reagieren wie vorher.
>
> Wenn du die Version von vor der Aufteilung zurückhaben willst, hast du sie noch in meiner Antwort mit `SearchBar.vue` und `ConferenceList.vue`. Dann kannst du `BaseMenu.vue` und `BaseList.vue` einfach löschen.

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:**

> ah die searchbar.vue fehlt

- **Zweck:** Fehlende SearchBar.vue als Datei bereitstellen.
- **Antwort:**

> Stimmt, die Datei hatte ich nur im Chat gezeigt und nicht als eigene Datei angelegt. Hier ist `SearchBar.vue`. Der Inhalt ist derselbe wie vorhin.
>
> Sie gehört nach `src/components/SearchBar.vue`, neben `BaseMenu.vue`, `BaseList.vue` und `ConferenceList.vue`. `BaseMenu.vue` importiert sie über `./SearchBar.vue`, deshalb müssen beide im selben Ordner liegen. Ohne diese Datei bricht Vite mit einem Importfehler ab.
>
> Die Komponente funktioniert mit `v-model`, zeigt eine Lupe und blendet bei Eingabe einen Löschen-Button ein. Getestet habe ich sie nicht, weil ich dein Projekt nicht laufen lassen kann.

### Eintrag
- **Datum:** 08.11.2026
- **Tool:** Claude (Claude Sonnet 5.5)
- **Prompt:** Der Menüpunkt „My Program" fehlt, er war vorher da und wurde beim Umbau der Übersicht entfernt. Er soll im Header stehen. Dazu: Die Komponente `Header.vue` ist noch leer, und nach dem Einbinden in `App.vue` ändert sich auf der Seite nichts.
- **Zweck:** Einen globalen Header mit Navigation (Sessions, My Program) anlegen, in `App.vue` einbinden und klären, warum er zunächst nicht angezeigt wurde.
- **Antwort:** Claude erklärte, dass der Link beim Umbau der Übersichtsseite entfernt wurde, und empfahl, ihn in die globale Navigation im Header zu setzen, damit er auf jeder Seite erreichbar ist. Claude erstellte `Header.vue` (beerenroter Balken mit „VibeConnect" und den Links, mit den Design-Tokens und Dark Mode) und passte `App.vue` an (`<Header />` über `<RouterView />`, nicht mehr benötigte Styles entfernt). Die Links nutzen direkte Pfade (`/` und `/program`) statt Routennamen. Bei der Fehlersuche ergab sich, dass Änderungen den Browser nicht erreichten. Mit Testtexten in `App.vue` und `Header.vue` wurde das geprüft, und danach waren beide sichtbar. Der Fehler lag nicht im Code, sondern an einem veralteten Stand der Anzeige. Zum Schluss sollten die Testtexte entfernt und der Link in `ConferenceList.vue` gelöscht werden, damit „My Program" nicht doppelt erscheint.