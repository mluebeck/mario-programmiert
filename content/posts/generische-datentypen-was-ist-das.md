---
title: "Generische Datentypen – was ist das ?"
date: "2024-08-06T09:28:40"
modified: "2024-08-07T19:55:35"
slug: "generische-datentypen-was-ist-das"
author: "Mario Rotz"
categories: ["Grundlagen"]
tags: []
image: "/assets/images/PhotoFunia-1722987479.jpg"
source: "https://mario-programmiert.de/generische-datentypen-was-ist-das"
wordpress_id: 65
empty: false
---

Generische Datentypen bieten Dir eine gute Möglichkeit, unnötigen Code zu vermeiden und Deinen Code etwas abstrakter zu gestalten, was Dir dabei helfen kann, ihn lesbarer zu machen.

Wenn Du schon etwas Erfahrung mit Swift gesammelt hast, wirst Du auch schon mit Generics zu tun gehabt haben, insbesondere mit einem ganz speziellen, der bei der Variablenzuweisung eine große Rolle spielt: Dem Optional!

Ja, der Optional ist ein generischer Datentyp. zur Erinnerung: Machst Du eine Variablenzuweisung, dann kannst du entweder `var i = 100` schreiben, oder `var i : Int?`, wenn du der Variablen erst später einen Wert zuweisen möchtest. Dahinter versteckt sich ein generischer Datentyp, und zwar `Optional<Int>`

#### Der generische Datentyp Optional

Wie definieren wir einen generischen Datentyp? Schauen wir uns mal an, wie man Optional implementieren könnte. Wir nutzen dafür T als Platzhalter für einen beliebigen Datentypen:

```swift
enum Optional<T> {
    case none       // kein Wert 
    case some(T)  // Es gibt einen Wert: eine Instanz vom Typ T

    init(_ value: T) { // Mit einem Wert vom Typ T initialisieren
        self = .some(value)
    }

    init() {  // default is none 
        self = .none 
    }

    func unwrap() -> T? {
        switch self {
        case .none: // nil zurückgeben, wenn none 
            return nil
        case .some(let value):  // Wert zurückgeben, wenn vorhanden
            return value
        } 
    }
}
```

Wir definieren unseren Optional als Enum mit den Werten "none" bzw. "some(T)". Weisen wir einen Wert zu, ist self = .some(value), im anderen Fall "none". Rufen wir die Methode `unwrap` auf, wird das Optional "ausgepackt" und entweder nil oder der Wert zurückgegeben.

Hier ein Beispiel, wie das funktioniert:

```swift
let someValue: Optional<Int> = Optional(15)
let noValue: Optional<Int> = Optional()

if let s = someValue.unwrap() {
    print(s)  // 15 
} 

if let s = noValue.unwrap() {
    print(s) // wird nicht ausgeführt
} else {
    print("nil!")
}
```

Stelle Dir vor, Du müsstest eine Addition-Methode implementieren, die nicht nur für Integer, sondern auch für Gleitpunktzahlen funktioniert. Und irgendwann kommt die Anforderung, dass es auch für Strings und Array funktionieren soll!

Moment, wie soll ich zwei Strings, also Zeichenketten addieren? Oder gar Arrays?

Gehen wir einfach davon aus, daß mit Addition von Strings die Konkatenation gemeint ist, und bei Arrays dasselbe: das neue Array soll einfach aus den Elementen des ersten Arrays und danach aus den Elementen des zweiten Arrays bestehen.

Also: Wir sollen von der Operation "addiere zwei Zahlen" zu der mehr abstrakteren Operation "addiere zwei Objekte vom Typ T" übergehen. Das können wir ja mit generischen Datentypen bewerkstelligen.

Allerdings brauchen wir eine Addition - Methode, die von Int, double, String und Array implementiert werden müsste (abgesehen davon, dass Int und double ja bereits Addition "kann").

Die Forderung "Eine Methode, die von der Klasse T implementiert werden muss" können wir als protocol in Swift implementieren!

Und zwar so:

```swift
protocol Additable {
    associatedtype T  // benutze T als generischen Datentyp. 
    func addition(_ value : T) -> T
}
```

Wollen wir nun die addition-Methode für beliebige Arrays implementieren, könnte es wie folgt aussehen:

```swift
extension Array : Additable {
    typealias T = Array
    func addition(_ value: T) -> T {
        var array = Array(self)
        array.append(contentsOf: value)
        return array
    }
}
```

Für Strings könnte es so implementiert werden:

```swift
extension String : Additable {
    typealias T = String
    func addition(_ value: T) -> T {
        return self.appending(value)
    }
}
```

Protokolle in Swift verwenden associatedtype, um Typen zu definieren, die als Platzhalter innerhalb des Protokolls dienen. Diese Platzhaltertypen werden durch die Typen ersetzt, die das Protokoll implementieren (dazu dient typealias). Dies ermöglicht Flexibilität bei der Definition von Protokollanforderungen.

Aber Moment! Was ist das mit dem "associatedtype"? Warum können wir nicht einfach folgendes schreiben:

```swift
protocol Additable<T> {
    func addition(_ value1 : T, _ value2 : T) -> T
}

extension String : Additable<String> {
    func addition(_ value: String) -> String {
        return self.appending(value)
    }
}
```

In Swift sind Protokolle nicht generisch wie bei Klassen, Strukturen und Funktionen, und das aus folgenden Gründen:

Erstens die erweiterte Flexibilität: associatedtype ermöglicht es dem Typ, der das Protokoll implementiert, den konkreten Typ zu bestimmen, der für die Protokollanforderungen verwendet wird. Dies ist besonders nützlich, wenn verschiedene Typen dasselbe Protokoll mit unterschiedlichen Typen implementieren müssen, wie im Beispiel oben mit Array und String.

Zweitens: Wenn Protokolle generische Typparameter unterstützen würden, könnte dies zu Komplikationen bei der Erweiterung und Implementierung von Protokollen führen. Die Verwendung von associatedtype vereinfacht diese Prozesse.

Und drittens vereinfacht es die Typprüfung und die Typinferenz. Die Einführung generischer Typparameter in Protokollen könnte diese Komplexität weiter erhöhen und zu Verwirrung führen, insbesondere bei der Verwendung von Protokollen mit verschiedenen Typen.

Durch Typinferenz ("Datentyp-Schlussfolgerung" oder Typableitung) kann in Swift viel Schreibarbeit eingespart werden, indem auf die explizite Angabe von Typangaben verzichtet wird, die aus den restlichen Angaben hergeleitet werden können. Einfaches Beispiel: wenn ich schreibe "var i = 10", dann kann per Typinferenz gefolgert werden, dass i vom Typ Int ist, wir müssen es aber nicht immer explizit hinschreiben.

#### Einschränkungen für Generics

Manchmal ist es notwendig, bestimmte Anforderungen an die generischen Typen zu stellen. Dies kann mit Hilfe von Constaints, also Typbeschränkungen erreicht werden:

```swift
func findIndex<T: Equatable>(of valueToFind: T, in array: [T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}
```

Diese Methode durchsucht ein Array, dessen Elemente vom Typ T sind. Das kann nur dann funktionieren, wenn die Objekte vom Typ T auch vergleichbar sind. Deswegen fordern wir mittels `` `T : Equatable` ``, dass jedes Objekt vom Typ T die Vergleichsmethode aus dem Equatable-Protokoll implementieren muss.

#### Erweiterungen mit Typbeschränkungen

Generics können auch in Extensions verwendet werden. Schauen wir dazu diese Struktur an, die einen Stack implementiert. Mit den Methoden ``` `push`` `und` ``pop` ``` können wir ein Element auf den Stack legen bzw. vom Stack entfernen:

```swift
struct Stack<Element> {
    var items: [Element] = []

    mutating func push(_ item: Element) {
        items.append(item)
    }

    mutating func pop() -> Element? {
        return items.popLast()
    }
}
```

Wenn wir nun eine Extension haben, an deren Typ wir gewisse Anforderungen stellen, können wir das wie folgt machen:

```swift
extension Stack where Element: Equatable {
    func contains(_ item: Element) -> Bool {
        return items.contains(item)
    }
}
```

Die `contains` Methode implementiert eine Suche, die aber nur dann su'chen kann, wenn `Element` eine Vergleichoperation implementiert, also das Equatable-Protokoll erfüllt, und zwar durch `where Element : Equatable`.

#### Fazit

Generics bieten uns viele Vorteile:

-   Sie ermöglichen uns, denselben Code für verschiedene Typen zu verwenden. Dadurch kann man Code-Dopplungen vermeiden.
    
-   Generische Funktionen und Typen können auf viele verschiedene Arten verwendet werden, ohne den Code zu duplizieren. Sie tragen dazu bei, dass der Code sauberer, modularer und einfacher zu warten ist.
    
-   Generics sorgen dafür, dass fehlerhafte Typzuordnungen zur Compile-Zeit erkannt werden.
    
-   Generics ermöglichen uns, flexible und wiederverwendbare Komponenten zu erstellen.
    
-   Durch die Verwendung von Platzhaltern für Typen können Funktionen und Datentypen abstrakt und dennoch typsicher implementiert werden.
    

Also: Seid möglichst generisch!
