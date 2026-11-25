
// ==========================================
// ELEMENTE
// ==========================================

const figuranten = document.getElementById("figuranten");
const fehlanzeigen = document.getElementById("fehlanzeigen");

const punkteAllgemein = document.getElementById("punkteAllgemein");
const punkteHF = document.getElementById("punkteHF");
const punkteH = document.getElementById("punkteH");

const ergebnisAllgemein = document.getElementById("ergebnisAllgemein");
const ergebnisAnzeigen = document.getElementById("ergebnisAnzeigen");
const gewichtungAnzeigen = document.getElementById("gewichtungAnzeigen");
const bewertung = document.getElementById("bewertung");

const formelAllgemein = document.getElementById("formelAllgemein");
const formelAnzeigen = document.getElementById("formelAnzeigen");
const formelGewichtung = document.getElementById("formelGewichtung");
const formelBewertung = document.getElementById("formelBewertung");

const bewertungOben = document.getElementById("bewertungOben");
const bewertungStatus = document.getElementById("bewertungStatus");
const bewertungsblock = document.querySelector(".bewertungsblock");
const eingabeHinweis = document.getElementById("eingabeHinweis");

const fehlanzeigenAbzug =
    document.getElementById("fehlanzeigenAbzug");



// ==========================================
// HILFSFUNKTIONEN
// ==========================================

// Zahlen erst für die Anzeige runden.
// Die eigentlichen Berechnungen bleiben ungerundet.

function formatiereZahl(wert, stellen = 3) {

    const faktor = Math.pow(10, stellen);

    const gerundet =
        Math.round((wert + Number.EPSILON) * faktor) / faktor;

    return gerundet.toFixed(stellen);

}


// Auswahl eines Dropdowns kontrollieren

function leseAuswahl(select, min, max) {

    if (select.value === "") {
        return null;
    }

    const wert = Number(select.value);

    if (
        !Number.isInteger(wert) ||
        wert < min ||
        wert > max
    ) {
        return null;
    }

    return wert;

}


// Auswahl eines Punkte-Buttons kontrollieren

function lesePunkte(container, min, max) {

    const auswahl =
        container.querySelector(".aktiv");

    if (!auswahl) {
        return null;
    }

    const wert = Number(auswahl.textContent);

    if (
        !Number.isInteger(wert) ||
        wert < min ||
        wert > max
    ) {
        return null;
    }

    return wert;

}


// ==========================================
// PUNKTE HF UND H ERSTELLEN
// ==========================================

function erstellePunkte(container, maxWert) {

    container.innerHTML = "";

    for (let i = 1; i <= maxWert; i++) {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "punkte-button";
        button.textContent = i;

        button.addEventListener("click", function() {

            container.querySelectorAll(
                ".punkte-button"
            ).forEach(b => b.classList.remove("aktiv"));

            this.classList.add("aktiv");

            berechneAlles();

        });

        container.appendChild(button);

    }

}


// ==========================================
// BERECHNUNG ALLER ERGEBNISSE
// ==========================================

function berechneAlles() {

    // Eingaben auslesen

    const anzahlFiguranten =
        leseAuswahl(figuranten, 1, 4);

    const anzahlFehlanzeigen =
        leseAuswahl(fehlanzeigen, 0, 5);

if (anzahlFehlanzeigen !== null) {
    fehlanzeigenAbzug.textContent =
        "−" + (anzahlFehlanzeigen * 2) + " Punkte";
} else {
    fehlanzeigenAbzug.textContent = "– Punkte";
}

    const punkte = lesePunkte(
    punkteAllgemein, 0, 20
);

    const maxPunkte =
        anzahlFiguranten !== null
            ? anzahlFiguranten * 4
            : 0;

    const hf = maxPunkte > 0
        ? lesePunkte(punkteHF, 1, maxPunkte)
        : null;

    const h = maxPunkte > 0
        ? lesePunkte(punkteH, 1, maxPunkte)
        : null;


    // --------------------------------------
    // Ergebnis Allgemein
    // --------------------------------------

    let wertAllgemein = null;

    if (
        punkte !== null &&
        anzahlFehlanzeigen !== null
    ) {

        const korrigiertePunkte =
            punkte - (2 * anzahlFehlanzeigen);

        wertAllgemein =
            (korrigiertePunkte * 5 / 20 + 1) * 0.9;

        formelAllgemein.textContent =
            "((" + punkte + " - 2 × " +
            anzahlFehlanzeigen +
            ") × 5 / 20 + 1) × 0.9";

        ergebnisAllgemein.textContent =
            formatiereZahl(wertAllgemein);

    } else {

        ergebnisAllgemein.textContent = "–";

        formelAllgemein.textContent =
            "(– × 5 / 20 + 1) × 0.9";

    }


    // --------------------------------------
    // Ergebnis Anzeigen
    // --------------------------------------

    let wertAnzeigen = null;

    if (hf !== null && h !== null) {

        wertAnzeigen = (hf * 0.8) + h;

        formelAnzeigen.textContent =
            "(" + hf + " × 0.8) + " + h;

        ergebnisAnzeigen.textContent =
            formatiereZahl(wertAnzeigen, 2);

    } else {

        ergebnisAnzeigen.textContent = "–";

        formelAnzeigen.textContent =
            "(– × 0.8) + –";

    }


    // --------------------------------------
    // Gewichtung Anzeigen
    // --------------------------------------

    let wertGewichtung = null;

    if (
        wertAnzeigen !== null &&
        anzahlFiguranten !== null
    ) {

        wertGewichtung =
            (wertAnzeigen * 5 / (8 * anzahlFiguranten)) + 1;

        formelGewichtung.textContent =
            "(" + formatiereZahl(wertAnzeigen, 2) +
            " × 5 / (8 × " + anzahlFiguranten +
            ")) + 1";

        gewichtungAnzeigen.textContent =
            formatiereZahl(wertGewichtung);

    } else {

        gewichtungAnzeigen.textContent = "–";

        formelGewichtung.textContent =
            "(– × 5 / (8 × –)) + 1";

    }


    // --------------------------------------
    // Endbewertung
    // --------------------------------------

    if (
        wertAllgemein !== null &&
        wertGewichtung !== null
    ) {

        // Keine gerundeten Zwischenwerte verwenden!

        const endwert =
            (wertAllgemein + wertGewichtung) / 2;

        formelBewertung.textContent =
            "(" + formatiereZahl(wertAllgemein) +
            " + " + formatiereZahl(wertGewichtung) +
            ") / 2";

        bewertung.textContent =
            formatiereZahl(endwert);

        bewertungOben.textContent =
            formatiereZahl(endwert);


        // Kleine Gleitkomma-Abweichungen abfangen

        const bestanden =
            endwert >= 4.285 ||
            Math.abs(endwert - 4.285) < 1e-12;

        if (bestanden) {

            bewertungStatus.textContent = "bestanden";

            bewertungStatus.className =
                "bewertung-status bestanden";

            bewertungsblock.className =
                "bewertungsblock bestanden";

        } else {

            bewertungStatus.textContent = "out";

            bewertungStatus.className =
                "bewertung-status out";

            bewertungsblock.className =
                "bewertungsblock out";

        }

    } else {

        bewertung.textContent = "–";
        bewertungOben.textContent = "–";

        formelBewertung.textContent =
            "(– + –) / 2";

        bewertungStatus.textContent = "–";

        bewertungStatus.className =
            "bewertung-status neutral";

        bewertungsblock.className =
            "bewertungsblock";

    }


    // ======================================
    // EINGABEVALIDIERUNG
    // ======================================

    const fehlendeEingaben = [];

    if (anzahlFiguranten === null) {
        fehlendeEingaben.push("Anzahl Figuranten");
    }

    if (punkte === null) {
        fehlendeEingaben.push("Punkte allgemein");
    }

    if (hf === null) {
        fehlendeEingaben.push("Punkte HF");
    }

    if (h === null) {
        fehlendeEingaben.push("Punkte H");
    }

    if (anzahlFehlanzeigen === null) {
        fehlendeEingaben.push("Anzahl Fehlanzeigen");
    }

    if (fehlendeEingaben.length > 0) {

        eingabeHinweis.textContent =
            "Noch auszuwählen: " +
            fehlendeEingaben.join(", ") + ".";

        eingabeHinweis.hidden = false;

    } else {

        eingabeHinweis.textContent = "";
        eingabeHinweis.hidden = true;

    }

}


// ==========================================
// EVENT: PUNKTE ALLGEMEIN
// ==========================================

punkteAllgemein.querySelectorAll(
    ".punkte-button"
).forEach(button => {

    button.addEventListener("click", function() {

        punkteAllgemein.querySelectorAll(
            ".punkte-button"
        ).forEach(b => b.classList.remove("aktiv"));

        this.classList.add("aktiv");

        berechneAlles();

    });

});


// ==========================================
// EVENT: FIGURANTEN
// ==========================================

figuranten.addEventListener("change", function() {

    const anzahl = leseAuswahl(figuranten, 1, 4);

    // Punkteauswahl zurücksetzen

    punkteAllgemein.querySelectorAll(
        ".punkte-button"
    ).forEach(button => {
        button.classList.remove("aktiv");
    });

    // HF und H neu erstellen

    if (anzahl !== null) {

        const maxWert = anzahl * 4;

        erstellePunkte(punkteHF, maxWert);
        erstellePunkte(punkteH, maxWert);

    } else {

        punkteHF.innerHTML = "";
        punkteH.innerHTML = "";

    }

    berechneAlles();

});


// ==========================================
// EVENT: FEHLANZEIGEN
// ==========================================

fehlanzeigen.addEventListener("change", berechneAlles);


// ==========================================
// BUTTON NEU
// ==========================================

document.getElementById("neu").addEventListener(
    "click", function() {

        // Figuranten beibehalten

        // Fehlanzeigen zurücksetzen

        fehlanzeigen.value = "0";

        // Allgemeine Punkte zurücksetzen

        punkteAllgemein.querySelectorAll(
            ".punkte-button"
        ).forEach(button => {
            button.classList.remove("aktiv");
        });

        // HF zurücksetzen

        punkteHF.querySelectorAll(
            ".punkte-button"
        ).forEach(button => {
            button.classList.remove("aktiv");
        });

        // H zurücksetzen

        punkteH.querySelectorAll(
            ".punkte-button"
        ).forEach(button => {
            button.classList.remove("aktiv");
        });

        berechneAlles();

    }
);


// ==========================================
// INITIALISIERUNG
// ==========================================

berechneAlles();


// ==========================================
// SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register(
        "./service-worker.js"
    );

}
