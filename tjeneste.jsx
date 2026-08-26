/* ============================================================
   Tjeneste-detaljside
   Viser én tjeneste (samlested) med faner:
   Produktinformasjon · Læremidler · Personvern og vurdering.
   Læremidler hentes fra SK_ITEMS via serviceName (isPartOf).
   ============================================================ */
const { useState, useMemo } = React;

const PAGE_M = 9;
const TABS = [
  { key: "produkt", label: "Produktinformasjon" },
  { key: "laeremidler", label: "Læremidler" },
  { key: "personvern", label: "Personvern og vurdering" },
];

function pickService() {
  const id = new URLSearchParams(window.location.search).get("id");
  return SK_SERVICES.find(s => s.slug === id) || SK_SERVICES[0];
}

/* image-with-tile fallback (shared pattern) */
function Tile({ name, thumb, index, className, imgClassName }) {
  const c = SK_THUMBS[index % SK_THUMBS.length];
  const [ok, setOk] = useState(false);
  return (
    <div className={className} style={{ background: c.bg, color: c.fg }}>
      {!ok && <span>{(name || "?")[0]}</span>}
      {thumb && <img className={imgClassName} src={thumb} alt="" loading="lazy"
        style={{ opacity: ok ? 1 : 0 }} onLoad={() => setOk(true)} onError={() => setOk(false)} />}
    </div>
  );
}

/* ---------- Læremidler tab ---------- */
function MemberCard({ item, index }) {
  return (
    <a className="tj-mcard" href={"Laeremiddel.html?id=" + item.id}>
      <Tile name={item.title} thumb={item.thumb} index={index} className="tj-mthumb" imgClassName="tj-mthumb__img" />
      <div className="tj-mbody">
        <h3 className="tj-mtitle">{item.title}</h3>
        <p className="tj-mdesc">{item.desc}</p>
      </div>
    </a>
  );
}

function LaeremidlerTab({ service }) {
  const members = useMemo(() => SK_ITEMS.filter(it => it.serviceName === service.name), [service]);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE_M);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? members.filter(m => (m.title + " " + m.desc).toLowerCase().includes(s)) : members;
  }, [members, q]);
  const visible = filtered.slice(0, shown);
  // display total: the service's catalogue size (mock), but never less than what we actually show
  const total = q ? filtered.length : Math.max(service.memberTotal, members.length);

  return (
    <React.Fragment>
      <h2 className="tj-h2">Læremidler</h2>
      <div className="tj-panel">
        <div className="sk-searchbar">
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE_M); }}
            placeholder="Søk etter læremidler" aria-label="Søk etter læremidler" />
          <span className="sk-searchbar__icon"><SearchIcon s={20} /></span>
        </div>
        <p className="tj-count">Viser {Math.min(visible.length, total)} av {total} læremidler</p>
        {visible.length === 0 ? (
          <div className="sk-empty"><h3>Ingen treff</h3><p>Prøv et annet søkeord.</p></div>
        ) : (
          <div className="tj-grid">
            {visible.map((m, i) => <MemberCard key={m.id} item={m} index={i} />)}
          </div>
        )}
        {shown < filtered.length && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <button className="lk-btn lk-btn--ghost" onClick={() => setShown(s => s + PAGE_M)}>
              Vis flere resultater <Plus s={18} />
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

/* ---------- Produktinformasjon tab ---------- */
function Pills({ items, max }) {
  const shown = max ? items.slice(0, max) : items;
  const extra = items.length - shown.length;
  return (
    <div className="tj-pills">
      {shown.map(x => <span key={x} className="sk-trinnpill">{x}</span>)}
      {extra > 0 && <span className="sk-morepill">+{extra}</span>}
    </div>
  );
}
const InfoIcon = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m20-36a12 12 0 0 1-12 12 16 16 0 0 1-16-16v-40a4 4 0 0 1-4-4 12 12 0 0 1 12-12 16 16 0 0 1 16 16v40a4 4 0 0 1 4 4 12 12 0 0 1 12 0M112 84a16 16 0 1 1 16 16 16 16 0 0 1-16-16"/>
  </svg>
);

const SERVICE_LONGDESC = {
  "Elevkanalen": "TV 2 skole driver læremiddelportalen Elevkanalen. Her vil du finne levende, aktuelt og tilpasset innhold med daglige og ukentlige nyhetssendinger på flere språk og nivå til bruk i hele grunnopplæringen fra 1. trinn til og med videregående skole og voksenopplæringen, både forberedende opplæring for voksne (FOV) og norskopplæring. Den aktuelle tilnærmingen til fagstoffet gjør at opplæringen alltid er relevant, og at elevene møter et språk og innhold de kjenner seg igjen i.",
};

const QA = [
  { q: "Hvem har vurdert tjenesten?", a: "Vurderingen er gjort av Tryggere digital læring – en nasjonal støttetjeneste fra Utdanningsdirektoratet, KS og Sikt." },
  { q: "Hvordan gjør Tryggere digital læring vurderingene?", a: "Vurderingene baseres på dokumentasjon i Feide kundeportal og offentlig tilgjengelig informasjon fra leverandøren." },
  { q: "Hva består en vurdering av?", a: "En vurdering dekker informasjonssikkerhet, personvern og universell utforming, med anbefalte tiltak for både leverandør og skoleeier." },
  { q: "Hva kan du bruke vurderingene til?", a: "Som beslutningsstøtte når skoleeier skal anskaffe og ta i bruk digitale tjenester i opplæringen." },
  { q: "Hvor kan du få rådgiving?", a: "Ta kontakt med Sikt eller din egen skoleeier for veiledning om bruk av vurderingene." },
  { q: "Hva er Feide kundeportal?", a: "Feide kundeportal er stedet der tjenester, datautlevering og vurderinger administreres og dokumenteres." },
  { q: "Hvordan får du tilgang til Feide kundeportal?", a: "Skoleeiere får tilgang gjennom sin lokale Feide-administrator." },
  { q: "Hvorfor får du ikke se vurderingen i Læremiddelkatalogen?", a: "Selve vurderingsrapporten ligger i Feide kundeportal og krever innlogging for å leses i sin helhet." },
];

function Accordion({ items }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="tj-acc">
      {items.map((it, i) => (
        <div className="tj-acc__row" key={i}>
          <button className="tj-acc__q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="tj-acc__icon"><ChevronDown s={16} /></span>
            <span>{it.q}</span>
          </button>
          {open === i && <div className="tj-acc__a">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

function ProduktTab({ service }) {
  const [open, setOpen] = useState(false);
  const desc = SERVICE_LONGDESC[service.name] || service.desc;
  return (
    <React.Fragment>
      <h2 className="tj-h2">Om tjenesten</h2>
      <div className="tj-panel">
        <section className="tj-block">
          <h3 className="tj-block__h">Beskrivelse</h3>
          <p className={"tj-desc" + (open ? " is-open" : "")}>{desc}</p>
          {desc.length > 220 && (
            <button className="tj-vismore-btn" aria-expanded={open} onClick={() => setOpen(o => !o)}>
              {open ? "Vis mindre" : "Vis mer"} <ChevronDown s={16} />
            </button>
          )}
        </section>
        <section className="tj-block">
          <h3 className="tj-block__h">Plattform</h3>
          {service.platform && service.platform.length
            ? <Pills items={service.platform} />
            : <p className="tj-missing">Informasjon om plattform mangler.</p>}
        </section>
        <section className="tj-block">
          <h3 className="tj-block__h">Innloggingsmetode(r)</h3>
          {service.login
            ? <p className="tj-p" style={{ margin: 0 }}>{service.login}</p>
            : <p className="tj-missing">Informasjon om innloggingsmetode mangler.</p>}
        </section>
        <section className="tj-block">
          <h3 className="tj-block__h">Trinn</h3>
          <Pills items={service.trinn} />
        </section>
        <section className="tj-block">
          <h3 className="tj-block__h">Fag</h3>
          <Pills items={service.fag} />
        </section>
      </div>
    </React.Fragment>
  );
}

/* ---------- Personvern og vurdering tab ---------- */
function PersonvernTab({ service }) {
  return (
    <React.Fragment>
      <h2 className="tj-h2">Vurdering av {service.name}</h2>
      <div className="tj-panel">
        {service.vurdert ? (
          <React.Fragment>
            <h3 className="tj-block__h tj-block__h--lg">Tjenesten har en vurdering fra Tryggere digital læring</h3>
            <p style={{ margin: "0 0 20px" }}><a className="lk-btn lk-btn--accent" href="#">Les vurderingen i Feide kundeportal <ExternalLink s={18} /></a></p>
            <p className="tj-p">Tryggere digital læring er en nasjonal støttetjeneste som hjelper skoleeiere å vurdere digitale tjenester innen informasjonssikkerhet, personvern og universell utforming.</p>
            <p className="tj-p">Vurderingen er basert på dokumentasjon fra Feide kundeportal og offentlig informasjon fra tjenesteleverandøren, og inneholder anbefalte tiltak for både leverandører og skoleeiere.</p>
            <p className="tj-p">Det er du som anskaffer eller bruker tjenesten som avgjør hvilke funn som er relevante, og hvilke tiltak dere vil gjennomføre.</p>
            <p className="tj-p" style={{ marginBottom: 18 }}>Tryggere digital læring er et samarbeid mellom Utdanningsdirektoratet, KS og Sikt.</p>
            <ul className="tj-links">
              <li><a href="#">Les mer om Tryggere digital læring (sikt.no) <ExternalLink s={15} /></a></li>
              <li><a href="#">Slik får du lesetilgang i Feide kundeportal (feide.no) <ExternalLink s={15} /></a></li>
              <li><a href="#">Slik bruker du vurderingen i en anskaffelsesprosess</a></li>
            </ul>
          </React.Fragment>
        ) : (
          <div className="tj-notice">Denne tjenesten har ingen vurdering fra Tryggere digital læring ennå.</div>
        )}
      </div>

      <h2 className="tj-h2 tj-h2--mt">Personopplysninger</h2>
      <div className="tj-panel">
        <h3 className="tj-block__h tj-block__h--lg">Hvilken informasjon ber tjenesten om?</h3>
        <p className="tj-p">Denne tjenesten får tilgang til følgende informasjon når brukeren logger inn med Feide:</p>
        <h4 className="tj-pi__h">Personlig informasjon</h4>
        <ul className="tj-pi__list"><li>Navn</li><li>Feide-ID</li><li>Foretrukket språk</li></ul>
        <h4 className="tj-pi__h">Roller, tilhørigheter og grupper</h4>
        <ul className="tj-pi__list"><li>Organisasjonstilhørighet</li><li>Gruppetilhørighet for undervisning</li><li>Gruppemedlemsidentifikatorer</li></ul>
        <p className="tj-updated">Oppdatert: 31. mai 2024</p>
        <div className="tj-infobox-blue"><InfoIcon s={20} /><span>Du kan logge på <a href="#">innsyn.feide.no</a> for å se hva som er registrert om deg i Feide. Tjenesten kan i tillegg behandle annen informasjon om deg. Se tjenestens egen personvernerklæring for fullstendig oversikt.</span></div>
        <h3 className="tj-block__h tj-block__h--lg" style={{ marginTop: 4 }}>Tjenestens personvernerklæring</h3>
        <p style={{ margin: 0 }}><a href="#">Les tjenestens personvernerklæring <ExternalLink s={15} /></a></p>
      </div>

      <h2 className="tj-h2 tj-h2--mt">Spørsmål og svar</h2>
      <div className="tj-panel">
        <Accordion items={QA} />
      </div>
    </React.Fragment>
  );
}

/* ---------- App ---------- */
function App() {
  const service = useMemo(pickService, []);
  const [tab, setTab] = useState("laeremidler");

  return (
    <div className="tj-page">
      <Header variant="accent" homeHref="Startside.html" defaultLang="Norsk bokmål" />

      <div className="tj-hero">
        <div className="tj-wrap">
          <nav className="sk-breadcrumb"><a href="Startside.html">Hjem</a><span>/</span>{service.name}</nav>
          <div className="tj-head">
            <Tile name={service.name} thumb={service.thumb} index={service.name.length} className="tj-logo" imgClassName="tj-logo__img" />
            <div className="tj-headinfo">
              <div className="tj-badges">
                <span className="sk-typebadge sk-typebadge--tjeneste">Tjeneste</span>
                {service.vurdert && <a className="sk-vurdert tj-vurdert-link" href="#" onClick={(e) => { e.preventDefault(); setTab("personvern"); }}>Vurdert</a>}
              </div>
              <h1 className="tj-title">{service.name}</h1>
              <p className="tj-vendor">Levert av {service.vendor}</p>
              <a className="lk-btn lk-btn--strong" href="#">Gå til tjenesten <ExternalLink s={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="tj-tabs">
        <div className="tj-tabs__inner">
          {TABS.map(t => (
            <button key={t.key} className={"tj-tab" + (tab === t.key ? " tj-tab--active" : "")} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="tj-main">
        <div className="tj-wrap">
          {tab === "produkt" && <ProduktTab service={service} />}
          {tab === "laeremidler" && <LaeremidlerTab service={service} />}
          {tab === "personvern" && <PersonvernTab service={service} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
