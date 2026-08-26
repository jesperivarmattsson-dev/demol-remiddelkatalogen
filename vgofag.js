/* ============================================================
   Videregåendefag — hierarkisk fag-tre (gradeGroup=vgo).
   Speiler den nøstede filtermenyen på laeremiddelkatalogen.sikt.no:
     Utdanningsprogram → programområde → fag (avkryssbart).
   Node = streng (blad/fag) ELLER { l: tittel, c: [barn] } (utvidbar).
   "Fellesfag og påbygg" ligger først; resten er alfabetisk.
   Yrkesfaga er representative utvalg, ikkje uttømmande.
   ============================================================ */
window.SK_FAG_VGO_TREE = [
  { l: "Fellesfag og påbygg", c: [
    "Engelsk", "Norsk", "Matematikk 1P", "Matematikk 1T", "Matematikk 2P", "Matematikk 2P-Y",
    "Matematikk P", "Matematikk T", "Naturfag", "Geografi", "Historie", "Samfunnskunnskap",
    "Religion og etikk", "Kroppsøving", "Fremmedspråk", "Grunnleggende norsk", "Norsk kort botid vgo",
    "Norsk tegnspråk", "Norsk for elever med tegnspråk", "Engelsk for elever med tegnspråk",
    "Norsk for elever med samisk", "Kvensk eller finsk som andrespråk", "Morsmål språklige minoriteter",
    "Samisk som førstespråk", "Samisk som andrespråk 2", "Samisk som andrespråk 3", "Samisk som andrespråk 4"
  ] },
  { l: "Bygg- og anleggsteknikk", c: [
    { l: "Anleggsgartner", c: ["Anleggsgartnerarbeid", "Rammebetingelser for anleggsgartnerarbeid"] },
    { l: "Anleggsgartnerfaget", c: ["Anleggsgartnerfaget", "Praktisk anleggsgartnerarbeid"] },
    { l: "Anleggsteknikk", c: ["Grunnarbeider", "Sikkerhetsopplæring for masseforflytningsmaskiner"] },
    { l: "Betong og mur", c: ["Dokumentasjon og kommunikasjon", "Produksjon"] },
    { l: "Klima, energi og miljøteknikk", c: ["Praktisk yrkesutøvelse"] },
    { l: "Rørleggerfaget", c: ["Sanitæranlegg", "Varmeanlegg", "Utvendige røranlegg"] },
    { l: "Tømrerfaget", c: ["Bygging", "Materialer og verktøy"] },
    { l: "Vei- og anleggsfaget", c: ["Vei- og anleggsteknikk"] }
  ] },
  { l: "Elektro og datateknologi", c: [
    { l: "Automatiseringsfaget", c: ["Automatiseringssystemer", "Elenergisystemer"] },
    { l: "Dataelektronikerfaget", c: ["Installasjon og drift", "Reparasjon og vedlikehold"] },
    { l: "Elektrikerfaget", c: ["Elenergi og styresystemer", "Bygningsinstallasjon"] },
    { l: "Energimontørfaget", c: ["Energiproduksjon og -distribusjon"] },
    { l: "Heismontørfaget", c: ["Montasje og vedlikehold"] },
    { l: "Kulde- og varmepumpeteknikkfaget", c: ["Kulde- og varmepumpeteknikk", "Ventilasjonsteknikk"] }
  ] },
  { l: "Frisør, blomster, interiør og eksponeringsdesign", c: [
    { l: "Frisørfaget", c: ["Klipp og styling", "Farge og behandling"] },
    { l: "Blomsterdekoratørfaget", c: ["Binderi og dekorasjon"] },
    { l: "Interiørfaget", c: ["Interiørdesign"] },
    { l: "Eksponeringsdesignfaget", c: ["Visuell eksponering"] }
  ] },
  { l: "Helse- og oppvekstfag", c: [
    { l: "Helsearbeiderfaget", c: ["Helsefremmende arbeid", "Kommunikasjon og samhandling", "Yrkesutøvelse"] },
    { l: "Barne- og ungdomsarbeiderfaget", c: ["Pedagogisk arbeid", "Lek og aktivitet"] },
    { l: "Apotekteknikk", c: ["Legemiddelhåndtering"] },
    { l: "Helseservicefag", c: ["Helsesekretær", "Tannhelsesekretær"] }
  ] },
  { l: "Håndverk, design og produktutvikling", c: [
    { l: "Design og tekstil", c: ["Tekstilhåndverk", "Søm"] },
    { l: "Trearbeid", c: ["Møbelsnekker", "Treskjæring"] },
    { l: "Smed og metall", c: ["Smedfaget"] }
  ] },
  { l: "Idrettsfag", c: [
    { l: "Idrettsfag Vg1", c: ["Treningslære 1", "Idrettsaktivitet"] },
    { l: "Idrettsfag Vg2", c: ["Treningsledelse", "Aktivitetslære"] },
    { l: "Idrettsfag Vg3", c: ["Treningslære 2", "Toppidrett"] }
  ] },
  { l: "Informasjonsteknologi og medieproduksjon", c: [
    { l: "Informasjonsteknologi Vg2", c: ["Brukerstøtte og drift", "Utvikling"] },
    { l: "IT-utviklerfaget", c: ["Programmering", "Systemutvikling"] },
    { l: "IT-driftsfaget", c: ["Drift og infrastruktur"] },
    { l: "Mediedesign og medieproduksjon", c: ["Innholdsproduksjon", "Publisering"] }
  ] },
  { l: "Kunst, design og arkitektur", c: [
    { l: "Kunst, design og arkitektur Vg1", c: ["Design og arkitektur", "Kunst og visuelle virkemidler"] },
    { l: "Kunst, design og arkitektur Vg2", c: ["Design og arkitektur 2"] },
    { l: "Kunst, design og arkitektur Vg3", c: ["Kunst og visuelle virkemidler 3"] }
  ] },
  { l: "Medier og kommunikasjon", c: [
    { l: "Medier og kommunikasjon Vg1", c: ["Mediesamfunnet", "Medieuttrykk"] },
    { l: "Medier og kommunikasjon Vg2", c: ["Innholdsproduksjon", "Medieuttrykk 2"] },
    { l: "Medier og kommunikasjon Vg3", c: ["Medieproduksjon"] }
  ] },
  { l: "Musikk, dans og drama", c: [
    { l: "Musikk", c: ["Instrument og samspill", "Musikk i perspektiv"] },
    { l: "Dans", c: ["Grunntrening i dans", "Scenisk dans"] },
    { l: "Drama", c: ["Teaterproduksjon", "Teaterensemble"] }
  ] },
  { l: "Naturbruk", c: [
    { l: "Landbruk og gartnernæring", c: ["Plante- og husdyrproduksjon"] },
    { l: "Akvakultur", c: ["Drift og produksjon"] },
    { l: "Skogbruk", c: ["Skogsdrift"] },
    { l: "Heste- og hovslagerfag", c: ["Hestefaget"] }
  ] },
  { l: "Restaurant- og matfag", c: [
    { l: "Kokk- og servitørfag", c: ["Råvarer og produksjon", "Servering"] },
    { l: "Matfag", c: ["Bakerfaget", "Kjøttskjærerfaget", "Industriell matproduksjon"] }
  ] },
  { l: "Salg, service og reiseliv", c: [
    { l: "Salg og reiseliv", c: ["Salg og markedsføring", "Reiseliv"] },
    { l: "Service og samferdsel", c: ["Kontor og administrasjon", "Logistikk"] },
    { l: "IT- og kontorfag", c: ["Kontor- og administrasjonsfaget"] }
  ] },
  { l: "Studiespesialisering", c: [
    { l: "Realfag", c: ["Matematikk R1", "Matematikk R2", "Fysikk 1", "Fysikk 2", "Kjemi 1", "Kjemi 2", "Biologi 1", "Biologi 2"] },
    { l: "Språk, samfunnsfag og økonomi", c: ["Rettslære", "Samfunnsøkonomi", "Sosiologi og sosialantropologi", "Historie og filosofi", "Psykologi", "Markedsføring og ledelse"] }
  ] },
  { l: "Teknologi- og industrifag", c: [
    { l: "Industriteknologi", c: ["Industrimekaniker", "CNC-maskineringsfaget", "Sveisefaget"] },
    { l: "Kjøretøy", c: ["Bilfaget, lette kjøretøy", "Bilfaget, tunge kjøretøy", "Bilskadefaget"] },
    { l: "Maritime fag", c: ["Matrosfaget", "Motormannfaget"] },
    { l: "Brønnteknikk", c: ["Boring", "Komplettering"] }
  ] }
];
