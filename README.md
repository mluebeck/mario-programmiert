# mario programmiert

Statische Fassung von [mario-programmiert.de](https://mario-programmiert.de/), vorbereitet für GitHub Pages. Beiträge und Seiten werden als Markdown gepflegt, Medien liegen im Repository. Beim Seitenaufruf werden weder WordPress noch eine Datenbank benötigt.

Die Website ist unter **[mluebeck.github.io/mario-programmiert](https://mluebeck.github.io/mario-programmiert/)** veröffentlicht. Das Repository ist nach ausdrücklicher Freigabe öffentlich. Die eigene Domain und die ursprüngliche WordPress-Website wurden nicht umgestellt.

## Lokal starten

Voraussetzung: Node.js 22 oder neuer.

```sh
npm ci
npm run build
npm test
npm run preview
```

Die Vorschau ist unter `http://127.0.0.1:4173` erreichbar. Nach Inhaltsänderungen `npm run build` erneut ausführen und die Seite neu laden.

## Inhalte bearbeiten

- **Beiträge:** `content/posts/*.md`.
- **Seiten:** `content/pages/*.md`.
- **Bilder:** `public/assets/images/`.
- **Seitentitel und Autor:** `site.json`.
- **Gestaltung:** `public/assets/style.css` und `public/assets/base.css`.
- **Import-Sicherung:** `source-export/` enthält öffentlich verfügbare WordPress-API-Daten, keine privaten Entwürfe, Datenbank oder Zugangsdaten.

Die Markdown-Dateien enthalten einen YAML-Kopf mit Titel, Datum, Slug, Kategorien und Originaladresse. Titel und Texte wurden nicht redaktionell überarbeitet. Der ursprüngliche TDD-Beitrag ist leer; in der Website steht deshalb ein entsprechender Hinweis.

Neue Beiträge bekommen einen eindeutigen `slug` und ein Datum wie `2026-11-09T12:00:00`. Die URL wird aus dem Slug gebildet. Interne Links im Markdown können beispielsweise `/speicherverwaltung/` lauten. Der Build berechnet daraus passende relative Links, auch für ein GitHub-Projektverzeichnis.

Der Importer `npm run import` verarbeitet ausschließlich die gespeicherten JSON-Daten und überschreibt vorhandene Markdown-Dateien nicht. Er ist für die initiale Migration gedacht, nicht für eine dauerhafte Synchronisierung mit WordPress.

## GitHub Pages einschalten

GitHub Pages ist aktiviert; `PAGES_ENABLED` steht auf `true`. Jeder Push auf `main` baut und testet die Website und veröffentlicht bei Erfolg die neue Fassung. Die folgende Liste dokumentiert die Einrichtung:

1. In GitHub unter **Settings → Pages → Build and deployment** die Quelle **GitHub Actions** auswählen.
2. Unter **Settings → Secrets and variables → Actions → Variables** die Repository-Variable `PAGES_ENABLED` mit Wert `true` anlegen. Ohne diese Freigabe baut und testet der Workflow nur; er veröffentlicht nichts.
3. Den Workflow **Build and deploy GitHub Pages** manuell unter **Actions** ausführen.
4. Die ausgegebene Seitenadresse öffnen und Startseite, Artikel, Bilder sowie mobile Darstellung prüfen.

Der Workflow verwendet `actions/configure-pages`, `actions/upload-pages-artifact` und `actions/deploy-pages`. Hintergrund und Voraussetzungen sind in der [GitHub-Pages-Dokumentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) beschrieben. Für GitHub Pages aus einem privaten Repository kann ein geeigneter kostenpflichtiger GitHub-Tarif erforderlich sein; alternativ kann das Repository nach ausdrücklicher Freigabe öffentlich werden. Siehe [Verfügbarkeit von GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).

## Eigene Domain später umstellen

Die ursprüngliche WordPress-Website bleibt bei der Vorbereitung unangetastet. Es wurde bewusst keine `CNAME`-Datei angelegt und kein DNS-Eintrag geändert.

Vor dem Umzug:

- Inhalte, Codeblöcke, Bilder und den leeren TDD-Beitrag prüfen.
- Entscheiden, ob die Angaben auf „Über mich“ weiterhin öffentlich erscheinen sollen.
- Prüfen, ob Impressum und Datenschutzhinweise benötigt werden; solche Texte werden nicht erfunden.
- Falls noch verwendet: WordPress-Kommentare, Kontaktformulare, Plugins und private Entwürfe separat bewerten. Sie sind nicht Teil dieser statischen Inhaltsmigration.
- Domaininhaberschaft bei GitHub verifizieren, dann die eigene Domain in den Pages-Einstellungen eintragen.
- DNS beim Domainanbieter erst nach funktionierendem Pages-Deployment umstellen und HTTPS aktivieren.
- Bestehende E-Mail-/MX-Einträge beibehalten.
- Nach dem Umschalten alte Artikeladressen, Kategorien und HTTPS testen.

Die Artikel-Slugs sowie der bisherige Seitenpfad `sample-page` bleiben erhalten. GitHub Pages kann pfadbasierte URLs auf die Fassung mit abschließendem Schrägstrich weiterleiten. WordPress-Such- und Kommentar-Endpunkte werden nicht nachgebildet.

Das genaue Vorgehen steht in der [GitHub-Anleitung für eigene Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Technik und Rechte

Der Build erzeugt `_site/`, RSS-Feed, Sitemap, eine Fehlerseite sowie Kategorie- und Autorenarchive. Schriftarten werden lokal ausgeliefert. Der Browser benötigt kein JavaScript.

Originalbeiträge und Bilder bleiben Eigentum ihrer jeweiligen Rechteinhaber. Es wurde bewusst keine pauschale Open-Source-Lizenz für die Inhalte hinzugefügt. Die verwendeten npm-Pakete und Schriftarten unterliegen ihren eigenen Lizenzen.
