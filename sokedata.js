/* ============================================================
   Søkeside-data — MOCKUP basert på teaching_aids-eksporten.
   Modell: TJENESTE (samlested) > LÆREMIDDEL (isPartOf).
   - SK_SERVICES: tjenester (vurdering ligger her), vises først i søk.
   - SK_ITEMS: 120 læremidler, learningResourceType = én av seks.
   - Læremidler arver vurdering fra sin tjeneste.
   ============================================================ */

window.SK_LEVELS = ["Grunnskole","Vidaregående","Voksenopplæring"];

window.SK_TYPES = ["Tjeneste","Digitalt læremiddel","Verktøy","Språkstøtte","Lesestøtte","Digital bok","Fysisk bok"];
/* Fag-taksonomier per nivå (gradeGroup). Grunnskolefag vs Videregåendefag —
   speiler de faktiske filterlistene på laeremiddelkatalogen.sikt.no. */
window.SK_FAG_GRUNNSKOLE = ["Matematikk","Engelsk","Norsk","Naturfag","Samfunnsfag","KRLE","Kunst og håndverk","Musikk","Mat og helse","Kroppsøving","Utdanningsvalg","Historie","Geografi","Samfunnskunnskap","Drama og rytmikk","Norsk fordypning","Norsk tegnspråk","Norsk for elever med tegnspråk","Norsk for elever med samisk","Kvensk eller finsk som andrespråk","Morsmål språklige minoriteter","Fremmedspråk"];
window.SK_FAG_VIDAREGAANDE = ["Engelsk","Norsk","Matematikk 2P","Matematikk 2P-Y","Matematikk P","Matematikk T","Naturfag","Historie","Geografi","Samfunnskunnskap","Religion og etikk","Kroppsøving","Fremmedspråk","Grunnleggende norsk","Norsk kort botid vgo","Norsk tegnspråk","Norsk for elever med tegnspråk","Engelsk for elever med tegnspråk","Norsk for elever med samisk","Kvensk eller finsk som andrespråk","Morsmål språklige minoriteter","Samisk som førstespråk","Samisk som andrespråk 2","Samisk som andrespråk 3","Samisk som andrespråk 4","Bygg- og anleggsteknikk","Elektro og datateknologi","Frisør, blomster, interiør og eksponeringsdesign","Helse- og oppvekstfag","Håndverk, design og produktutvikling","Informasjonsteknologi og medieproduksjon","Naturbruk","Restaurant- og matfag","Salg, service og reiseliv","Teknologi- og industrifag"];
window.SK_FAG = window.SK_FAG_GRUNNSKOLE; /* bakoverkompatibel alias */
window.SK_FAG_VOKSEN = ["Grunnmodul FOV","Engelsk FOV","Matematikk FOV","Naturfag FOV","Norsk FOV","Samfunnsfag FOV","Norsk for språklige minoriteter FOV"];

window.SK_TRINN_GRUNNSKOLE = ["1. trinn","2. trinn","3. trinn","4. trinn","5. trinn","6. trinn","7. trinn","8. trinn","9. trinn","10. trinn"];
window.SK_TRINN_VIDAREGAANDE = ["VG1","VG2","VG3","Påbygging"];
window.SK_TRINN = window.SK_TRINN_GRUNNSKOLE;
window.SK_SPRAK = ["Norsk bokmål","Norsk nynorsk","Engelsk","Ukrainsk","Nordsamisk","Arabisk","Polsk","Russisk","Pashto","Somali","Tigrinja","Tyrkisk","Svensk","Swahili","Fransk","Spansk","Persisk","Dansk","Rumensk","Kurdisk (sorani)","Filippinsk","Islandsk","Litauisk","Dari","Romani","Thai","Urdu","Vietnamesisk","Norsk tegnspråk","Kurdisk","Finsk","Tysk","Nederlandsk","Kurdisk (kurmanji)","Kvensk","Belarusisk","Bulgarsk","Mandarin","Gresk","Ungarsk","Indonesisk","Italiensk","Japansk","Koreansk","Portugisisk","Sørsamisk","Lulesamisk"];
window.SK_MALGRUPPE = ["Elev","Lærer"];
window.SK_TDL = ["Vurdert"];

/* Filterstruktur per nivå (gradeGroup) — speiler de faktiske filtermenyene på
   laeremiddelkatalogen.sikt.no, men kan KOMBINERAST (fleirval av skoleslag).
   Kategori, Språk og Tryggere digital læring er felles. Kvart valt nivå legg til
   si eiga Fag-gruppe; Årstrinn er slått saman (1.–10. + VG-trinn). Ingen Målgruppe.
     - Grunnskole:      "Grunnskolefag"   (flat) + 1.–10. trinn
     - Vidaregående:    "Videregåendefag" (nøsta tre) + VG1–VG3, Påbygging
     - Voksenopplæring: "FOV-fag"         (flat) — INGEN Årstrinn
   uid er unik per gruppe (open/expand-state + React-key); key er filter-nøkkelen
   (fleire Fag-grupper deler key "fag" og skriv difor til same utval). */
window.SK_GROUP_KEYS = ["type", "fag", "trinn", "sprak", "tdl"];

window.skFagGroupForLevel = function (level) {
  if (level === "Vidaregående") return { uid: "fag-vgo", key: "fag", title: "Videregåendefag", options: window.SK_FAG_VIDAREGAANDE, initial: 3, tree: window.SK_FAG_VGO_TREE };
  if (level === "Voksenopplæring") return { uid: "fag-voksen", key: "fag", title: "FOV-fag", options: window.SK_FAG_VOKSEN, initial: 3, tree: null };
  return { uid: "fag-grunnskole", key: "fag", title: "Grunnskolefag", options: window.SK_FAG_GRUNNSKOLE, initial: 3, tree: null };
};

/* Bygg samla filterstruktur for eitt ELLER fleire valde nivå. */
window.skGroupsForLevels = function (levels) {
  levels = levels || [];
  /* Ingen valde nivå = vis alle (default på /soek): alle Fag-grupper + alle årstrinn. */
  var scope = levels.length ? levels : window.SK_LEVELS;
  var sel = window.SK_LEVELS.filter(function (l) { return scope.indexOf(l) !== -1; });
  var groups = [{ uid: "type", key: "type", title: "Kategori", options: window.SK_TYPES, initial: 3 }];
  sel.forEach(function (lv) { groups.push(window.skFagGroupForLevel(lv)); });
  var trinn = [];
  if (sel.indexOf("Grunnskole") !== -1) trinn = trinn.concat(window.SK_TRINN_GRUNNSKOLE);
  if (sel.indexOf("Vidaregående") !== -1) trinn = trinn.concat(window.SK_TRINN_VIDAREGAANDE);
  if (trinn.length) groups.push({ uid: "trinn", key: "trinn", title: "Årstrinn", options: trinn, initial: 3 });
  groups.push({ uid: "sprak", key: "sprak", title: "Språk", options: window.SK_SPRAK, initial: 3 });
  groups.push({ uid: "tdl", key: "tdl", title: "Tryggere digital læring", options: window.SK_TDL, initial: 1 });
  return groups;
};

/* Bakoverkompatibel: eitt nivå. */
window.skGroupsForLevel = function (level) { return window.skGroupsForLevels([level]); };

/* Standard (grunnskole) for evt. eldre referansar. */
window.SK_GROUPS = window.skGroupsForLevels(["Grunnskole"]);

window.SK_FAG_COLOR = {
  "Engelsk": { bg: "var(--sds-blue-95)", fg: "var(--sds-blue-41)" },
  "Matematikk": { bg: "var(--sds-green-89)", fg: "var(--sds-green-15)" },
  "Norsk": { bg: "var(--sds-neutral-95)", fg: "var(--sds-neutral-25)" }
};

window.SK_THUMBS = [
  { bg: "var(--sds-purple-90)", fg: "var(--sds-purple-31)" },
  { bg: "var(--sds-blue-95)", fg: "var(--sds-blue-33)" },
  { bg: "var(--sds-green-89)", fg: "var(--sds-green-15)" },
  { bg: "var(--sds-yellow-91)", fg: "var(--sds-neutral-15)" },
  { bg: "#FCE3EE", fg: "#7a1450" },
  { bg: "var(--sds-purple-95)", fg: "var(--sds-purple-46)" }
];

window.SK_SERVICES = [
 {
  "id": "selevkanalen",
  "kind": "tjeneste",
  "slug": "elevkanalen",
  "name": "Elevkanalen",
  "vendor": "TV 2 Skole AS",
  "desc": "Elevkanalen er en digital tjeneste fra TV 2 Skole AS som samler 258 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": null,
  "platform": [
   "Web",
   "iPad",
   "Android"
  ],
  "login": "Feide",
  "malgruppe": [
   "Lærer",
   "Elev"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Samfunnsfag",
   "Norsk",
   "KRLE",
   "Engelsk",
   "Matematikk",
   "Kunst og håndverk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ],
  "memberTotal": 258
 },
 {
  "id": "sskolerom",
  "kind": "tjeneste",
  "slug": "skolerom",
  "name": "Skolerom",
  "vendor": "Skolerom AS",
  "desc": "Skolerom er en digital tjeneste fra Skolerom AS som samler 186 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Hverdagsglede.png",
  "platform": [
   "Web",
   "iPad"
  ],
  "login": "Microsoft",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "KRLE",
   "Naturfag",
   "Norsk",
   "Samfunnsfag",
   "Samfunnskunnskap",
   "Utdanningsvalg",
   "Kvensk eller finsk som andrespråk",
   "Kunst og håndverk",
   "Engelsk",
   "Historie",
   "Mat og helse",
   "Musikk",
   "Religion og etikk",
   "Geografi"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål",
   "Finsk",
   "Kvensk",
   "Engelsk"
  ],
  "memberTotal": 186
 },
 {
  "id": "screaza",
  "kind": "tjeneste",
  "slug": "creaza",
  "name": "Creaza",
  "vendor": "Creaza AS",
  "desc": "Creaza er en digital tjeneste fra Creaza AS som samler 140 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/cd8392d9-692a-4872-bc28-4923d577b783.webp",
  "platform": [
   "Web"
  ],
  "login": "Ingen innlogging",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Naturfag",
   "Engelsk",
   "Norsk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnskunnskap"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål",
   "Engelsk",
   "Svensk",
   "Arabisk",
   "Persisk",
   "Kurdisk (kurmanji)",
   "Polsk",
   "Pashto",
   "Russisk",
   "Somali",
   "Swahili",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk"
  ],
  "memberTotal": 140
 },
 {
  "id": "snaturfag-no",
  "kind": "tjeneste",
  "slug": "naturfag-no",
  "name": "naturfag.no",
  "vendor": "Universitetet i Oslo",
  "desc": "naturfag.no er en digital tjeneste fra Universitetet i Oslo som samler 95 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": null,
  "platform": [
   "Web",
   "Windows",
   "Mac"
  ],
  "login": "Google",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ],
  "memberTotal": 95
 },
 {
  "id": "sstatped-erher",
  "kind": "tjeneste",
  "slug": "statped-erher",
  "name": "Statped – erher",
  "vendor": "Statped",
  "desc": "Statped – erher er en digital tjeneste fra Statped som samler 64 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/til-ungdommen2.png",
  "platform": [
   "Web",
   "iPad",
   "Android"
  ],
  "login": "Feide",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Norsk tegnspråk",
   "Norsk for elever med tegnspråk",
   "Historie",
   "Samfunnsfag",
   "Samfunnskunnskap",
   "Matematikk",
   "Drama og rytmikk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ],
  "memberTotal": 64
 },
 {
  "id": "ssnakk-om-det",
  "kind": "tjeneste",
  "slug": "snakk-om-det",
  "name": "\"Snakk om det\"",
  "vendor": "Senter for livsmestring AS",
  "desc": "\"Snakk om det\" er en digital tjeneste fra Senter for livsmestring AS som samler 42 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/bbcc5896-d9b0-42ba-a9e6-e8f129c37866.webp",
  "platform": [
   "Web",
   "Windows",
   "Mac"
  ],
  "login": "Google",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Norsk for elever med samisk",
   "Norsk fordypning",
   "Norsk",
   "Mat og helse",
   "Norsk kort botid vgo",
   "Norsk FOV",
   "Samfunnsfag",
   "Samfunnsfag FOV",
   "Naturfag",
   "Norsk for språklige minoriteter FOV",
   "KRLE",
   "Historie",
   "KRLE samisk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Norsk bokmål"
  ],
  "memberTotal": 42
 },
 {
  "id": "sfilmkonsulentene-as",
  "kind": "tjeneste",
  "slug": "filmkonsulentene-as",
  "name": "Filmkonsulentene AS",
  "vendor": "Filmkonsulentene AS",
  "desc": "Filmkonsulentene AS er en digital tjeneste fra Filmkonsulentene AS som samler 38 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/93e5e7bb-818a-4c3a-9950-740308df2bf6.webp",
  "platform": [
   "Web",
   "iPad"
  ],
  "login": "Microsoft",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [],
  "trinn": [
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Vidaregående",
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål",
   "Ukrainsk"
  ],
  "memberTotal": 38
 },
 {
  "id": "sbildetema",
  "kind": "tjeneste",
  "slug": "bildetema",
  "name": "Bildetema",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "desc": "Bildetema er en digital tjeneste fra NAFO - Nasjonalt senter for flerkulturell opplæring som samler 9 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T009a.jpeg",
  "platform": [
   "Web",
   "Android",
   "iPad",
   "Teams"
  ],
  "login": "Feide",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ],
  "memberTotal": 9
 },
 {
  "id": "scampus-inkrement",
  "kind": "tjeneste",
  "slug": "campus-inkrement",
  "name": "Campus Inkrement",
  "vendor": "Inkrement as",
  "desc": "Campus Inkrement er en digital tjeneste fra Inkrement as som samler 4 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://campus.inkrement.no/images/catalog/CM-1-4.png",
  "platform": [
   "Web",
   "iPad",
   "Android"
  ],
  "login": "Feide",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": true,
  "tdl": [
   "Har vurdering"
  ],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Matematikk",
   "Matematikk 2P",
   "Matematikk 2P-Y",
   "Matematikk P",
   "Matematikk T"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ],
  "memberTotal": 4
 },
 {
  "id": "sinfo-vest-forlag",
  "kind": "tjeneste",
  "slug": "info-vest-forlag",
  "name": "Info Vest forlag",
  "vendor": "Info Vest Forlag AS",
  "desc": "Info Vest forlag er en digital tjeneste fra Info Vest Forlag AS som samler 3 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/c1600d8e-97cb-46ed-87cd-c4916fa7a15e.webp",
  "platform": [
   "Web",
   "Android",
   "iPad",
   "Teams"
  ],
  "login": "Feide",
  "malgruppe": [
   "Lærer",
   "Elev"
  ],
  "vurdert": false,
  "tdl": [],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Engelsk",
   "Naturfag",
   "Norsk",
   "KRLE",
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Belarusisk",
   "Tysk",
   "Engelsk",
   "Fransk",
   "Nederlandsk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Russisk",
   "Spansk",
   "Svensk",
   "Ukrainsk"
  ],
  "memberTotal": 3
 },
 {
  "id": "sskaperskolen",
  "kind": "tjeneste",
  "slug": "skaperskolen",
  "name": "Skaperskolen",
  "vendor": "Universitetet i Oslo",
  "desc": "Skaperskolen er en digital tjeneste fra Universitetet i Oslo som samler 3 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": null,
  "platform": [
   "Web",
   "iPad"
  ],
  "login": "Microsoft",
  "malgruppe": [
   "Lærer",
   "Elev"
  ],
  "vurdert": false,
  "tdl": [],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ],
  "memberTotal": 3
 },
 {
  "id": "syou-portalen",
  "kind": "tjeneste",
  "slug": "you-portalen",
  "name": "YOU-portalen",
  "vendor": "Skoledata AS",
  "desc": "YOU-portalen er en digital tjeneste fra Skoledata AS som samler 3 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/a92b0e63-a0c8-48b6-841d-8c28728635f6.webp",
  "platform": [
   "Web",
   "Android",
   "iPad",
   "Teams"
  ],
  "login": "Feide",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": false,
  "tdl": [],
  "type": [
   "Tjeneste"
  ],
  "fag": [],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ],
  "memberTotal": 3
 },
 {
  "id": "sminkunnskap",
  "kind": "tjeneste",
  "slug": "minkunnskap",
  "name": "minKunnskap",
  "vendor": "Cyberbook AS",
  "desc": "minKunnskap er en digital tjeneste fra Cyberbook AS som samler 2 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://kunnskap.no/1879-large_default/syklus-5-7_12_spraak.jpg",
  "platform": [
   "Web",
   "Windows",
   "Mac"
  ],
  "login": "Google",
  "malgruppe": [
   "Elev"
  ],
  "vurdert": false,
  "tdl": [],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Pashto",
   "Russisk",
   "Somali",
   "Swahili",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk"
  ],
  "memberTotal": 2
 },
 {
  "id": "skikora",
  "kind": "tjeneste",
  "slug": "kikora",
  "name": "Kikora",
  "vendor": "Inkrement as",
  "desc": "Kikora er en digital tjeneste fra Inkrement as som samler 2 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://cdn.prod.website-files.com/678514238b5c44db27e4beb0/67851c6eda7a48918cc53126_kikora-logo.svg",
  "platform": [
   "Web"
  ],
  "login": "Ingen innlogging",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": false,
  "tdl": [],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ],
  "memberTotal": 2
 },
 {
  "id": "spickatale",
  "kind": "tjeneste",
  "slug": "pickatale",
  "name": "Pickatale ",
  "vendor": "Pickatale AS",
  "desc": "Pickatale  er en digital tjeneste fra Pickatale AS som samler 1 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/55d73837-75da-4f03-a6c1-904a2a3512a2.webp",
  "platform": [
   "Web",
   "iPad",
   "Android"
  ],
  "login": "Feide",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": false,
  "tdl": [],
  "type": [
   "Tjeneste"
  ],
  "fag": [],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Arabisk",
   "Bulgarsk",
   "Mandarin",
   "Dansk",
   "Tysk",
   "Gresk",
   "Engelsk",
   "Finsk",
   "Fransk",
   "Ungarsk",
   "Indonesisk",
   "Italiensk",
   "Japansk",
   "Koreansk",
   "Nederlandsk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Portugisisk",
   "Rumensk",
   "Russisk",
   "Spansk",
   "Svensk",
   "Tyrkisk",
   "Ukrainsk"
  ],
  "memberTotal": 1
 },
 {
  "id": "splanetpsyd-no",
  "kind": "tjeneste",
  "slug": "planetpsyd-no",
  "name": "Planetpsyd.no",
  "vendor": "Studiofreya Consulting AS",
  "desc": "Planetpsyd.no er en digital tjeneste fra Studiofreya Consulting AS som samler 1 læremidler for grunnopplæringen. Innholdet dekker flere fag og trinn, og brukes både av elever og lærere.",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/bcf73be0-341e-44f8-b218-7dc942ec3e7b.webp",
  "platform": [
   "Web"
  ],
  "login": "Ingen innlogging",
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "vurdert": false,
  "tdl": [],
  "type": [
   "Tjeneste"
  ],
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ],
  "memberTotal": 1
 }
];

window.SK_ITEMS = [
 {
  "id": 1,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Til ungdommen - for livsmestring",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/til-ungdommen/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/til-ungdommen2.png",
  "desc": "Læremiddelet inneholder 12 tekster som handler om det å være ungdom, sett fra ungdoms perspektiv.",
  "fag": [
   "Norsk tegnspråk",
   "Norsk for elever med tegnspråk"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 2,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Gråtende hender",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/gratende-hender/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/gratende-hender2.png",
  "desc": "En nettressurs med forestillingen Gråtende hender av Teater Manu, med tilhørende undervisningsmateriell.",
  "fag": [
   "Historie",
   "Samfunnsfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 3,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Tospråklige eventyr",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/tospraklige-eventyr/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/tospraklige-eventyr.png",
  "desc": "Eventyr er dannelseshistorier som ruster oss for livet. I denne ressursen er det eventyr fra Asbjørnsen og Moe, H.C. Andersen og brødrene Grimm som skal bidra til dette, samt fire eventyr fra fjernere land.",
  "fag": [
   "Norsk tegnspråk",
   "Norsk for elever med tegnspråk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 4,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Demokrati",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/demokrati/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/demokrati.png",
  "desc": "Norge er et demokrati. Hva det vil si, og hvordan denne styreformen har utviklet seg og blitt det den er i dag, er tema i dette læremidlet.",
  "fag": [
   "Historie",
   "Samfunnsfag",
   "Samfunnskunnskap"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 5,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Eventyret om Pannekaka, av Asbjørnsen og Moe",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/eventyret-om-pannekaka-av-asbjornsen-og-moe/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/eventyret-om-pannekaka.png",
  "desc": "– med oppgaver og illustrasjoner til nedlastning. Eventyret kan være til ren underholdning, men egner seg også i pedagogiske sammenhenger.",
  "fag": [
   "Norsk tegnspråk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 6,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza naturfag 5-7",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/naturfag5-7",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/cd8392d9-692a-4872-bc28-4923d577b783.webp",
  "desc": "Creaza naturfag 5-7 er et komplett læremiddel i naturfag med en praktisk, skapende og kreativ tilnærming til faget! Komplett og heldigitalt Fokus på praktiske oppgaver Utforskning og refleksjon Elevaktivt læremiddel Lett å tilpasse Dynamisk og relevant Læremiddelets struktur Læremiddelet er…",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 7,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza Core",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com",
  "thumb": "https://creaza-static-files.s3.eu-west-1.amazonaws.com/public_img/creaza_logo.png",
  "desc": "Creaza Core er et nettbasert læremiddel som lar elever og lærere skape flotte digitale fortellinger, filmer, animasjoner, tegneserier, podkaster, lydmikser, tankekart og presentasjoner. Creaza Core består av kreative verktøy med faglig innhold og hundrevis av ferdiglagde oppgaver. Med Creaza får…",
  "fag": [
   "Engelsk",
   "Naturfag",
   "Norsk",
   "KRLE",
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Engelsk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Svensk"
  ]
 },
 {
  "id": 8,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Andreas Christian Møller",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/andreas-christian-moller/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/acm-200.png",
  "desc": "Visste du at en mann ved navn Andreas Christian Møller var den første i Norge som startet en skole for døve barn? Han regnes som døveundervisningens far, og i 1825 grunnla han Norges aller første døveskole i Trondheim!",
  "fag": [
   "Norsk tegnspråk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 9,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Geitekillingen som kunne telle til ti",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/geitekillingen-som-kunne-telle-til-ti/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/geitekillingen.png",
  "desc": "Den actionfylte fortellingen er fylt med glede, redsel, litt tristhet og en god dose stolthet. Her kan en også bryne seg på digitale og analoge oppgaver, og ei telleregle.",
  "fag": [
   "Matematikk",
   "Drama og rytmikk",
   "Norsk tegnspråk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 10,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Verktøykofferten",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/verktoykofferten/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/verktoykofferten.jpg",
  "desc": "Undervisningsopplegget har en tekstbasert tilnærming til grammatikk.",
  "fag": [
   "Norsk tegnspråk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 11,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Eidsvoll 1814 – omvisning med tolk (barnetrinnet)",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/eidsvoll-1814-omvisning-med-tolk-3-4/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/eidsvoll-1814.png",
  "desc": "Eidsvoll 1814 tilbyr omvisninger for skoleklasser og i denne ressursen tar en av museets guider oss med på en historisk reise med omvisningen «17.mai og Grunnloven».",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 12,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Eidsvoll 1814 – omvisning med tolk (ungdomstrinnet)",
  "vendor": "Statped",
  "serviceName": "Statped – erher",
  "url": "https://ressurser-tegnsprak.statped.no/eidsvoll-1814-omvisning-med-tolk-8-10/",
  "thumb": "https://ressurser-tegnsprak.statped.no/globalassets/erher/bilder/01-produktbilder/eidsvoll-1814---ungdomstrinn-v2.png",
  "desc": "Eidsvoll 1814 tilbyr omvisninger for skoleklasser og i denne ressursen tar en av museets guider oss med på en historisk reise med omvisningen «Et modig oppgjør».",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk tegnspråk"
  ]
 },
 {
  "id": 13,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Syklus 5-7",
  "vendor": "Cyberbook AS",
  "serviceName": "minKunnskap",
  "url": "https://min.kunnskap.no/Kunnskap/Demo_Kapitler_2025/toc/next/~structure",
  "thumb": "https://kunnskap.no/1879-large_default/syklus-5-7_12_spraak.jpg",
  "desc": "Tospråklig naturfag for mellomtrinnet på 12 språk! Med Syklus kan eleven høre, se, snakke, forstå og kommunisere de naturfaglige begrepene på norsk og eget språk.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Pashto",
   "Russisk",
   "Somali",
   "Swahili",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk"
  ]
 },
 {
  "id": 14,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "IKONER",
  "vendor": "Cyberbook AS",
  "serviceName": "minKunnskap",
  "url": "https://min.kunnskap.no/Kunnskap/Demo_Kapitler_2025/toc/next/~structure",
  "thumb": "https://kunnskap.no/1864-large_default/ikoner-pa-12-spraak.jpg",
  "desc": "Tospråklig naturfag for 5. trinn til videregående på 12 språk! Med IKONER kan eleven høre, se, snakke, forstå og kommunisere de naturfaglige begrepene på norsk og eget språk.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk",
   "Norsk bokmål",
   "Polsk",
   "Pashto",
   "Russisk",
   "Somali",
   "Swahili",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk"
  ]
 },
 {
  "id": 15,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Alfabetplaneten ",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://alphabetplanet.creaza.com/",
  "thumb": "https://creaza-static-files.s3.eu-west-1.amazonaws.com/public_img/alfabetplaneten.png",
  "desc": "På Alfabetplaneten utvikler elevene lese- og skriveferdigheter gjennom sosial og lekende læring i et engasjerende univers. På Alfabetplaneten får du blant annet tilgang på: - Sanger som hjelper deg ramme inn dagene, og som kan få energien i klasserommet både opp og ned. - Visualiserte og innleste…",
  "fag": [
   "Norsk",
   "KRLE",
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 16,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Hverdagsglede Skole for barnetrinn",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/velkommen-til-hverdagsglede-skole-barnetrinn/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Hverdagsglede.png",
  "desc": "Den psykiske helses ‹5 om dagen»: Gjennom varierte aktiviteter inviteres elevene til å lære hvordan små, bevisste valg i hverdagen kan styrke deres psykiske helse og gi bedre livskvalitet for dem selv og andre. Med fokus på de 5 gode vanene; vær oppmerksom, vær aktiv, fortsett å lære, knytt bånd og…",
  "fag": [
   "KRLE"
  ],
  "trinn": [
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 17,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Hverdagsglede Skole for ungdomstrinn",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/velkommen-til-hverdagsglede-skole-ungdomstrinn/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Hverdagsglede.png",
  "desc": "Den psykiske helsens ‹5 om dagen»: Gjennom varierte aktiviteter inviteres elevene til å lære hvordan små, bevisste valg i hverdagen kan styrke deres psykiske helse og gi bedre livskvalitet for dem selv og andre. Med fokus på de 5 gode vanene; vær oppmerksom, vær aktiv, fortsett å lære, knytt bånd…",
  "fag": [
   "KRLE"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 18,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Ungdom og rus",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/ungdom-og-rus/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Ungdom-og-rus.png",
  "desc": "Undervisningsopplegg som fremmer bevisstgjøring rundt rus og rusbruk. Målet er å gi elevene et godt grunnlag for å ta egne valg. I opplegget er det artikler, dilemmatekster og fortellinger som informerer og inviterer til refleksjon om årsaker til og konsekvenser av rusbruk. Ved kjøp av lisens får…",
  "fag": [
   "Naturfag",
   "Norsk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnskunnskap"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 19,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Sex i mente",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/sex-i-mente/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Sex-i-mente.png",
  "desc": "«Sex i mente» er en stor ressurspakke med varierte undervisningsopplegg om seksualitet og seksuell helse. Her får du faglig oppdatert innhold som er engasjerende, lekent og direkte, samtidig som det er seriøst, trygt og informativt. Ved kjøp av lisens får lærere og elever tilgang til alle våre…",
  "fag": [
   "Naturfag",
   "Norsk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnskunnskap"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 20,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Utdanningsvalg",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/utdanningsvalg/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Utdanningsvalg.png",
  "desc": "Komplett, digital undervisningsressurs i faget utdanningsvalg. I tillegg får du en rekke kopioriginaler til utskrift for analogt arbeid. Utdanningsvalg handler om å finne sine egne styrker, interesser og muligheter for fremtiden. Faget skal hjelpe elevene med å ta bevisste valg om utdanning og…",
  "fag": [
   "Utdanningsvalg"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 21,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Kvensk eller finsk som andrespråk ",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/finsk-og-kvensk-som-andresprak/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Kvensk-og-finsk.png",
  "desc": "Kvensk eller finsk som andrespråk er en viktig del av vår opplæring. Det gir ikke bare språkkompetanse, men også en bredere forståelse av kulturelt mangfold. Gjennom faget kan elevene utvikle egen identitet, språkferdigheter, og få et mer mangfoldig kulturelt perspektiv, samtidig som de utvikler en…",
  "fag": [
   "Kvensk eller finsk som andrespråk"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Finsk",
   "Kvensk"
  ]
 },
 {
  "id": 22,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Hjernelæring",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/hjernelaering/",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/debbafc2-48be-4e9d-ac39-af0528db61e9.jpg",
  "desc": "Godt klassemiljø = bedre læringsmiljø! 40 ulike temaer i alderstilpassede lesespor og oppgaver som bidrar til å bygge et trygt klassemiljø slik at elevene får beste mulige forutsetninger for læring. Artiklene dekker både overordnede deler av læreplanen samt kompetansemål innen KRLE, naturfag, norsk…",
  "fag": [
   "Kunst og håndverk",
   "Naturfag",
   "Norsk",
   "KRLE"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 23,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Norsk for VGS",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/fellesfag-for-videregaende-skole/norsk-for-videregaende-skole/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Norsk-VGS.png",
  "desc": "Norsk for Vgs fellesfag er et digitalt læremiddel med seks temaer med aktuelle artikler, oppgaver og komplette læringsstier som gir engasjerende og aktuell undervisning. Ved kjøp av lisens får lærere og elever tilgang til alle våre læringsressurser, deriblant norsk, engelsk, samfunnskunnskap og…",
  "fag": [
   "Norsk"
  ],
  "trinn": [
   "VG1",
   "VG2"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 24,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": false,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [],
  "title": "WriteReader",
  "vendor": "Info Vest Forlag AS",
  "serviceName": "Info Vest forlag",
  "url": "https://app.writereader.com",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/c1600d8e-97cb-46ed-87cd-c4916fa7a15e.webp",
  "desc": "WriteReader er et enkelt og intuitivt digitalt verktøy, hvor barn fra skolen kan lage sine egne digitale bøker og fortløpende utvikle viktig kompetanse i tale- og skriftspråk. WriteReader gjør det enkelt og gøy for barn å skrive egne bøker supplert med lyd og bilder. Det er et forskningsbasert…",
  "fag": [
   "Engelsk",
   "Naturfag",
   "Norsk",
   "KRLE",
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Belarusisk",
   "Tysk",
   "Engelsk",
   "Fransk",
   "Nederlandsk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Russisk",
   "Spansk",
   "Svensk",
   "Ukrainsk"
  ]
 },
 {
  "id": 25,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Begrepsforståelse",
  "vendor": "Info Vest Forlag AS",
  "serviceName": "Info Vest forlag",
  "url": "https://begrep.spesialpedagog.no/",
  "thumb": "https://begrep.spesialpedagog.no/content/images/loginpage.png",
  "desc": "Begrepsforståelse er tenkt som et hjelpemiddel for alle barn det første året i skolen og barn som har utfordringer med begreper. Mens barnet gjennomfører kartleggingen blir resultatet automatisk registrert. Resultatet ses umiddelbart når barnet er ferdig. Barnets resultat vises ved 12 ulike…",
  "fag": [],
  "trinn": [
   "1. trinn",
   "2. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 26,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Språklig",
  "vendor": "Info Vest Forlag AS",
  "serviceName": "Info Vest forlag",
  "url": "https://spraklig.spesialpedagog.no/",
  "thumb": "https://spraklig.spesialpedagog.no/content/images/alt_loggin_spraaklig.png",
  "desc": "I Språklig møter elevene språket på flere ulike måter: gjennom myldrebilder, rammefortellinger og ikke minst mange varierte aktiviteter. Elevenes tidligere erfaringer og ordforråd har stor betydning for språkutviklingen. Erfaringene gir elevene “knagger” som de kan henge nye ord og ny kunnskap på.…",
  "fag": [],
  "trinn": [
   "1. trinn",
   "2. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 27,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Engelsk for VGS",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/fellesfag-for-videregaende-skole/engelsk-for-videregaende-skole/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Engelsk-VGS.png",
  "desc": "English is central to cultural understanding and communication, establishing a foundation for global interaction and the development of intercultural understanding in a society that demands strong English skills. Students become confident language users who explore language, understand culturally…",
  "fag": [
   "Engelsk"
  ],
  "trinn": [
   "VG1"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Engelsk"
  ]
 },
 {
  "id": 28,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Campus Matte 1 - 4",
  "vendor": "Inkrement as",
  "serviceName": "Campus Inkrement",
  "url": "https://campus.inkrement.no/Home/CampusMatte_1_4",
  "thumb": "https://campus.inkrement.no/images/catalog/CM-1-4.png",
  "desc": "Campus Matte 1-4 er et komplett læreverk basert på aktiv læring, hvor læreren får god tid til lek, utforsking og matematisk samtale med elevene. Dette er et komplett læreverk som inneholder både teori, oppgaver, prøver og aktiviteter til klasserommet. Gode læringsdata gir lærer full oversikt og…",
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 29,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Campus Matte 5 - 7",
  "vendor": "Inkrement as",
  "serviceName": "Campus Inkrement",
  "url": "https://campus.inkrement.no/Home/CampusMatte_5_7",
  "thumb": "https://campus.inkrement.no/images/catalog/CM-5-7.png",
  "desc": "Campus Matte er utviklet til Kunnskapsløftet 2020 med vekt på dybdelæring og tilpasset opplæring. Dette er et komplett læreverk som inneholder teori, nivådifferensierte oppgaver, prøver og aktiviteter til klasserommet. God matematikkundervisning handler om å gjøre rett ting på rett sted. Omvendt…",
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 30,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Campus Matte 8 - 10",
  "vendor": "Inkrement as",
  "serviceName": "Campus Inkrement",
  "url": "https://campus.inkrement.no/Home/CampusMatte_8_10",
  "thumb": "https://campus.inkrement.no/images/catalog/CM-8-10.png",
  "desc": "Campus Matte er utviklet til Kunnskapsløftet 2020 med vekt på dybdelæring og tilpasset opplæring. Dette er et komplett læreverk som inneholder teori, nivådifferensierte oppgaver, prøver og aktiviteter til klasserommet. God matematikkundervisning handler om å gjøre rett ting på rett sted. Omvendt…",
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 31,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Campus Matte VGS",
  "vendor": "Inkrement as",
  "serviceName": "Campus Inkrement",
  "url": "https://campus.inkrement.no/Home/CampusMatte_VGS",
  "thumb": "https://campus.inkrement.no/images/catalog/CM-VGS.png",
  "desc": "Campus Matte er utviklet til Kunnskapsløftet 2020 med vekt på dybdelæring og tilpasset opplæring. Dette er et komplett læreverk som inneholder teori, nivådifferensierte oppgaver, prøver og aktiviteter til klasserommet. God matematikkundervisning handler om å gjøre rett ting på rett sted. Omvendt…",
  "fag": [
   "Matematikk 2P",
   "Matematikk 2P-Y",
   "Matematikk P",
   "Matematikk T"
  ],
  "trinn": [
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 32,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Kikora 5 - 7",
  "vendor": "Inkrement as",
  "serviceName": "Kikora",
  "url": "https://feide.kikora.no/",
  "thumb": "https://cdn.prod.website-files.com/678514238b5c44db27e4beb0/67851c6eda7a48918cc53126_kikora-logo.svg",
  "desc": "Med Kikora 5-7 tar eleven aktiv del i egen læring gjennom å utforske interaktive og dynamiske oppgaver. Umiddelbare tilbakemeldinger på alle utregninger gjør eleven oppmerksom på hva som er rett og galt. På denne måten blir eleven mer selvstendig i eget arbeid. Med nivådifferensierte læringsstier,…",
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 33,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Kikora 8 - 10",
  "vendor": "Inkrement as",
  "serviceName": "Kikora",
  "url": "https://feide.kikora.no/",
  "thumb": "https://cdn.prod.website-files.com/678514238b5c44db27e4beb0/67851c6eda7a48918cc53126_kikora-logo.svg",
  "desc": "Kikora 8-10 er bygget opp av utforskende læringspakker som aktiviserer eleven i interaktive oppgaver. Med umiddelbare tilbakemeldinger på alle utregninger blir eleven mer selvdreven, og oppmerksom på rette og gale mellomregninger. Nivådifferensierte læringsstier og tilgang til innhold på alle trinn…",
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 34,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza KRLE 5-7",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/krle5-7",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/c537f68d-9ce9-4216-82c5-9b66e9f90fb9.webp",
  "desc": "Creaza KRLE er et heldigitalt, spennende og engasjerende læremiddel i KRLE for mellomtrinnet. Læremiddelet fremmer refleksjon, utforskning og kreativitet. Komplett og heldigitalt Aktuelt og engasjerende Utforskning og refleksjon Elevaktivt læremiddel Lett å tilpasse Dynamisk og relevant Tverrfaglig…",
  "fag": [
   "KRLE"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 35,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza samfunnsfag 5-7",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/samfunn5-7",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/50ac5826-2ce5-4c58-bf0f-7145da9e526e.webp",
  "desc": "Creaza samfunn 5-7 er et heldigitalt, spennende og engasjerende læremiddel i samfunnsfag for mellomtrinnet. - Komplett og heldigital - Aktuelt og engasjerende - Elevaktivt læremiddel - Lett å tilpasse - Dynamisk og relevant Læremiddelets struktur Læremiddelet er organisert i åtte moduler med…",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 36,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Samfunnsfag for 5.–7. trinn",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/samfunnsfag-5-7-trinn/",
  "thumb": "https://skolerom.no/wp-content/uploads/sites/2/2025/05/Samfunnsfag-5.-7-scaled.jpg",
  "desc": "I Skolerom møter elevene samfunnsfaget gjennom tankevekkende læringsstier med oppgaver og artikler skrevet i tre lesespor. Slik sikrer vi at alle elever, uansett nivå, får tilgang til kunnskapen og kan delta i samtaler om viktige samfunnstemaer. Våre emner kan hjelpe lærerne med å møte læreplanens…",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 37,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Samfunnskunnskap",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/fellesfag-for-videregaende-skole/samfunnskunnskap-for-videregaende-skole/",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/d44d51b8-7829-4f08-8393-62bc21e437a2.jpg",
  "desc": "Samfunnskunnskap for VG1 og VG2 er delt i ti ulike temaer. Til hvert tema finner du en rekke aktuelle artikler og læringsstier. Du kan bruke disse som de er, eller tilpass til dine elever. Slik skaper du en engasjerende undervisning. Til sammen dekker artiklene og læringsstiene hele faget, så her…",
  "fag": [
   "Samfunnskunnskap"
  ],
  "trinn": [
   "VG1",
   "VG2"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 38,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bokasiner på Skolerom",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/bokasiner/",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/3ff01050-f066-477e-b577-71825cba3995.jpg",
  "desc": "Vårt digitale bokasinbibliotek dekker kunnskapstørst for barn og voksne i alle aldre. Vi har rikt illustrerte faktabøker/magasiner som gir fagkunnskap, leseglede og lesetrening. Ved kjøp av lisens får lærere og elever tilgang til alle våre læringsressurser i tillegg til bokasinene. Vi har over 500…",
  "fag": [
   "Historie",
   "Mat og helse",
   "Musikk",
   "Naturfag",
   "Norsk",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnskunnskap"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 39,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Geografi",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/fellesfag-for-videregaende-skole/geografi-for-videregaende-skole/",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/28a5e00d-e55d-4168-9183-4a391092a12f.jpg",
  "desc": "Geografi på videregående skole er en utforskning av verden rundt oss på et dypere nivå. Geografi utforsker forholdet mellom mennesker og miljø, kulturelle mønstre, og hvordan steder er knyttet sammen globalt. Gjennom geografi skal elevene utvikle forståelse for bærekraft, klimaendringer,…",
  "fag": [
   "Geografi"
  ],
  "trinn": [
   "VG1",
   "VG2"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 40,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Norsk 1. - 4. trinn",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/fagside-barnetrinn-norsk/smatrinn/",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/ee957186-a082-479e-9da7-89c89af66ebd.jpg",
  "desc": "I Skolerom finner du ikke den tradisjonelle leseboka, men du finner et digitalt bibliotek med et stort utvalg artikler i tre lesespor. Her får elevene tilgang til et mangfold med ulike tekster i flere sjangre. Lærer kan tildele lesespor som tilsvarer elevenes leseferdigheter, men elevene kan også…",
  "fag": [
   "Norsk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 41,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Norsk 5. – 7. trinn",
  "vendor": "Skolerom AS",
  "serviceName": "Skolerom",
  "url": "https://skolerom.no/fagside-mellomtrinn-norsk/",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/f240f225-9471-4c68-ba06-a29ddf7cebf1.jpg",
  "desc": "I Skolerom finner du ikke den tradisjonelle leseboka, men du finner et digitalt bibliotek med et stort utvalg artikler i tre lesespor. Her får elevene tilgang til et språklig mangfold av tekster i flere sjangre. Våre seks temaer hjelper lærerne å møte læreplanens krav, samtidig som de gir elevene…",
  "fag": [
   "Norsk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 42,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "naturfag.no, 1.–2. trinn",
  "vendor": "Universitetet i Oslo",
  "serviceName": "naturfag.no",
  "url": "https://www.naturfag.no/undervisningsprogram/vis.html?tid=2271528",
  "thumb": null,
  "desc": "Undervisningsoppleggene består av lekende og utforskende aktiviteter. Gjennom aktivitetene blir elevene gradvis kjent med naturvitenskap og teknologi.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 43,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "naturfag.no, 3.–4. trinn",
  "vendor": "Universitetet i Oslo",
  "serviceName": "naturfag.no",
  "url": "https://www.naturfag.no/undervisningsprogram/vis.html?tid=2271531",
  "thumb": null,
  "desc": "I disse undervisningsoppleggene øver elevene på natur­vitenskapelige eller teknologiske praksiser og tenkemåter. Oppleggene bygger på didaktiske prinsipper for å oppnå dybdelæring.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 44,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "naturfag.no, 5.–7. trinn",
  "vendor": "Universitetet i Oslo",
  "serviceName": "naturfag.no",
  "url": "https://www.naturfag.no/undervisningsprogram/vis.html?tid=2271534",
  "thumb": null,
  "desc": "I disse undervisningsoppleggene øver elevene på natur­vitenskapelige eller teknologiske praksiser og tenkemåter. Oppleggene bygger på didaktiske prinsipper for å oppnå dybdelæring.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 45,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "naturfag.no, 8.–10. trinn",
  "vendor": "Universitetet i Oslo",
  "serviceName": "naturfag.no",
  "url": "https://www.naturfag.no/undervisningsprogram/vis.html?tid=2271537",
  "thumb": null,
  "desc": "I disse undervisningsoppleggene øver elevene på natur­vitenskapelige eller teknologiske praksiser og tenkemåter. Oppleggene bygger på didaktiske prinsipper for å oppnå dybdelæring.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 46,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "naturfag.no, vgs",
  "vendor": "Universitetet i Oslo",
  "serviceName": "naturfag.no",
  "url": "https://www.naturfag.no/undervisningsprogram/vis.html?tid=2271540",
  "thumb": null,
  "desc": "I disse undervisningsoppleggene øver elevene på natur­vitenskapelige eller teknologiske praksiser og tenkemåter. Oppleggene bygger på didaktiske prinsipper for å oppnå dybdelæring.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "VG1",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 47,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Naturfag i yrkesfag",
  "vendor": "Universitetet i Oslo",
  "serviceName": "naturfag.no",
  "url": "https://www.naturfag.no/seksjon.html?tid=2266197",
  "thumb": null,
  "desc": "Her finner du ressurser i de ulike programområdene.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "VG1"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 48,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": false,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [],
  "title": "Skaperskolen, 1.–4. trinn",
  "vendor": "Universitetet i Oslo",
  "serviceName": "Skaperskolen",
  "url": "https://skaperskolen.no/1-4-trinn/",
  "thumb": null,
  "desc": "Sentrale mål for Skaperskolen er at elevene skal oppleve mening og mestring. Elevene lærer gjennom lekende og praktiske aktiviteter. Skaperskolens verdigrunnlag og metodikk kan bidra til en mer variert, motiverende og engasjerende skole som ruster elevene med ferdigheter for fremtiden, samt bidra…",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 49,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Skaperskolen, 5.–7. trinn",
  "vendor": "Universitetet i Oslo",
  "serviceName": "Skaperskolen",
  "url": "https://skaperskolen.no/5-7-trinn/",
  "thumb": null,
  "desc": "Sentrale mål for Skaperskolen er at elevene skal oppleve mening og mestring. Elevene lærer gjennom lekende og praktiske aktiviteter. Skaperskolens verdigrunnlag og metodikk kan bidra til en mer variert, motiverende og engasjerende skole som ruster elevene med ferdigheter for fremtiden, samt bidra…",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 50,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Skaperskolen, 8.–10. trinn",
  "vendor": "Universitetet i Oslo",
  "serviceName": "Skaperskolen",
  "url": "https://skaperskolen.no/8-10-trinn/",
  "thumb": null,
  "desc": "Sentrale mål for Skaperskolen er at elevene skal oppleve mening og mestring. Elevene lærer gjennom lekende og praktiske aktiviteter. Skaperskolens verdigrunnlag og metodikk kan bidra til en mer variert, motiverende og engasjerende skole som ruster elevene med ferdigheter for fremtiden, samt bidra…",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 51,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Skoletest",
  "vendor": "Skoledata AS",
  "serviceName": "YOU-portalen",
  "url": "https://you-portalen.no",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/a92b0e63-a0c8-48b6-841d-8c28728635f6.webp",
  "desc": "Verktøy for interesse­kartlegging, utforskning og veilednings­samtale for elever i ungdoms­skolen og vgs. Utgaven for valg/omvalg av videre­gående utdanning kommer i både tekst- og bildebasert variant.",
  "fag": [],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 52,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Karrierepermen",
  "vendor": "Skoledata AS",
  "serviceName": "YOU-portalen",
  "url": "https://you-portalen.no",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/f5f466e3-0a75-4cef-88d1-fa27e6471f9f.webp",
  "desc": "Et digitalt læremiddel for faget utdanningsvalg samt karriere­arbeid på vgs. Tjenesten er integrert med våre øvrige tjenester, slik at elevene gjennom denne får tilgang til sine Skoletest-profiler og hospiteringer.",
  "fag": [],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 53,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Hospitering",
  "vendor": "Skoledata AS",
  "serviceName": "YOU-portalen",
  "url": "https://you-portalen.no",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/fe9c7447-b235-4bd9-89a5-0071d706304e.webp",
  "desc": "Hjelpemiddel for skoler og skoleeier (fylke/kommune) til å administrere utprøvings­perioder og bedrifts­besøk. Tjenesten brukes som informasjons­kanal mot elever og foresatte, samt til gjennom­føring og administrasjon av elevenes valg. Løsningen er i vekst, og benyttes i dag i en av fem kommuner.",
  "fag": [],
  "trinn": [
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 54,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Pickatale Create - KI-verktøyet som lager bøker for alle fag",
  "vendor": "Pickatale AS",
  "serviceName": "Pickatale ",
  "url": "https://app.pickatale.com/book-creator/create",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/55d73837-75da-4f03-a6c1-904a2a3512a2.webp",
  "desc": "LAG BØKER TILPASSET UNDERVISNINGEN PÅ 1-2-3! Med Pickatale Create kan lærere enkelt lage bøker som støtter læreplanen, og som passer med både planlagte temaer og ulike fag. Skap engasjerende innhold som fanger elevenes interesse og sparer deg for timer med forberedelser. Utforsk uendelige…",
  "fag": [],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Arabisk",
   "Bulgarsk",
   "Mandarin",
   "Dansk",
   "Tysk",
   "Gresk",
   "Engelsk",
   "Finsk",
   "Fransk",
   "Ungarsk",
   "Indonesisk",
   "Italiensk",
   "Japansk",
   "Koreansk",
   "Nederlandsk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Portugisisk",
   "Rumensk",
   "Russisk",
   "Spansk",
   "Svensk",
   "Tyrkisk",
   "Ukrainsk"
  ]
 },
 {
  "id": 55,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Brøkhefte for barneskolen",
  "vendor": "Studiofreya Consulting AS",
  "serviceName": "Planetpsyd.no",
  "url": "https://planetpsyd.no/product/brokhefte-v5/",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/bcf73be0-341e-44f8-b218-7dc942ec3e7b.webp",
  "desc": "Et øvingshefte fylt med varierte oppgaver i brøkregning, laget for elever på 5.–7. trinn, ungdomsskoletrinnet og alle som ønsker å friske opp brøkferdighetene sine. Heftet starter med en introduksjon til brøkbegrepet og forklarer de viktigste termene. Deretter følger enkle og visuelle oppgaver som…",
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 56,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza KRLE 8-10",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/krle8-10",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/7e505a37-a094-4f2e-95a5-96a11fc188ac.webp",
  "desc": "Creaza KRLE er et heldigitalt, spennende og engasjerende læremiddel i KRLE for ungdomstrinnet. Læremiddelet fremmer refleksjon, utforskning og kreativitet. Komplett og heldigitalt Aktuelt og engasjerende Utforskning og refleksjon Elevaktivt læremiddel Lett å tilpasse Dynamisk og relevant…",
  "fag": [
   "KRLE"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 57,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza naturfag 8-10",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/naturfag8-10",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/ddfff23f-404f-4ea4-a7b5-f92d1774d619.webp",
  "desc": "Creaza naturfag 8-10 er et komplett læremiddel i naturfag med en praktisk, skapende og kreativ tilnærming til faget! Komplett og heldigitalt Fokus på praktiske oppgaver Utforskning og refleksjon Elevaktivt læremiddel Lett å tilpasse Dynamisk og relevant Læremiddelets struktur Læremiddelet er…",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 58,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza samfunnsfag 8-10",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/samfunn8-10",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/3a9f9196-9085-448f-bcad-a276fa84f5f8.webp",
  "desc": "Creaza samfunn - Et inkluderende læremiddel i samfunnsfag Creaza samfunn er et unikt, heldigitalt og komplett læremiddel i samfunnsfag! Creaza samfunn er et komplett, heldigitalt, åpent og temabasert læremiddel i samfunnsfag for ungdomstrinnet. Læremiddelet består av moduler og undertema, laget for…",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 59,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Begrepsbanken",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://portal.creaza.com/?page=Concept",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/de44b013-06e5-40e7-824a-d7f7021fa789.webp",
  "desc": "I begrepsbanken finner du over 800 sentrale begreper visualisert og forklart med tilhørende definisjon oversatt på 14 språk. Begreper er mer enn bare bokstaver satt sammen til ord på en fornuftig måte. Begreper har meningsbærende innhold - de betyr noe! I dem ligger det nøkler til å forstå seg selv…",
  "fag": [
   "Naturfag",
   "Norsk",
   "KRLE",
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Arabisk",
   "Engelsk",
   "Persisk",
   "Kurdisk (kurmanji)",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Pashto",
   "Russisk",
   "Somali",
   "Swahili",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk"
  ]
 },
 {
  "id": 60,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza engelsk",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/engelsk",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/ca673718-d15d-490f-93f0-4f27922f4d77.webp",
  "desc": "Creaza engelsk er et kreativt, lekent, moderne og fleksibelt læremiddel i engelsk for 5. - 10. trinn. Læremiddelet er komplett og heldigitalt og fungerer også som begynneropplæring for elever med kort botid i Norge på mellomtrinn, ungdomstrinn og i videregående skole. Læremiddelt har tospråklig…",
  "fag": [
   "Engelsk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Arabisk",
   "Engelsk",
   "Persisk",
   "Kurdisk (kurmanji)",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Pashto",
   "Somali",
   "Tigrinja"
  ]
 },
 {
  "id": 61,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza samfunnsfag 1-4",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/samfunn1-4",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/34b6a40b-8f4c-4901-b4ff-681848e3e5aa.webp",
  "desc": "Creaza samfunnsfag 1-4 er et lekent, temabasert og komplett læremiddel i samfunnsfag for småskolen. Creaza samfunnsfag 1-4 har fokus på den aktive elev og gir gode muligheter for inkludering og tilpassa opplæring. Creaza samfunnsfag 1-4 dekker alle kompetansemål for 1-2. og 3-4. trinn i læreplan…",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 62,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Creaza samfunnskunnskap VGS",
  "vendor": "Creaza AS",
  "serviceName": "Creaza",
  "url": "https://www.creaza.com/samfunnvgs",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/742f511b-d39a-4889-9742-e00d1b295a4e.webp",
  "desc": "Creaza samfunnskunnskap VGS inviterer elevene til aktivitet og deltakelse og er oppdatert og relevant. Det er enkelt å tilpasse ulike elevgrupper, og støtter lærer og elever gjennom hele læringsprosessen. Kreativitet, aktivitet og variasjon skaper lærelyst, motivasjon og engasjement. Læreplanen…",
  "fag": [
   "Samfunnskunnskap"
  ],
  "trinn": [
   "VG1",
   "VG2"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 63,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om redsel\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/bbcc5896-d9b0-42ba-a9e6-e8f129c37866.webp",
  "desc": "Filmserien «Snakk om redsel» består av 4 korte filmer som på ulike måter belyser temaet bekymring, uro og redsel. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm. klassens…",
  "fag": [
   "Norsk for elever med samisk",
   "Norsk fordypning"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 64,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om sinne\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/2b10576e-3805-485f-8944-393b8820ded9.webp",
  "desc": "Filmserien «Snakk om sinne» består av 4 korte filmer som på ulike måter belyser temaet frustrasjon og sinne. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm. klassens time…",
  "fag": [
   "Norsk",
   "Norsk fordypning"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 65,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om kjærlighet\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/d91cc53e-2122-4730-b35d-ef0e51e0bd26.webp",
  "desc": "Filmserien «Snakk om kjærlighet» består av 4 korte filmer som på ulike måter belyser temaet omsorg, empati og medfølelse. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm.…",
  "fag": [
   "Mat og helse",
   "Norsk",
   "Norsk fordypning",
   "Norsk kort botid vgo",
   "Norsk FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 66,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om tristhet\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/05415f80-21a8-403b-b68c-ca9d06a3e71f.webp",
  "desc": "Filmserien «Snakk om tristhet» består av 4 korte filmer som på ulike måter belyser temaet tristhet, sorg og nedstemthet. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm.…",
  "fag": [
   "Norsk"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 67,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om skam\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/88078454-9f4c-4ee3-bba7-50ad6a252681.webp",
  "desc": "Filmserien «Snakk om skam» består av 4 korte filmer som på ulike måter belyser temaet skyld og skam. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm. klassens time eller i…",
  "fag": [
   "Norsk",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 68,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om motivasjon\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/ae2936ab-0818-4aaa-ac34-cf4b6509eb9a.webp",
  "desc": "Filmserien «Snakk om motivasjon» består av 4 korte filmer som på ulike måter belyser temaet motivasjon og engasjement. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm.…",
  "fag": [
   "Norsk",
   "Norsk fordypning",
   "Norsk FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 69,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om ensomhet\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/d9ba5a99-39da-40cb-a412-ea2a39a0b4e3.webp",
  "desc": "Filmserien «Snakk om ensomhet» består av 4 korte filmer som på ulike måter belyser temaet ensomhet. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm. klassens time eller i…",
  "fag": [
   "Mat og helse",
   "Norsk",
   "Norsk FOV",
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 70,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om stress\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/a1eec6be-3979-42d4-96b1-5614810ce010.webp",
  "desc": "Filmserien «Snakk om stress» består av 4 korte filmer som på ulike måter belyser temaet press og stress. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm. klassens time…",
  "fag": [
   "Naturfag",
   "Norsk",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 71,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om håp\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/73eba293-7c93-4fbd-ba03-f02636318b27.webp",
  "desc": "Filmserien «Snakk om håp» består av 4 korte filmer som på ulike måter belyser temaet håp og fremtidstro. Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring og vil egne seg godt til bruk ifm. skolestart og oppstart av nytt semester. Filmene kan også brukes ifm. klassens time…",
  "fag": [
   "Norsk",
   "Norsk FOV",
   "Norsk for språklige minoriteter FOV",
   "KRLE"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 72,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om forakt\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/e548eb2c-7b98-4951-b126-1ad25ac3a282.webp",
  "desc": "4 filmer om temaet forakt vil tilgjengeliggjøres i løpet av høsten 2026 ment til bruk inn mot tematikken folkehelse og livsmestring Temaer knyttet til selvforakt og menneskeforakt vil stå i fokus. Herunder forakt for ulike livssyn, forakt for ulike tros-syn og ulike menneskegrupper. Temaer som…",
  "fag": [
   "Historie",
   "KRLE",
   "KRLE samisk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG2",
   "VG3",
   "Påbygging"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 73,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om sjalusi/misunnelse\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/2c61217b-2cba-446c-908e-5549a32ddfa1.webp",
  "desc": "I løpet av høsten 2026 vil det komme 4 filmer i \"Snakk om det\" serien som handler om sjalusi og misunnelse Filmene er ment til bruk inn mot tematikken folkehelse og livsmestring",
  "fag": [],
  "trinn": [
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 74,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "\"Snakk om glede\"",
  "vendor": "Senter for livsmestring AS",
  "serviceName": "\"Snakk om det\"",
  "url": "https://www.senterforlivsmestring.no/mestringsportalen",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/d2b45aa2-ed8a-4283-ac64-94aaffb964f8.webp",
  "desc": "I løpet av høsten 2026 kommer det 4 filmer om temaet glede som er en del av \"Snakk om det\" serien Her vil vi løfte frem 4 viktige elementer som fremmer livsglede og samtidig peke på elementer som ofte stjeler fra oss gleden i hverdagen",
  "fag": [],
  "trinn": [
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 75,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Frisør, blomster, interiør og eksponeringsdesign",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/93e5e7bb-818a-4c3a-9950-740308df2bf6.webp",
  "desc": "Læremiddelet inneholder 57 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2020. Serien er støttet av Udir og er produsert i 2020.",
  "fag": [],
  "trinn": [
   "VG1"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål",
   "Ukrainsk"
  ]
 },
 {
  "id": 76,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Blomsterdekoratør",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/0838e382-0bb1-4f10-841d-40e3d38e0a65.webp",
  "desc": "Læremiddelet inneholder 44 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2020. Serien er støttet av Udir og er produsert i 2025.",
  "fag": [],
  "trinn": [
   "VG2"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 77,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Interiør og eksponeringsdesign",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/64463ea7-f374-4289-a360-6576dec1b9f6.webp",
  "desc": "Læremiddelet inneholder 47 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2020. Serien er støttet av Udir og er produsert i 2024.",
  "fag": [],
  "trinn": [
   "VG2"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 78,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Interiør",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/6969109f-fead-44c3-b63f-a7eba30d28fa.webp",
  "desc": "Læremiddelet inneholder 43 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2020. Serien er støttet av Udir og er produsert i 2024.",
  "fag": [],
  "trinn": [
   "VG3"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 79,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Eksponeringsdesign",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/dd114daf-f0ac-4fa9-ae7b-96e29e8bdf3d.webp",
  "desc": "Læremiddelet inneholder 41 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2020. Serien er støttet av Udir og er produsert i 2025.",
  "fag": [],
  "trinn": [
   "VG3"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 80,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Håndverk, design og produktutvikling",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/39972de0-a021-4d6f-9e4e-b0cc47f5944b.webp",
  "desc": "Læremiddelet inneholder 48 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2020. Serien er støttet av Udir og er produsert i 2020.",
  "fag": [],
  "trinn": [
   "VG1"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 81,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Søm og tekstilhåndverk",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/c94c1bc4-8493-4760-a8b8-9513c6a90a3c.webp",
  "desc": "Læremiddelet inneholder 60 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2021. Serien er støttet av Udir og er produsert i 2022.",
  "fag": [],
  "trinn": [
   "VG2"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 82,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bunadtilvirkerfaget",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/f39d0222-d63d-4298-b142-003bc98e8d90.webp",
  "desc": "Læremiddelet inneholder 60 filmer og dekker alle kompetansemål i læreplanen gjeldende fra 1.8.2022. Serien er støttet av Udir og er produsert i 2024.",
  "fag": [],
  "trinn": [
   "VG3"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Norsk nynorsk",
   "Norsk bokmål"
  ]
 },
 {
  "id": 83,
  "kind": "laeremiddel",
  "type": "Lesestøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Finansmarked og næringsliv",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/40ecc874-add4-4d35-a748-257c101b8e2d.webp",
  "desc": "Dette er en filmbasert læringsressurs med 8 filmer som skal gi dagens unge voksne innsikt i, og forståelse for, hvordan finansmarkedene fungerer, og forstå sammenhengene mellom næringsliv, finansmarked og samfunn. Serien er støttet av Finansmarkedsfondet, Verdipapirfondenes forening, Nordnet og…",
  "fag": [],
  "trinn": [
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 84,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Personlig økonomi",
  "vendor": "Filmkonsulentene AS",
  "serviceName": "Filmkonsulentene AS",
  "url": "https://fag.film",
  "thumb": "https://lmk-images.s3.eu-north-1.amazonaws.com/thumbnails/9712d0e0-e43e-4bf3-94c9-74453c3389a3.webp",
  "desc": "Læremiddelet vil gi dagens unge voksne kunnskap til selv å kunne ta kontroll, styre og planlegge egen personlig økonomi. Ressursen består av 8 filmer og tar for seg tema som å flytte for seg selv, forsikring, sparing, lån, og inkasso. Serien er produsert i 2023 og er støttet av Finansmarkedsfondet,…",
  "fag": [],
  "trinn": [
   "10. trinn",
   "VG1",
   "VG2",
   "VG3"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående"
  ],
  "sprak": [
   "Norsk bokmål"
  ]
 },
 {
  "id": 85,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Familie",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/familie",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T009a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 86,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Følelser og humør",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/folelser-og-humor",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T018a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 87,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Menneske og kropp",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/menneske-og-kropp",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T062a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 88,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Helse",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/helse",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T020a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 89,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Hus og hjem",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/hus-og-hjem",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T024a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 90,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Mat og drikke",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/mat-og-drikke",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T052a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 91,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Klær",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/klaer",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T034a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 92,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Farger",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/farger",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T013a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 93,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Tall",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/tall",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T086a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 94,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Tid og kalender",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/tid-og-kalender",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T091a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 95,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Framkomstmidler",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/framkomstmidler",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T015a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 96,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Vær og årstider",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/vaer-og-arstider",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T096a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 97,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Natur",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/natur",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T073a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 98,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - På tur",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/pa-tur",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T079a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 99,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Dyr",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/dyr",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T001a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 100,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Bildetema - Skole",
  "vendor": "NAFO - Nasjonalt senter for flerkulturell opplæring",
  "serviceName": "Bildetema",
  "url": "https://nybildetema.oslomet.no/#/nob/skole",
  "thumb": "https://cdn-prod-bildetema.azureedge.net/images/medium/T081a.jpeg",
  "desc": "En flerspråklig interaktiv bildeordbok med bilder, tekst og lyd inndelt etter tema. Bildeordboka kan være et utgangspunkt for arbeid med språk i barnehage, skole og voksenopplæring.",
  "fag": [
   "Engelsk",
   "Engelsk FOV",
   "Matematikk",
   "Matematikk FOV",
   "Naturfag",
   "Naturfag FOV",
   "Norsk",
   "Morsmål språklige minoriteter",
   "Norsk FOV",
   "Religion og etikk",
   "KRLE",
   "Samfunnsfag",
   "Samfunnsfag FOV"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn",
   "5. trinn",
   "6. trinn",
   "7. trinn",
   "8. trinn",
   "9. trinn",
   "10. trinn",
   "VG1",
   "VG2",
   "VG3",
   "Påbygging",
   "FOV"
  ],
  "levels": [
   "Grunnskole",
   "Vidaregående",
   "Voksenopplæring"
  ],
  "sprak": [
   "Arabisk",
   "Kurdisk (sorani)",
   "Dansk",
   "Engelsk",
   "Persisk",
   "Filippinsk",
   "Fransk",
   "Islandsk",
   "Litauisk",
   "Norsk nynorsk",
   "Norsk bokmål",
   "Polsk",
   "Dari",
   "Pashto",
   "Romani",
   "Rumensk",
   "Russisk",
   "Nordsamisk",
   "Somali",
   "Spansk",
   "Swahili",
   "Svensk",
   "Thai",
   "Tigrinja",
   "Tyrkisk",
   "Ukrainsk",
   "Urdu",
   "Vietnamesisk"
  ]
 },
 {
  "id": 2000,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "17. mai 1–2",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "17. mai 1–2 er en spennende digital ressurs som gir elever mulighet til å utforske og lære om Norges nasjonaldag.",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2001,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "17. mai 3–4",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "17. mai 3–4 er en engasjerende og lærerik ressurs som kombinerer kunnskap om nasjonaldagen med Norges historie.",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2002,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "17. mai 5–7",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Her har vi samlet videoer, e-bøker, oppgaver og aktiviteter som kan passe å gjennomføre som tema på 5.–7. trinn.",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2003,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "17. mai 8–10",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Her har vi samlet videoer, e-bøker, oppgaver og aktiviteter som kan passe å gjennomføre som tema på 8.–10. trinn.",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2004,
  "kind": "laeremiddel",
  "type": "Språkstøtte",
  "vurdert": true,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "17. mai tilrettelagt innhold",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "17. mai — tilrettelagt innhold. Her finner du innhold for tilpasset opplæring og særskilt tilrettelegging.",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn",
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2005,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "ABC",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Norsk ABC er et komplett digitalt læremiddel for begynneropplæringen i norskfaget som gir elevene en god start.",
  "fag": [
   "Norsk"
  ],
  "trinn": [
   "1. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2006,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Alarmtelefonen",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Her finner dere innhold fra alarmtelefonen. Hva kan vi gjøre når vi har det vanskelig, inni oss, har vondt.",
  "fag": [
   "KRLE",
   "Samfunnsfag"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2007,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Alphablocks and Numberblocks",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Join the fun with the award-winning Alphablocks and Numberblocks! Each character is a block that helps learning.",
  "fag": [
   "Engelsk",
   "Matematikk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2008,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Amnesty",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Innholdet er utviklet av Amnesty International. Her finner du undervisningsopplegg om menneskerettigheter.",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2009,
  "kind": "laeremiddel",
  "type": "Verktøy",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "Animasjonsskole",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Elevkanalens Animasjonsskole er en praktisk og bransjeorientert innføring i animasjon for elevene.",
  "fag": [
   "Kunst og håndverk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2010,
  "kind": "laeremiddel",
  "type": "Digital bok",
  "vurdert": true,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "ARKs barnebokpris",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "ARKs barnebokpris på Elevkanalen. ARKs barnebokpris er en litteraturpris som kåres av barna selv.",
  "fag": [
   "Norsk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 2011,
  "kind": "laeremiddel",
  "type": "Digitalt læremiddel",
  "vurdert": true,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [
   "Har vurdering"
  ],
  "title": "ASK-mentor",
  "vendor": "TV 2 Skole AS",
  "serviceName": "Elevkanalen",
  "url": null,
  "thumb": null,
  "desc": "Prosjektet ASK-mentor har som mål å skape nettverk mellom barn som bruker alternativ og supplerende kommunikasjon.",
  "fag": [
   "Samfunnsfag"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Norsk bokmål",
   "Norsk nynorsk"
  ]
 },
 {
  "id": 3000,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Lærer"
  ],
  "tdl": [],
  "title": "Lohkangirji – sámi lesebok 1",
  "vendor": "Davvi Girji",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "Lesebok på nordsamisk for begynneropplæringen, med korte tekster, bilder og enkle oppgaver.",
  "fag": [
   "Samisk",
   "Norsk"
  ],
  "trinn": [
   "1. trinn",
   "2. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Nordsamisk"
  ]
 },
 {
  "id": 3001,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Matematihkka 5",
  "vendor": "Davvi Girji",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "Matematikkverk på nordsamisk for mellomtrinnet. Dekker tall, brøk, geometri og måling.",
  "fag": [
   "Matematikk"
  ],
  "trinn": [
   "5. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Nordsamisk"
  ]
 },
 {
  "id": 3002,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Luonddufága 6",
  "vendor": "Gollegiella",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "Naturfagbok på nordsamisk med tema om natur, kropp og miljø, tilpasset 6. trinn.",
  "fag": [
   "Naturfag"
  ],
  "trinn": [
   "6. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Nordsamisk"
  ]
 },
 {
  "id": 3003,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Sámi historjá ja servodat",
  "vendor": "ČálliidLágádus",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "Lærebok i samisk historie og samfunn for ungdomstrinnet, med kilder, kart og oppgaver.",
  "fag": [
   "Samfunnsfag",
   "Historie"
  ],
  "trinn": [
   "8. trinn",
   "9. trinn",
   "10. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Nordsamisk"
  ]
 },
 {
  "id": 3004,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Bïepmedahke – åarjelsaemien lohkemegærja",
  "vendor": "Trøndelag fylkeskommune",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "Sørsamisk lesebok med fortellinger og oppgaver for de yngste elevene.",
  "fag": [
   "Samisk"
  ],
  "trinn": [
   "3. trinn",
   "4. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Sørsamisk"
  ]
 },
 {
  "id": 3005,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Julevsámegiela ságastallamgirjje",
  "vendor": "Sámediggi",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "Samtalebok på lulesamisk som styrker muntlig språk og ordforråd på mellomtrinnet.",
  "fag": [
   "Samisk"
  ],
  "trinn": [
   "5. trinn",
   "6. trinn",
   "7. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Lulesamisk"
  ]
 },
 {
  "id": 3006,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Elev",
   "Lærer"
  ],
  "tdl": [],
  "title": "Sámegiella vuosttašgiellan VG1",
  "vendor": "Davvi Girji",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "Lærebok i samisk som førstespråk for VG1, med litteratur, språk og skriftlige oppgaver.",
  "fag": [
   "Samisk"
  ],
  "trinn": [
   "VG1"
  ],
  "levels": [
   "Vidaregående"
  ],
  "sprak": [
   "Nordsamisk"
  ]
 },
 {
  "id": 3007,
  "kind": "laeremiddel",
  "type": "Fysisk bok",
  "vurdert": false,
  "malgruppe": [
   "Elev"
  ],
  "tdl": [],
  "title": "Eatnigiella ABC",
  "vendor": "Gollegiella",
  "serviceName": null,
  "url": null,
  "thumb": null,
  "desc": "ABC-bok på nordsamisk som introduserer bokstaver, lyder og de første ordene.",
  "fag": [
   "Samisk",
   "Norsk"
  ],
  "trinn": [
   "1. trinn"
  ],
  "levels": [
   "Grunnskole"
  ],
  "sprak": [
   "Nordsamisk"
  ]
 }
];
