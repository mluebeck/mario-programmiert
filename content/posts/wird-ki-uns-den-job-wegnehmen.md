---
title: "Wird Künstliche Intelligenz uns Software-Entwicklern den Job wegnehmen?"
date: "2024-09-02T23:20:22"
modified: "2024-09-10T22:00:02"
slug: "wird-ki-uns-den-job-wegnehmen"
author: "Mario Rotz"
categories: ["Gesellschaft"]
tags: []
image: ""
source: "https://mario-programmiert.de/wird-ki-uns-den-job-wegnehmen"
wordpress_id: 107
empty: false
---

„Hilfe! KI wird mir den Job wegnehmen!“ „Bald wird Software vollkommen von KI entwickelt werden!“ „KI wird die Weltherrschaft übernehmen!“

Das sind einige Aussagen von angsterfüllten Angestellten bzw. charismatischen CEOs, die ihre neusten KI-Innovationen dem Publikum (und ihren Investoren) verkaufen wollen.

Doch kann eine KI wirklich eigenständig Software entwickeln?

Lasst uns doch zunächst einmal folgende Frage beantworten: Was ist Software ?

Software ist eine Sammlung von Anweisungen (Programme genannt), die einem Computer sagen, wie es bestimmte Aufgaben ausführen soll.

Menschen entwickeln Software in einer Programmiersprache, die als Schnittstelle zwischen dem Menschen und dem Computer dient. Dadurch wird es möglich, logische Abläufe und Berechnungen in einer für Computer verständlichen Form auszudrücken. Programmiersprachen machen Berechnungen nicht nur dem Computer verständlich, sondern vor allem uns Menschen! Denn es sind Menschen, die die Software weiterentwickeln oder auf Fehler prüfen und Fehler beseitigen.

Das relevante hier ist der Begriff „Schnittstelle zwischen Menschen und Computer“. Ohne diese Schnittstelle könnten wir dem Computer nicht sagen, was wir von ihm wollen.

Zum Beschreiben der Aufgabe wird ein Fachdomänenmodell benötigt: Ein System von Abstraktionen, die bestimmte Aspekte einer Fachdomäne beschreiben, und mittels denen man Probleme der Fachdomäne beschreiben und lösen kann.

Um genauer zu verstehen, warum eine KI nicht einfach Software für einen Computer erstellen kann, ist es gut, zu verstehen, WIE Software entwickelt wird. Es reicht nämlich nicht, der KI zu sagen, dass man eine Software braucht, um eine bestimmte Aufgabe zu erledigen. Die Aufgabe muss möglichst genau beschrieben werden: Was sind die Eingabeparameter? Wo kommen sie her? Was soll ausgegeben werden? In welcher Form soll es eingegeben werden? Und in welcher Form die Ausgabe erfolgen? Soll die Ausgabe gespeichert werden? Soll die Ausgabe als Eingabe für eine andere Maschine dienen? Wie sollen sie miteinander kommunizieren? Welche Hardware- und Softwarearchitektur soll verwendet werden?

All diese Entscheidungen müssen geklärt werden - manches muss vor Projektbeginn feststehen, manches kann im Laufe des Projektes geklärt werden.

All das müsste man der KI sagen und dies möglichst genau. Per Prompt Engineering kann man die Aufgabe so detailliert und genau beschreiben, dass die KI die Aufgabe reproduzierbar umsetzen kann. Das heisst, bei identischem Prompt sollte auch das Ergebnis identisch sein (Determinismus). Und das ist bei KI Prompts ja leider nicht immer der Fall.

Das formale Beschreiben einer Aufgabe, die bei identischer Eingabe eine vorhersehbare Ausgabe liefert - genau das ist Softwareentwicklung!

Ob wir das nun per Prompt Engineering machen, oder dafür eine formale Beschreibungssprache (Domain specific language) nutzen… der Aufwand wäre derselbe, und das Ergebnis wäre bei einer KI mit einer gewissen Unschärfe versehen, denn identische Prompts generieren leicht unterschiedliche Antworten.

Dies kann ein Softwareentwickler mit einer Programmiersprache (oder vergleichbarer Domain specific language) und entsprechenden Werkzeugen viel präziser umsetzen!  
Während der Umsetzung wird der Softwareentwickler immer wieder Rückfragen haben, um zu schauen, ob das was der Anwender gerne haben möchte, mit dem was der Softwareentwickler verstanden hat, übereinstimmt. Der Softwareentwickler muss mit anderen Projektbeteiligten kommunizieren, ob die benötigten anderen Komponenten, die ausserhalb des Kompetenzbereiches des Softwareentwicklers liegen, einsatzbereit sind.

Ein Ansatz, Softwareentwicklung weiter zu formalisieren, so dass eine KI die Aufgabe übernehmen kann, könnte im Behavious-drive-development liegen (siehe [https://en.wikipedia.org/wiki/Behavior-driven\_development](https://en.wikipedia.org/wiki/Behavior-driven_development)). Aber auch hier müsste zunächst jemand die Spezifikationen schreiben. Irgendwer muss ja die Vorgaben machen.

Menschen wollen Software haben, die Probleme löst, die Aufgaben automatisiert. Die Software muss eine Schnittstelle haben, damit Menschen sie bedienen können. Die Software muss irgendwo herkommen. Wie wir gesehen haben, muss ein Mensch dem Computer sagen, was genau er haben will. Und das kann er nur in Interaktion mit dem Computer. Damit diese Interaktion möglichst erfolgreich ist (der Computer tut genau das, was der Mensch will), muss der Computer verstehen, was der Mensch von ihm will. Und genau das ist die Essenz von Softwareentwicklung: die erfolgreiche Interaktion zwischen Menschen und Computer, damit etwas Neues entsteht.

Der Softwareentwickler ist aber nicht nur die Schnittstelle zwischen ihm und dem Computer, sondern auch zwischen dem Kunden und dem Computer. Der Kunde möchte eine Software haben, der Softwareentwickler berät und zeigt auf, was möglich ist und wie es möglich ist und setzt es schliesslich um - mit viel Know-How und Kreativität. Der Computer kann bei der Softwareentwicklung hilfreich zur Seite stehen, insbesondere als KI:

Sie kann dem Softwareentwickler Routineaufgaben abnehmen durch Automatisierung und kann Unterstützung geben bei der Generierung von Standard-Code-Schnipseln, die sich immer gleichen (sogenannter Boilerplate - Code). Die KI kann den Code prüfen und häufige Fehlerquellen identifizieren und helfen, Fehler zu beheben. Die KI kann als Nachschlagewerk dienen.

Was eine KI hingegen noch nicht gut hinbekommt:

Die Softwareentwicklung erfordert ein tiefes Verständnis der Problemstellung, kreatives Denken, abstraktes Denken und die Fähigkeit, komplexe Systeme zu entwerfen. Dies geht über das hinaus, was KI derzeit leisten kann. KI ist hervorragend in der Mustererkennung und kann basierend auf vorhandenen Daten und Algorithmen Vorschläge machen, aber sie ist noch weit davon entfernt, wirklich innovative und kreative Lösungen zu entwickeln, wie es ein erfahrener Softwareentwickler kann.

Softwareentwicklung ist oft ein iterativer Prozess, bei dem sich die Anforderungen im Laufe der Zeit ändern können. Entwickler müssen in der Lage sein, diese Veränderungen zu verstehen und in die vorhandene Software einzufügen inklusive einer Kosten/Nutzen-Abschätzung.  
Diese Fähigkeit zur Anpassung und zum flexiblen Denken ist etwas, welches KI noch nicht leisten kann.

Softwareentwicklung ist Teamwork und Kommunikation! Sie kommunizieren mit Kunden und Stakeholdern und müssen oft komplexe Ideen und technische Konzepte vermitteln. Zwischenmenschliche Interaktion und das Verständnis für die Bedürfnisse und Erwartungen anderer sind entscheidend für den Erfolg eines Softwareprojekts. KI kann unterstützen, aber nicht die zwischenmenschlichen Aspekte der Softwareentwicklung komplett übernehmen.

Softwareentwickler tragen Verantwortung für die Sicherheit, Datenschutz, und Auswirkungen ihrer Software auf Gesellschaft, Diese moralischen Überlegungen erfordern menschliches Urteilsvermögen, das KI nicht besitzt.

Bisher ist noch keine KI aufgefallen mit folgendem Vorschlag:

„Lasst uns ein Gerät bauen, das Menschen ständig bei sich haben, mit dem sie unterwegs kommunizieren können, Musik hören , Fotos doer Videos machen können. Und man soll es programmieren können, mit Apps und einem App Store.“

Oder ist schon mal eine KI mit etwas etwas total verrücktem oder einem sehr kreativem Einfall aufgefallen ?

Für mich ist die KI in der Form von ChatGPT eher etwas wie eine sehr große Datenbank, die ich in natürlicher Sprache abfragen kann und die mir klare, verständliche Antworten bieten kann.

Sie kann mir aber nur die Antworten geben, die irgendjemand sich irgendwann einmal ausgedacht und aufgeschrieben hat. Sie kann nicht von sich aus auf neue Antworten kommen, die es noch nirgends gibt.

Sie kann nicht eine neue Stringtheorie entwickeln. Sie kann nicht einen Nachfolger fürs Smartphone entwickeln.

Während KI in der Lage ist, viele Aufgaben in der Softwareentwicklung zu automatisieren und zu unterstützen, ist es unwahrscheinlich, dass sie menschliche Softwareentwickler vollständig ersetzen kann. Die Kombination aus technischem Wissen, kreativem Denken, Kommunikation und ethischem Bewusstsein macht den Menschen in der Softwareentwicklung weiterhin unverzichtbar. KIs werden vielmehr als leistungsstarke Werkzeuge gesehen, die den Entwicklern helfen, ihre Arbeit effizienter und effektiver zu erledigen.

Der KI fehlt es an echter Kreativität. Ich bin überzeugt, dass die KI momentan ein belesener Idiot ist. Sie weiss alles, was in Büchern steht und kann Wissen wiedergeben. Aber sie kann nicht genuin Neues erzeugen. Sämtlichen KI-Bildern sieht man an, dass sie ein Werk jenseits menschlicher Imaginationskraft sind ohne Seele und Tiefe. KI filme sind nur ein Abklatsch vorhandener Filme.  
Solange die KI kein Erfahrungswissen hat, das durch Interaktionen mit Dingen, Personen aus der realen Welt hervorgegangen ist, solange wird sie nur vorhandenes Buchwissen widerkäuen, ohne dass daraus etwas wahrhaft neues entsteht.

Und genau aus diesen Gründen werden wir noch lange auf Softwareentwickler angewiesen sein.

Oder wie ich es gestern auf reddit lesen konnte : „If they could replace software engingeers with KI, they also could replace CEO’s“.
