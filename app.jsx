/* ============================================================
   Læremiddelkatalogen — Startside (home)
   Hero + search + category cards + content sections.
   Search and the category cards navigate to the søkeside.
   ============================================================ */
const { useState } = React;

/* ---------- Hero + search ---------- */
function Hero({ query, setQuery, goSearch, pickLevel }) {
  return (
    <section className="lk-hero">
      <div className="lk-container">
        <h1 className="lk-hero__title">Læremiddelkatalogen</h1>
        <p className="lk-hero__lede">Læremiddelkatalogen hjelper skolen å ta gode valg rundt digitale læremidler, som gir god og trygg læring for alle elever.</p>
        <form className="lk-search" role="search" onSubmit={(e) => { e.preventDefault(); goSearch(); }}>
          <span className="lk-search__icon"><SearchIcon s={22} /></span>
          <input
            className="lk-search__input"
            type="search"
            placeholder="Søk etter læremidler"
            aria-label="Søk etter læremidler"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <div className="lk-cats">
          {LK_LEVELS.map(level => (
            <button key={level} className="lk-cat" onClick={() => pickLevel(level)}>
              <span className="lk-cat__art"><CategoryArt level={level} /></span>
              <span className="lk-cat__label">{level}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Content cards ---------- */
const FEATURES = [
  { icon: <FilterIcon s={24} />, text: "Finn læremidler filtrert på fag, trinn og språk" },
  { icon: <PinIcon s={24} />,    text: "Finn læremidler på tvers av leverandører" },
  { icon: <SearchIcon s={24} />, text: "Søk på læremidler, tjeneste eller annet" },
  { icon: <EyeIcon s={24} />,    text: "Se hvilke tjenester som er vurdert av Tryggere digital læring" },
];

/* ---------- Navigasjonskort (delt: startside + min side) ---------- */
function NavCard({ title, subtitle, onClick }) {
  return (
    <button className="lk-navcard" onClick={onClick}>
      <span className="lk-navcard__top">
        <span className="lk-navcard__icon"><GradCapIcon s={24} /></span>
        <span className="lk-navcard__caret"><CaretRight s={32} /></span>
      </span>
      <span className="lk-navcard__body">
        <span className="lk-navcard__title">{title}</span>
        {subtitle ? <span className="lk-navcard__text">{subtitle}</span>
                  : <span className="lk-navcard__text" aria-hidden="true">&nbsp;</span>}
      </span>
    </button>
  );
}

/* ---------- Logg inn / innlogget-kort ---------- */
function LoginCard({ isLoggedIn, onLogin, pending, goMinSide, goTjenester }) {
  return (
    <section className="lk-card lk-login">
      <span className="lk-tag-new"><SparkleIcon s={20} /> Nytt</span>
      <h2 className="lk-card__h2 lk-login__h2">{isLoggedIn ? "Du er logget inn" : "Logg inn i Læremiddelkatalogen"}</h2>
      <p className="lk-card__lede lk-login__lede">Se hvilke tjenester du har tilgang til gjennom skolen eller kommunen din på min side.</p>
      {isLoggedIn ? (
        <div className="lk-navcards">
          <NavCard title="Gå til min side" onClick={goMinSide} />
          <NavCard title="Tilgjengelige tjenester" subtitle="Se hvilke tjenester som er aktivert for din skole" onClick={goTjenester} />
        </div>
      ) : (
        <div className="lk-btn-row">
          <button className="lk-feide lk-feide--solid" onClick={onLogin} disabled={pending} aria-busy={pending}>
            {pending ? <SpinnerGap s={24} /> : <FeideMark s={24} />}
            <span>{pending ? "Logger inn…" : "Logg inn med Feide"}</span>
          </button>
        </div>
      )}
    </section>
  );
}

function HomeContent({ isLoggedIn, onLogin, pending, goMinSide, goTjenester }) {
  return (
    <main className="lk-main">
      <div className="lk-container lk-stack">

        <LoginCard isLoggedIn={isLoggedIn} onLogin={onLogin} pending={pending} goMinSide={goMinSide} goTjenester={goTjenester} />

        {/* Tryggere digital læring */}
        <section className="lk-card">
          <h2 className="lk-card__h3">Se vurderinger gjort av Tryggere digital læring</h2>
          <p className="lk-card__lede">Tryggere digital læring gir skoleeiere hjelp til å vurdere digitale tjenester opp mot krav til informasjonssikkerhet, personvern og universell utforming. Tjenesten er et samarbeid mellom Utdanningsdirektoratet, KS og Sikt.</p>
          <div className="lk-btn-row">
            <a className="lk-btn lk-btn--subtle" href="#">Les mer om Tryggere digital læring <ExternalLink s={18} /></a>
            <a className="lk-btn lk-btn--strong" href="#">Se vurderte tjenester <ArrowRight s={20} /></a>
          </div>
        </section>

        {/* Hva tilbyr */}
        <section className="lk-card lk-card--center">
          <h2 className="lk-card__h2">Hva tilbyr Læremiddelkatalogen?</h2>
          <p className="lk-card__lede">Læremiddelkatalogen er en oversikt over digitale læremidler og tjenester i grunnopplæringen. Læremidler i katalogen er ikke forhåndsgodkjent, og må vurderes før bruk.</p>
          <div className="lk-features">
            {FEATURES.map((f, i) => (
              <div className="lk-feature" key={i}>
                <span className="lk-feature__icon">{f.icon}</span>
                <span className="lk-feature__text">{f.text}</span>
              </div>
            ))}
          </div>
          <div className="lk-info">Læremidler og tjenester i katalogen er ikke forhåndsgodkjent og må vurderes før bruk.</div>
          <div className="lk-callout">
            <h3 className="lk-callout__title">Læremiddelkatalogen er under utvikling</h3>
            <p className="lk-callout__body">Vil du gi innspill eller lese mer om hva katalogen er?</p>
            <div className="lk-btn-row">
              <a className="lk-btn lk-btn--accent" href="#">Gi tilbakemelding <ExternalLink s={18} /></a>
              <a className="lk-btn lk-btn--accent" href="#">Les mer på Sikt sine sider <ExternalLink s={18} /></a>
            </div>
          </div>
        </section>

        {/* Leverandør */}
        <section className="lk-card lk-card--center">
          <h2 className="lk-card__h2">Vil du synliggjøre digitale læremidler i katalogen?</h2>
          <p className="lk-card__lede">Er du leverandør av digitale læremidler og ønsker å bli synlig i katalogen?<br/>
            <a className="lk-inline-link" href="#" target="_blank" rel="noopener">Ta kontakt her. <ExternalLink s={16} /></a></p>
          <div className="lk-illu"><Illustration /></div>
        </section>

      </div>
    </main>
  );
}

/* ---------- Min side ---------- */
const USER_ROWS = [["Navn", "navn"], ["Rolle", "rolle"], ["Organisasjon", "organisasjon"], ["Skole", "skole"]];

function MinSide({ user, onLogout, goTjenester }) {
  return (
    <main className="lk-main lk-minside">
      <div className="lk-container lk-minside__inner">
        <div className="lk-minside__top">
          <h1 className="lk-minside__h1">Min side</h1>
          <button className="lk-logout" onClick={onLogout}>Logg ut</button>
        </div>
        <dl className="lk-details">
          {USER_ROWS.map(([label, key]) => (
            <div className="lk-details__row" key={key}>
              <dt>{label}</dt>
              <dd>{user[key]}</dd>
            </div>
          ))}
        </dl>
        <NavCard title="Tilgjengelige tjenester" subtitle="Se hvilke tjenester som er aktivert for din skole" onClick={goTjenester} />
      </div>
    </main>
  );
}

/* ---------- App ---------- */
function App() {
  const [query, setQuery] = useState("");
  const { isLoggedIn, user, login, logout, pending } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    const s = new URLSearchParams(window.location.search).get("side");
    return s === "minside" || s === "tjenester" ? s : "startside";
  });
  const nav = (p) => { setCurrentPage(p); window.scrollTo({ top: 0 }); };
  const handleFeideLogin = () => { login(); };
  const handleLogout = () => { logout(); setCurrentPage("startside"); };
  const go = (qs) => { window.location.href = "Sokeside.html" + (qs ? ("?" + qs) : ""); };
  const goSearch = () => go(query.trim() ? "q=" + encodeURIComponent(query.trim()) : "");
  const pickLevel = (level) => go("niva=" + encodeURIComponent(level));

  return (
    <React.Fragment>
      <Header onProfile={() => nav("minside")} />
      {currentPage === "minside" && user ? (
        <MinSide user={user} onLogout={handleLogout} goTjenester={() => nav("tjenester")} />
      ) : currentPage === "tjenester" && user ? (
        <TjenesterSide user={user} goMinSide={() => nav("minside")} />
      ) : (
        <React.Fragment>
          <Hero query={query} setQuery={setQuery} goSearch={goSearch} pickLevel={pickLevel} />
          <HomeContent isLoggedIn={isLoggedIn} onLogin={handleFeideLogin} pending={pending}
                       goMinSide={() => nav("minside")} goTjenester={() => nav("tjenester")} />
        </React.Fragment>
      )}
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
