# ADR-1026: Technologie
## Status

Open

## Datum

2026-10-17

## Kontext

Unsere Plattform ist im letzten Jahr von 3 auf 12 Microservices
gewachsen. Services kommunizieren derzeit synchron über HTTP-REST-Aufrufe.
Dies verursacht mehrere Probleme:

- Kaskadierende Ausfälle: Wenn der Inventory Service nicht verfügbar
  ist, kann der Order Service keine Bestellungen verarbeiten, obwohl
  Bestandsprüfungen eventual sein könnten.
- Enge Kopplung: Services müssen die API-Verträge und Endpoints der
  anderen kennen.
- Performance-Engpässe: Einige Operationen lösen Ketten von 4-5
  synchronen Aufrufen aus, was die Latenz erhöht.

Wir verarbeiten ungefähr 100.000 Events pro Tag. Wir erwarten, dass
dies innerhalb von 12 Monaten auf 500.000 ansteigen wird. Das Team hat
8 Backend-Ingenieure, von denen 2 vorherige Kafka-Erfahrung haben.

## Entscheidung

Wir werden Apache Kafka als primären Mechanismus für asynchrone
Inter-Service-Kommunikation einführen. Synchrones HTTP bleibt für
Request/Response-Muster bestehen, bei denen der Aufrufer ein sofortiges
Ergebnis benötigt (z. B. Authentifizierungsprüfungen).

Wir werden Confluent Cloud als verwalteten Kafka-Anbieter verwenden,
um den operativen Aufwand zu minimieren.

## Betrachtete Alternativen

### RabbitMQ
- Vorteile: Einfacher zu betreiben, geringere Lernkurve, unterstützt
  mehrere Messaging-Patterns (Pub/Sub, Point-to-Point, Routing).
- Nachteile: Weniger geeignet für Event-Sourcing-Patterns, die wir
  einführen möchten. Schwächere Replay/Rewind-Fähigkeiten. Community-
  Momentum hat sich bei Event-Driven Architectures zu Kafka verlagert.
- Warum abgelehnt: Wir erwarten, Event Replay für Audit und Debugging
  zu benötigen. Kafkas log-basierte Architektur ist dafür besser geeignet.

### AWS SQS + SNS
- Vorteile: Vollständig verwaltet, keine Infrastruktur zu pflegen,
  enge AWS-Integration.
- Nachteile: Vendor Lock-in zu AWS. Begrenzte Garantien für
  Nachrichtenreihenfolge. Kein eingebautes Stream Processing
  (würde Kinesis oder Lambda erfordern). Höhere Kosten pro Nachricht
  bei unserem prognostizierten Volumen.
- Warum abgelehnt: Wir wollen die Abhängigkeit von AWS nicht vertiefen,
  und wir brauchen geordnete Nachrichtenzustellung für Finanzereignisse.

### Synchrones HTTP beibehalten (mit Circuit Breakern)
- Vorteile: Keine neue Infrastruktur. Team bereits vertraut. Circuit
  Breaker adressieren kaskadierende Ausfälle.
- Nachteile: Löst die enge Kopplung nicht. Latenz akkumuliert sich
  weiterhin über Aufrufketten. Circuit Breaker sind ein Pflaster,
  keine Lösung für das grundlegende Kopplungsproblem.
- Warum abgelehnt: Adressiert Symptome, nicht die Ursache.

## Konsequenzen

### Positiv
- Services werden entkoppelt: Producer müssen die Consumer nicht kennen.
- Kaskadierende Ausfälle für asynchrone Workflows eliminiert.
- Event Replay ermöglicht leistungsfähige Debugging- und Audit-Fähigkeiten.
- Grundlage für Event-Sourcing-Patterns in zukünftigen Services.

### Negativ
- Operative Komplexität steigt (Kafka Cluster, Schema Registry,
  Consumer Group Management). Durch Confluent Cloud abgemildert.
- Team braucht Schulung zu Kafka-Konzepten und -Patterns.
- Eventual Consistency ersetzt Strong Consistency für asynchrone Flows.
  Einige Workflows müssen umgestaltet werden.
- Debugging verteilter asynchroner Flows ist schwieriger als das
  Nachverfolgen synchroner HTTP-Aufrufe. Wir werden Distributed
  Tracing benötigen (siehe ADR-0024).

### Risiken
- Wenn das Nachrichtenvolumen die Confluent-Cloud-Preisstufen
  überschreitet, könnten die Kosten erheblich steigen.
  Überwachen und Alerts einrichten.
- Schema-Evolution über Services hinweg erfordert Disziplin.
  Wir planen, Avro mit Schema Registry einzuführen.

## Verwandte Entscheidungen

- ADR-0024: OpenTelemetry für Distributed Tracing einführen
- ADR-0018: Service-Kommunikationsverträge (durch diesen ADR ersetzt)
