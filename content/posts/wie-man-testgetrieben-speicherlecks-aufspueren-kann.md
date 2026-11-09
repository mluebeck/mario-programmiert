---
title: "Wie man Speicherlecks aufspüren kann"
date: "2024-08-22T21:35:57"
modified: "2024-08-23T13:47:13"
slug: "wie-man-testgetrieben-speicherlecks-aufspueren-kann"
author: "Mario Rotz"
categories: ["Uncategorized"]
tags: []
image: ""
source: "https://mario-programmiert.de/wie-man-testgetrieben-speicherlecks-aufspueren-kann"
wordpress_id: 94
empty: false
---

In diesem Artikel zeige ich dir einen netten kleinen Kniff, mit dem Du innerhalb der Tests Speicherlecks aufspüren kannst.

Betrachten wir folgende beiden Klassen, die sich gegenseitig referenzieren:

```swift
class Car {
    var currentDriver:Person
    var identifier : String = UUID().uuidString
    init(owner:Person) {
        self.currentDriver = owner
}

class Person {
    var carIAmDriving : Car?
    var name = "John Doe"
    init(carIAmDriving: Car? = nil) {
        self.carIAmDriving = carIAmDriving
    }
}
```

Ein Objekt der Klasse `Car` hat eine `Person` als Attribut und die `Person` referenziert wieder zurück zu `Car`:

```swift
let person = Person()
let car = Car(owner:person)
person.carIAmDriving = car
```

Wie im Artikel [https://mario-programmiert.de/speicherverwaltung](/speicherverwaltung/) beschrieben, führt der obige Code zu einem Speicherleck, da `Person` und `Car` sich gegenseitig stark referenzieren und dies zu einem "Retain Cycle" führen. Diesen Retain cycle könnte man auflösen, indem man beispielsweise `var currentDriver` auf `unowned` setzt.

Wie könnte man nun feststellen, dass es ein Speicherleck gibt? Eine Möglichkeit wäre, mittels der Xcode Tools "Intstruments" (Allocations) zu prüfen, ob speicherlecks vorliegen. Das ist allerdings recht aufwändig und zeitintensiv.

Besser wäre es, mittels eines Test zu überprüfen, ob ein Speicherleck vorliegt. Und das ist in der Tat möglich!

Wir können jedem Test einen `teardown`\-Block hinzufügen, dieser Block wird dann aufgerufen, wenn die Testfunktion beendet ist. Und genau in diesem Block können wir prüfen, ob ein Objekt noch existiert.

Genug der langen Worte, hier der passende Code:

```swift
final class MemoryManagementTestTests: XCTestCase {

func test_createAPersonWithACar() {
        let person = Person()
        let car = Car(owner:person)
        person.carIAmDriving = car

        addTeardownBlock {
            [weak person] in
            XCTAssertNil(person, "Instance should have been deallocated. Potential Memory leak")
        }
        XCTAssert( car.currentDriver.name=="John Doe", "The Person is John Doe")
    }
}
```

Wir haben einen Test, der einfach prüft, ob der Name des Fahrers mit John Doe übereinstimmt. Viel interesanter ist jedoch der Test innerhalb des `addTeardownBlock` . Ist person = nil? Wenn ja, dann gibt es kein Speicherleck, die beiden Objekte, die durch `person` und `car` referenziert wurden, wurden aus dem Speicher entfernt.

Ist `person` aber nicht `nil`, dann liegt offenbar ein Retain cycle vor, denn ansonsten wäre ja `person ==nil` !

Wenn wir nun ein unowned einbauen, und zwar hier:

```swift
class Car {
    unowned var currentDriver:Person
    var identifier : String = UUID().uuidString
    init(owner:Person) {
        self.currentDriver = owner
}
```

dann haben wir den Retain cylce unterbunden. Das Entfernen der Objekte kann stattfinden, person wird nil, der Test liefert "grün".

(zum selber ausprobieren: [https://github.com/mluebeck/SwiftMemoryManagement/blob/main/MemoryManagementTest/MemoryManagementTestTests/MemoryManagementTestTests.swift](https://github.com/mluebeck/SwiftMemoryManagement/blob/main/MemoryManagementTest/MemoryManagementTestTests/MemoryManagementTestTests.swift))
