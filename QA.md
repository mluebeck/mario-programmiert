# Prüfplan

- Alle fünf Beiträge und die Seite „Über mich“ besitzen Markdown-Quellen und erreichbare HTML-Seiten.
- Bilder sind lokal gespeichert und laden ohne WordPress-Server.
- Interne Artikel-, Kategorie-, Autoren- und Navigationslinks funktionieren.
- Swift-Code ist unverändert übernommen und horizontal scrollbar, ohne die mobile Seite aufzuziehen.
- Der leere TDD-Beitrag wird nicht mit erfundenem Text gefüllt.
- Startseite, alle Artikel, Über-mich-Seite und Archive werden bei 1440 und 375 Pixel Breite geprüft.
- Keine Überläufe, fehlenden Bilder, abgeschnittenen Überschriften oder Konsolenfehler.
- Grenzfälle: tiefes Kategorieverzeichnis, lange Artikelüberschrift, 404, GitHub-Projekt-Unterpfad.
- Die bereitgestellte Vorschau wird nach dem Deployment erneut geöffnet und ein Artikel wird über die Navigation aufgerufen.
- WordPress und DNS bleiben unverändert; GitHub Pages wird ohne ausdrückliche Freigabe nicht öffentlich aktiviert.

## Ergebnisse vom 9. November 2026

- **Inhalte:** 5 Beiträge, 1 Seite und 13 Originalmedien importiert. Ein Beitrag war bereits in WordPress leer. Die öffentliche Kommentar-Schnittstelle enthielt keine Kommentare.
- **Automatische Tests:** Markdown-/HTML-Zuordnung, alle lokalen Dateiverweise, Originalmedien, Feed, Sitemap, Diagramme und unveränderte Codeblöcke erfolgreich geprüft.
- **Browser:** 15 Seiten bei jeweils 1440 und 375 Pixel Breite aufgerufen. Keine defekten Bilder, keine seitlichen Seitenüberläufe und keine JavaScript-Ausnahmen gefunden. Bildschirmaufnahmen und Übersichten wurden geprüft.
- **Navigation:** Startseite → Artikel → interner Artikelverweis → Über mich → Startseite → Kategorie erfolgreich per Klick getestet.
- **Kontrast:** Gemessene Kontrastverhältnisse für Metadaten, Autorenzeile und Auszüge jeweils rund 6,9:1; Artikellinks rund 7,5:1.
- **Unterverzeichnis:** Build und Dateiverweise auch mit `BASE_PATH=/mario-programmiert` geprüft.
- **Medien:** Zwei zusätzliche WebP-Fassungen für die großen Beitragsbilder erstellt. Die 13 Originaldateien bleiben unverändert im Repository erhalten.
- **GitHub:** Privates Repository erstellt. Der erste GitHub-Actions-Build war erfolgreich, die Veröffentlichung wurde wie vorgesehen übersprungen.
- **Nicht Teil der Prüfung:** DNS-Umschaltung, Live-Veröffentlichung auf GitHub Pages und rechtliche Vollständigkeit von Impressum/Datenschutzhinweisen.
