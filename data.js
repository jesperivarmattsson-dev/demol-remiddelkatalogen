/* ============================================================
   Læremiddelkatalogen — mock data for the search/filter demo.
   Edit freely: this drives the working results view.
   ============================================================ */

window.LK_LEVELS = ["Grunnskole", "Videregående skole", "Voksenopplæring"];

window.LK_FAG = [
  "Norsk", "Matematikk", "Engelsk", "Naturfag", "Samfunnsfag",
  "KRLE", "Kunst og håndverk", "Musikk", "Mat og helse",
];

window.LK_TRINN = ["1.–4. trinn", "5.–7. trinn", "8.–10. trinn", "Videregående"];

/* tinted logo-badge colors keyed by first fag — purely cosmetic */
window.LK_FAG_COLOR = {
  "Norsk":             { bg: "#EBE6FE", fg: "#260D92" },
  "Matematikk":        { bg: "#CFF7E2", fg: "#054625" },
  "Engelsk":           { bg: "#E6F0FF", fg: "#00368C" },
  "Naturfag":          { bg: "#CFF7E2", fg: "#054625" },
  "Samfunnsfag":       { bg: "#FCEED2", fg: "#7a4d00" },
  "KRLE":              { bg: "#FFEAE9", fg: "#7F0001" },
  "Kunst og håndverk": { bg: "#F8D7E8", fg: "#7a1450" },
  "Musikk":            { bg: "#EBE6FE", fg: "#260D92" },
  "Mat og helse":      { bg: "#FCEED2", fg: "#7a4d00" },
};

window.LK_ITEMS = [
  { id: 1,  title: "Regnereisen",          vendor: "Forlaget Tellus",        fag: ["Matematikk"],               levels: ["Grunnskole"],                         trinn: ["1.–4. trinn"],
    desc: "Adaptiv mattetrening med oppgaver som tilpasser seg eleven. Dekker tall, regnearter og geometri på de laveste trinnene." },
  { id: 2,  title: "Ordriket",             vendor: "Aschelund Læring",       fag: ["Norsk"],                    levels: ["Grunnskole"],                         trinn: ["5.–7. trinn"],
    desc: "Helhetlig norskverk med lesing, skriving og grammatikk. Inkluderer lydstøtte og differensierte tekster." },
  { id: 3,  title: "Naturfag Utforsk",     vendor: "Vitenforlaget",          fag: ["Naturfag"],                 levels: ["Grunnskole"],                         trinn: ["8.–10. trinn"],
    desc: "Utforskende naturfag med virtuelle forsøk, simuleringer og oppgaver knyttet til kompetansemålene." },
  { id: 4,  title: "Engelsk Univers",      vendor: "Aschelund Læring",       fag: ["Engelsk"],                  levels: ["Grunnskole"],                         trinn: ["5.–7. trinn"],
    desc: "Engelskopplæring med interaktive dialoger, uttaletrening og lytteøvelser for mellomtrinnet." },
  { id: 5,  title: "Samfunnsportalen",     vendor: "Civitas Media",          fag: ["Samfunnsfag"],              levels: ["Grunnskole", "Videregående skole"],   trinn: ["8.–10. trinn", "Videregående"],
    desc: "Aktuelt lærestoff i samfunnsfag med kilder, kart og oppgaver om demokrati, økonomi og samfunn." },
  { id: 6,  title: "Matematikk i praksis", vendor: "Forlaget Tellus",        fag: ["Matematikk"],               levels: ["Videregående skole"],                 trinn: ["Videregående"],
    desc: "Praktisk matematikk for yrkesfag og studieforberedende. Funksjoner, statistikk og modellering." },
  { id: 7,  title: "Kodeskolen",           vendor: "Bit Studio",             fag: ["Naturfag", "Matematikk"],   levels: ["Grunnskole"],                         trinn: ["8.–10. trinn"],
    desc: "Introduksjon til programmering og algoritmisk tenkning med blokkbasert og tekstbasert kode." },
  { id: 8,  title: "Norsk for voksne",     vendor: "Voksenforlaget",         fag: ["Norsk"],                    levels: ["Voksenopplæring"],                    trinn: [],
    desc: "Norskopplæring for voksne innvandrere på nivå A1–B2, med tema fra dagligliv, arbeid og samfunn." },
  { id: 9,  title: "Digital lesetrening",  vendor: "Lesekroken",             fag: ["Norsk"],                    levels: ["Grunnskole"],                         trinn: ["1.–4. trinn"],
    desc: "Systematisk leseopplæring med bokstavlyder, stavelser og tilpassede tekster for begynneropplæring." },
  { id: 10, title: "Historie og samtid",   vendor: "Civitas Media",          fag: ["Samfunnsfag"],              levels: ["Videregående skole"],                 trinn: ["Videregående"],
    desc: "Historieverk for videregående med kildekritikk, tidslinjer og fordypningsoppgaver." },
  { id: 11, title: "Geometriverkstedet",   vendor: "Vitenforlaget",          fag: ["Matematikk"],               levels: ["Grunnskole", "Videregående skole"],   trinn: ["8.–10. trinn", "Videregående"],
    desc: "Dynamisk geometri og graftegning for utforsking av figurer, funksjoner og sammenhenger." },
  { id: 12, title: "Musikklab",            vendor: "Klang Media",            fag: ["Musikk"],                   levels: ["Grunnskole"],                         trinn: ["5.–7. trinn"],
    desc: "Skapende musikkundervisning med digitale instrumenter, rytmeøvelser og enkel komponering." },
  { id: 13, title: "KRLE Dialog",          vendor: "Civitas Media",          fag: ["KRLE"],                     levels: ["Grunnskole"],                         trinn: ["8.–10. trinn"],
    desc: "Religion, livssyn og etikk gjennom dilemmaer, kilder og refleksjonsoppgaver for ungdomstrinnet." },
  { id: 14, title: "Kunstrommet",          vendor: "Atelier Forlag",         fag: ["Kunst og håndverk"],        levels: ["Grunnskole"],                         trinn: ["1.–4. trinn"],
    desc: "Praktisk og skapende arbeid med farge, form og materialer, med trinn-for-trinn videoer." },
  { id: 15, title: "Kjøkkenpraksis",       vendor: "Voksenforlaget",         fag: ["Mat og helse"],             levels: ["Grunnskole", "Voksenopplæring"],      trinn: ["5.–7. trinn"],
    desc: "Mat og helse med oppskrifter, ernæringslære og praktiske oppgaver tilpasset ulike nivåer." },
  { id: 16, title: "Engelsk for arbeid",   vendor: "Voksenforlaget",         fag: ["Engelsk"],                  levels: ["Voksenopplæring"],                    trinn: [],
    desc: "Yrkesrettet engelsk for voksne, med fokus på muntlig kommunikasjon i arbeidssituasjoner." },
];
