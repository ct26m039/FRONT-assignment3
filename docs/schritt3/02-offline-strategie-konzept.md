# **Offline-Strategie Konzeptdokument**

## Caching-Strategien

Nicht jede Art von Daten ist für jede Strategie geeignet. Bei unterschiedlichen Datentypen gelten bestimmte Voraussetzungen, welche die Entscheidung der Caching-Strategie beeinflussen können. In der VibeConnect App gibt es drei spezielle Datentype die dafür in Frage kommen und für genau diese muss es auch passende Caches geben.

### Session-/Speaker-Daten

Die Daten der Sessions bzw. der einzelnen Speaker sind der wichtigste Teil der App und somit müssen sie immer verfügbar sein, unabhängig von der Internetverbindung des Users. Ihre wichtigste Eigenschaft ist, dass sich die Daten nach Programmveröffentlichung in der Regel nicht mehr verändern. Ebenfalls kommen sie aus einer externen API, der conference-data.json Datei, welche alle Sessions und Speaker aufgelistet.

Für die Session-/Speaker-Daten ist eine “Cache First” Strategie völlig ausreichend. Die Informationen sind in einer statischen JSON Datei gespeichert und Änderungen an der Datei werden mit einem simplen Neuladen wiederholt. Bei den Session-Daten gibt es jedoch einige Punkte, in denen veraltete Daten gefährlich werden können, beispielsweise der Raum oder die Zeit. 

### “Mein Programm”

Im Reiter “Mein Programm” befinden sich die gespeicherten Konferenzen des Users, basierend auf den Session- und Speaker-Daten aus der großen Liste. Diese werden bereits clientseitig über das Local Storage gespeichert und sind von User zu User stark unterschiedlich.

VibeConnect wird voraussichtlich in Konferenzsälen eingesetzt, eine stabile und fehlerfreie Internetverbindung ist also nicht garantiert. Um dieses Problem zu beheben und gleichzeitig keine unnötigen Wartezeiten für den User zu erzeugen, ist die “Stale-While-Revalidate” Strategie hier am sinnvollsten.  Diese kombiniert die Schnelligkeit von “Cache First” mit den Vorteilen von “Network First” und ist somit gegen schlechte Verbindung oder Funklöcher abgesichert. Das einzig neue Problem das auftaucht ist, dass der User unter speziellen Umständen veraltete Daten sieht, sollte sich etwas geändert haben, während der User keine Internetverbindung hatte.

### Statische Assets

Statische Assets umfassen alle Daten, die einmalig geladen werden und sich nie verändern werden. Elemente wie Logos, Fonts, Icons und weitere visuelle Assets sind fest im Design der App verankert und müssen nicht extern angefordert werden.

Die “Cache First” Strategie ist für solche Daten besonders gut geeignet. Das Aussehen der App wird sich mit Ausnahme von großen Design-Updates nicht besonders stark oder häufig verändern. Die Logos bleiben an derselben Stelle, Fonts und Icons ebenso und große Elemente wie Footer oder Header bleiben an den vorgefertigten Positionen. Mit “Cache First” sind solche Daten schnellstmöglich für den User sichtbar, ohne vorher auf eine Netzwerkverbindung warten zu müssen, die im schlimmsten Fall sogar komplett ausfällt.