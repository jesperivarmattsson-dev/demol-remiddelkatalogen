/* ============================================================
   Læremiddelkatalogen — Tilgjengelige tjenester (innlogget)
   Skoleoversikt: tjenester elever og lærere kan logge inn på
   med Feide. Rendres av app.jsx når currentPage = "tjenester".
   ============================================================ */

/* ---------- ikoner som mangler i ui.jsx ---------- */
const CaretLeftIcon = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"/>
  </svg>
);
const ArrowDownIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M205.66 149.66l-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32"/>
  </svg>
);
const SquaresFourIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M108 44H44a12 12 0 0 0-12 12v64a12 12 0 0 0 12 12h64a12 12 0 0 0 12-12V56a12 12 0 0 0-12-12m0 96H44a12 12 0 0 0-12 12v64a12 12 0 0 0 12 12h64a12 12 0 0 0 12-12v-64a12 12 0 0 0-12-12m104-96h-64a12 12 0 0 0-12 12v64a12 12 0 0 0 12 12h64a12 12 0 0 0 12-12V56a12 12 0 0 0-12-12m0 96h-64a12 12 0 0 0-12 12v64a12 12 0 0 0 12 12h64a12 12 0 0 0 12-12v-64a12 12 0 0 0-12-12"/>
  </svg>
);
const ListIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" aria-hidden="true">
    <line x1="88" y1="72" x2="216" y2="72"/><line x1="88" y1="128" x2="216" y2="128"/><line x1="88" y1="184" x2="216" y2="184"/>
    <circle cx="44" cy="72" r="10" fill="currentColor" stroke="none"/><circle cx="44" cy="128" r="10" fill="currentColor" stroke="none"/><circle cx="44" cy="184" r="10" fill="currentColor" stroke="none"/>
  </svg>
);

/* ---------- fiktive tjenester (videregående) ---------- */
const TL_SERVICES = [
  { navn: "Fagrom VGS", lev: "Nordlys Læring", tint: "rosa",
    tekst: "Digitalt fagrom for programfag på studieforberedende. Læreren setter opp oppgaveløp per klasse, og elevene leverer og får tilbakemelding i samme flate." },
  { navn: "Realfagsportalen", lev: "Tindra Utdanning", tint: "lilla",
    tekst: "Oppgavesamling i matematikk, fysikk og kjemi for VG1 til VG3. Oppgavene er merket med kompetansemål, og elevene får stegvise løsningsforslag." },
  { navn: "Yrkesverkstedet", lev: "Fjordvik Digital", tint: "gronn",
    tekst: "Praksisnære oppgaver og sjekklister for yrkesfaglige utdanningsprogram. Eleven dokumenterer arbeid med bilder og korte notater fra verkstedet." },
  { navn: "Skrivestøtte Pluss", lev: "Klartekst AS", tint: "lilla",
    tekst: "Verktøy for lesing og skriving med opplesing, ordforslag og ordbøker. Brukes både i norsk og i fag der elevene skriver lengre tekster." },
  { navn: "Språklab", lev: "Nordlys Læring", tint: "gronn",
    tekst: "Øvingsrom for fremmedspråk med lyd, uttaleøvelser og korte dialoger. Læreren kan lytte gjennom innleveringene og kommentere direkte i opptaket." },
  { navn: "Vurderingsboka", lev: "Solstad Skoleverk", tint: "rosa",
    tekst: "Samler underveisvurdering, egenvurdering og halvårsvurdering på ett sted. Eleven ser sin egen utvikling i faget over tid." },
  { navn: "Kildekritikk VGS", lev: "Fjordvik Digital", tint: "lilla",
    tekst: "Undervisningsopplegg om kildebruk, opphavsrett og kunstig intelligens. Inneholder ferdige timeplaner og oppgaver til tverrfaglig arbeid." },
  { navn: "Eksamenstrening", lev: "Tindra Utdanning", tint: "gronn",
    tekst: "Tidligere eksamensoppgaver med veiledede løsninger for sentralt gitt eksamen. Elevene kan øve på tid og se hvordan besvarelser vurderes." },
  { navn: "Simulator Elektro", lev: "Volt Fagmedia", tint: "rosa",
    tekst: "Simuleringer av koblinger og kretser for elektro og datateknologi. Elevene kan prøve og feile trygt før de går inn i verkstedet." },
];
const tlInitials = (navn) => navn.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();

/* ---------- FAQ ---------- */
const tlFaq = (user) => [
  { q: "Hvor kommer tjenestene i listen fra?", body: (
      <p>Listen viser tjenestene du og elevene dine kan logge inn på med Feide. Det er {user.organisasjon} som åpner for innlogging. Som regel gjør de det for alle skolene sine samtidig, men de kan også åpne for én skole av gangen.</p>) },
  { q: "Har vi tilgang til alt som står i listen?", body: (
      <p>Ikke alltid. Du kan få logget inn på en tjeneste uten at du har tilgang til innholdet. Det avhenger av hvilken avtale {user.skole} eller {user.organisasjon} har med leverandøren. Vi ser bare hva du kan logge inn på, ikke hva skolen din har kjøpt.</p>) },
  { q: "Hvor ofte oppdateres listen?", body: (
      <p>Listen oppdateres hver natt. Har {user.organisasjon} nettopp åpnet eller lukket innlogging på en tjeneste, kan det ta litt tid før du ser endringen her.</p>) },
  { q: "Hvorfor ligger det tjenester her som vi ikke bruker?", body: (
      <p>Som regel fordi {user.organisasjon} har åpnet for innlogging for alle skolene sine samtidig. Da ser du også tjenester som andre skoler bruker. Mener du at tjenesten ikke hører hjemme i listen, snakk med IKT-ansvarlig på skolen din. IKT-ansvarlig kan be Feide-administratoren i {user.organisasjon} om å lukke innloggingen.</p>) },
  { q: "Hvorfor mangler en tjeneste vi bruker?", body: (
      <React.Fragment>
        <p>Det kan være tre grunner:</p>
        <ul className="tl-faq__list">
          <li>{user.organisasjon} har ikke åpnet for innlogging på tjenesten.</li>
          <li>Tjenesten er ikke registrert hos oss per nå. Vi jobber hele tiden med å få inn nye tjenester.</li>
          <li>Tjenesten tilbyr ikke innlogging med Feide.</li>
        </ul>
        <p>Er du usikker på hva som gjelder ditt tilfelle? <a className="tl-link" href="#">Si ifra hvilken tjeneste du savner, så undersøker vi det.</a></p>
      </React.Fragment>) },
];

function TlAccordion({ item }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="tl-acc__item">
      <button className="tl-acc__head" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className={"tl-acc__chev" + (open ? " is-open" : "")}><ChevronDown s={32} /></span>
        <span className="tl-acc__q">{item.q}</span>
      </button>
      {open && <div className="tl-acc__body">{item.body}</div>}
    </div>
  );
}

function TlCard({ s, view }) {
  return (
    <button className={"tl-card" + (view === "list" ? " tl-card--row" : "")} onClick={() => {}}>
      <span className={"tl-card__img tl-tint--" + s.tint} aria-hidden="true">{tlInitials(s.navn)}</span>
      <span className="tl-card__body">
        <span className="tl-card__name">{s.navn}</span>
        <span className="tl-card__lev">Leveres av {s.lev}</span>
        <span className="tl-card__desc">{s.tekst}</span>
      </span>
    </button>
  );
}

function TjenesterSide({ user, goMinSide }) {
  const [q, setQ] = React.useState("");
  const [view, setView] = React.useState("grid");
  const [page, setPage] = React.useState(1);
  const faqRef = React.useRef(null);
  const needle = q.trim().toLowerCase();
  const list = needle
    ? TL_SERVICES.filter(s => (s.navn + " " + s.lev).toLowerCase().includes(needle))
    : TL_SERVICES;

  return (
    <main className="tl-main">
      <div className="lk-container tl-inner">

        <nav className="tl-crumbs" aria-label="Du er her">
          <a href="#" className="tl-crumbs__link" onClick={(e) => { e.preventDefault(); goMinSide(); }}>Min side</a>
          <CaretRight s={18} />
          <span className="tl-crumbs__now" aria-current="page">{user.skole}</span>
        </nav>

        <div className="tl-head">
          <div className="tl-head__top">
            <h1 className="tl-h1">{user.skole}</h1>
            <button className="tl-faqjump" onClick={() => { const el = faqRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" }); }}>
              <span>Spørsmål og svar</span><ArrowDownIcon s={24} />
            </button>
          </div>
          <div className="tl-lede">
            <p>Her ser du tjenestene du og elevene dine kan logge inn på med Feide.</p>
            <p>Selv om du kan logge inn, er det ikke sikkert at {user.skole} eller {user.organisasjon} har kjøpt tilgang til innholdet. Se spørsmål og svar nederst på siden for mer informasjon.</p>
          </div>
        </div>

        <section className="tl-section">
          <h2 className="tl-h2">Tjenester</h2>
          <div className="tl-search">
            <input className="tl-search__input" type="search" value={q} placeholder="Søk etter tjenester"
                   aria-label="Søk etter tjenester" onChange={(e) => setQ(e.target.value)} />
            <button className="tl-iconbtn tl-search__btn" aria-label="Søk"><SearchIcon s={20} /></button>
          </div>

          <div className="tl-bar">
            <div className="tl-bar__left">
              <span className="tl-count">Viser {list.length} av 50 tjenester</span>
              <span className="tl-updated">Oppdatert 6. august kl. 09.30</span>
            </div>
            <div className="tl-bar__right">
              <button className={"tl-iconbtn" + (view === "grid" ? " is-active" : "")} aria-pressed={view === "grid"}
                      aria-label="Rutenettvisning" onClick={() => setView("grid")}><SquaresFourIcon s={24} /></button>
              <button className={"tl-iconbtn" + (view === "list" ? " is-active" : "")} aria-pressed={view === "list"}
                      aria-label="Listevisning" onClick={() => setView("list")}><ListIcon s={24} /></button>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="tl-empty">
              <p>Ingen tjenester matcher søket ditt</p>
              <button className="tl-link tl-link--btn" onClick={() => setQ("")}>Nullstill søket</button>
            </div>
          ) : (
            <div className={view === "grid" ? "tl-grid" : "tl-list"}>
              {list.map(s => <TlCard key={s.navn} s={s} view={view} />)}
            </div>
          )}

          {list.length > 0 && (
            <nav className="tl-pager" aria-label="Sidenavigasjon">
              <button className="tl-pager__step" onClick={() => setPage(p => Math.max(1, p - 1))}>
                <CaretLeftIcon s={18} /><span>Forrige</span>
              </button>
              {[1, 2, 3, 4].map(n => (
                <button key={n} className={"tl-pager__num" + (page === n ? " is-active" : "")}
                        aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)}>{n}</button>
              ))}
              <span className="tl-pager__gap">…</span>
              <button className={"tl-pager__num" + (page === 10 ? " is-active" : "")}
                      aria-current={page === 10 ? "page" : undefined} onClick={() => setPage(10)}>10</button>
              <button className="tl-pager__step" onClick={() => setPage(p => Math.min(10, p + 1))}>
                <span>Neste</span><CaretRight s={18} />
              </button>
            </nav>
          )}
        </section>

        <section className="tl-section" ref={faqRef}>
          <h2 className="tl-h2">Spørsmål og svar</h2>
          <div className="tl-faqcard">
            {tlFaq(user).map(item => <TlAccordion key={item.q} item={item} />)}
          </div>
        </section>

      </div>
    </main>
  );
}

Object.assign(window, { TjenesterSide, CaretLeftIcon, ArrowDownIcon, SquaresFourIcon, ListIcon });
