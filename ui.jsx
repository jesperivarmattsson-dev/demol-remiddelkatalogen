/* ============================================================
   Læremiddelkatalogen — presentational pieces
   Icons, category artwork, illustration, header, footer.
   Exposed on window for app.jsx.
   ============================================================ */

/* ---------- line icons (Phosphor-style, ~1.75px stroke) ---------- */
const SearchIcon = ({ s = 22, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill={c} aria-hidden="true">
    <path d="m229.66 218.34-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72 72.08 72.08 0 0 1-72-72"/>
  </svg>
);
const ArrowRight = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32"/>
  </svg>
);
const ArrowLeft = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8"/>
  </svg>
);
const ExternalLink = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M216 104a8 8 0 0 1-16 0V59.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L188.69 48H144a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8zM184 136a8 8 0 0 0-8 8v56H56V80h56a8 8 0 0 0 0-16H56a16 16 0 0 0-16 16v120a16 16 0 0 0 16 16h120a16 16 0 0 0 16-16v-56a8 8 0 0 0-8-8"/>
  </svg>
);
const FilterIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="42" y1="76" x2="214" y2="76"/><line x1="74" y1="128" x2="182" y2="128"/><line x1="106" y1="180" x2="150" y2="180"/>
  </svg>
);
const PinIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="128" cy="104" r="32"/><path d="M208 104c0 72-80 128-80 128s-80-56-80-128a80 80 0 0 1 160 0Z"/>
  </svg>
);
const CaretRight = ({ s = 32 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128 90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32"/>
  </svg>
);
const GradCapIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M251.76 88.94l-120-64a8 8 0 0 0-7.52 0l-120 64a8 8 0 0 0 0 14.12L32 117.87v48.42a15.9 15.9 0 0 0 4.06 10.65C49.16 191.53 78.51 216 128 216a130 130 0 0 0 48-8.76V240a8 8 0 0 0 16 0v-40.62a121 121 0 0 0 27.94-22.44 15.9 15.9 0 0 0 4.06-10.65v-48.42l27.76-14.81a8 8 0 0 0 0-14.12M128 200c-43.27 0-68.72-21.14-80-33.71V126.4l76.24 40.66a8 8 0 0 0 7.52 0L176 143.47v46.34c-12 5.66-27.31 10.19-48 10.19m80-33.75a105 105 0 0 1-16 14.25v-46.15l16-8.54ZM128 151.06 84.4 128 190 71.62a8 8 0 0 0-7.52-14.12L67.14 119l-38.61-20.6L128 45.07l99.47 53.06Z"/>
  </svg>
);
const SpinnerGap = ({ s = 24 }) => (
  <svg className="lk-spin" width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.6 40 92.83 40 128a88 88 0 0 0 176 0c0-35.17-20.15-66.4-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128"/>
  </svg>
);
const ChevronDown = ({ s = 18 }) => (
  <svg className="chev" width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"/>
  </svg>
);
const XIcon = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
  </svg>
);

const EyeIcon = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="128" cy="128" r="32"/><path d="M128 56C48 56 16 128 16 128s32 72 112 72 112-72 112-72-32-72-112-72Z"/>
  </svg>
);
const SparkleIcon = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M208 144a15.78 15.78 0 0 1-10.42 14.94l-51.65 19-19 51.61a15.92 15.92 0 0 1-29.88 0L78 178l-51.62-19a15.92 15.92 0 0 1 0-29.88l51.65-19 19-51.61a15.92 15.92 0 0 1 29.88 0l19 51.65 51.61 19A15.78 15.78 0 0 1 208 144M248 71h-17V54a8 8 0 0 0-16 0v17h-17a8 8 0 0 0 0 16h17v17a8 8 0 0 0 16 0V87h17a8 8 0 0 0 0-16"/>
  </svg>
);

/* ---------- Feide symbol (official mark) ---------- */
const FeideMark = ({ s = 24 }) => (
  <svg height={s} viewBox="0 0 371.02 449" fill="currentColor" aria-hidden="true" style={{ width: "auto" }}>
    <rect x="322.21" y="234.2" width="48.82" height="117.17"></rect>
    <polygon points="209.92 268.37 161.1 268.37 161.1 400.18 48.82 400.18 48.82 234.2 0 234.2 0 409.94 0.24 409.94 0.24 449 371.02 449 371.02 400.18 209.92 400.18 209.92 268.37"></polygon>
    <circle cx="185.51" cy="190.26" r="29.29"></circle>
    <path d="M185.51,48.82c75.3,0,136.56,61.26,136.56,136.56h48.82C370.89,83.16,287.73,0,185.51,0S.14,83.16.14,185.38H49C49,110.08,110.21,48.82,185.51,48.82Z"></path>
  </svg>
);

/* ---------- Sikt symbol (two-shape mark) ---------- */
const SiktSymbol = ({ s = 30 }) => (
  <svg height={s} viewBox="0 0 75 48" fill="currentColor" aria-hidden="true">
    <path d="m52.262 1.63c-6.4928 0-12.331 2.769-16.409 7.1748l9.9983 9.9983c2.8644 2.8644 2.8644 7.5294 0 10.394l-9.9983 9.9983c4.092 4.4058 9.9301 7.1748 16.409 7.1748 12.358 0 22.37-10.012 22.37-22.37 0-12.358-10.012-22.37-22.37-22.37z"/>
    <path d="m29.893 24c0-5.8653 2.2643-11.212 5.9608-15.195l-6.6565-6.6564c-2.8644-2.8645-7.5294-2.8645-10.394 0l-16.655 16.655c-2.8645 2.8644-2.8645 7.5294 0 10.394l16.655 16.655c2.8644 2.8644 7.5294 2.8644 10.394 0l6.6565-6.6565c-3.7102-3.9829-5.9608-9.3299-5.9608-15.195z"/>
  </svg>
);

/* ---------- Category artwork: real exported blobs ---------- */
const CAT_ART = {
  "Grunnskole":          "assets/cat-grunnskole.svg",
  "Videregående skole":  "assets/cat-videregaende.svg",
  "Voksenopplæring":     "assets/cat-voksen.svg",
};

const CategoryArt = ({ level }) => (
  <img className="lk-cat__img" src={CAT_ART[level]} alt="" />
);

/* ---------- Discovery illustration ---------- */
const Illustration = () => (
  <img src="assets/illu-kikkert.png" alt="Illustrasjon: person som speider med kikkert" />
);

/* ---------- circle-plus (add filter) ---------- */
const Plus = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m40 112h-32v32a8 8 0 0 1-16 0v-32H88a8 8 0 0 1 0-16h32V88a8 8 0 0 1 16 0v32h32a8 8 0 0 1 0 16"/>
  </svg>
);

/* ---------- Delt innloggingstilstand (alle sider) ---------- */
const LK_USER = {
  navn: "Kari Nordmann",
  initialer: "KN",
  rolle: "Lærer",
  organisasjon: "Solvik fylkeskommune",
  skole: "Solvik videregående skole",
};
const LK_AUTH_KEY = "lk.auth";
let lkPending = false;
const lkReadAuth = () => {
  try { return JSON.parse(window.localStorage.getItem(LK_AUTH_KEY) || "null"); } catch (e) { return null; }
};
const lkWriteAuth = (u) => {
  try {
    if (u) window.localStorage.setItem(LK_AUTH_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(LK_AUTH_KEY);
  } catch (e) {}
  window.dispatchEvent(new CustomEvent("lk-auth"));
};
function useAuth() {
  const [user, setUser] = React.useState(() => lkReadAuth());
  const [pending, setPending] = React.useState(lkPending);
  React.useEffect(() => {
    const sync = () => { setUser(lkReadAuth()); setPending(lkPending); };
    window.addEventListener("lk-auth", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("lk-auth", sync); window.removeEventListener("storage", sync); };
  }, []);
  return {
    user,
    isLoggedIn: !!user,
    pending,
    login: () => {
      if (lkPending) return;
      lkPending = true;
      window.dispatchEvent(new CustomEvent("lk-auth"));
      window.setTimeout(() => { lkPending = false; lkWriteAuth(LK_USER); }, 2000);
    },
    logout: () => lkWriteAuth(null),
  };
}

/* ---------- Header with working language dropdown ----------
   variant: "accent" (purple, start page) | "plain" (white, app pages)
   homeHref: when set, the logo is a normal link there; otherwise scrolls to top
   Innloggingstilstanden er delt via useAuth — headeren er identisk på alle sider.
   onProfile: overstyr navigasjonen til Min side (default: Startside.html?side=minside) */
const LANGS = ["Norsk bokmål", "Norsk nynorsk", "English"];
const LANG_SHORT = { "Norsk bokmål": "Bokmål", "Norsk nynorsk": "Nynorsk", "English": "English" };
function Header({ variant = "accent", homeHref = "Startside.html", defaultLang = "Norsk bokmål", onProfile = null } = {}) {
  const { isLoggedIn, user, login, pending } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [lang, setLang] = React.useState(defaultLang);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const logoProps = homeHref
    ? { href: homeHref }
    : { href: "#", onClick: (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  return (
    <header className={"lk-header" + (variant === "plain" ? " lk-header--plain" : "")}>
      <div className="lk-header__inner">
        <a className="lk-logo" aria-label="Læremiddelkatalogen — til forsiden" {...logoProps}>
          <SiktSymbol s={30} />
          <span className="lk-logo__word">Læremiddelkatalogen</span>
        </a>
        <div className="lk-header__right">
          <div className="lk-lang" ref={ref}>
            <button className="lk-lang__btn" aria-haspopup="listbox" aria-expanded={open}
                    onClick={() => setOpen(o => !o)}>
              <span>{LANG_SHORT[lang] || lang}</span>
              <ChevronDown s={16} />
            </button>
            {open && (
              <div className="lk-lang__menu" role="listbox">
                {LANGS.map(l => (
                  <button key={l} className="lk-lang__item" role="option" aria-current={l === lang}
                          onClick={() => { setLang(l); setOpen(false); }}>{l}</button>
                ))}
              </div>
            )}
          </div>
          {!isLoggedIn && (
            <button className="lk-feide lk-feide--ghost" onClick={login} disabled={pending} aria-busy={pending}>
              {pending ? <SpinnerGap s={24} /> : <FeideMark s={24} />}
              <span>{pending ? "Logger inn…" : "Logg inn med Feide"}</span>
            </button>
          )}
          {isLoggedIn && user && (
            <button className="lk-profile"
                    onClick={onProfile || (() => { window.location.href = "Startside.html?side=minside"; })}
                    aria-label={"Min side, " + user.navn}>
              <span className="lk-avatar" aria-hidden="true">{user.initialer}</span>
              <span className="lk-profile__label">Min side</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */
const FOOT_COLS = [
  { h: "Læremiddelkatalogen", links: [
      ["Om Læremiddelkatalogen", true], ["Ofte stilte spørsmål", true], ["Leverandørflate", true] ] },
  { h: "Kontakt", links: [ ["Gi tilbakemelding", true] ] },
  { h: "Informasjonssikkerhet og personvern", links: [
      ["Tilgjengelighetserklæring", true], ["Les tjenestens personvernerklæring", false],
      ["Bruksvilkår", false], ["Informasjonskapsler", false], ["Endre samtykke for informasjonskapsler", false] ] },
];
function Footer() {
  return (
    <footer className="lk-footer">
      <div className="lk-footer__inner">
        <div className="lk-footer__top">
          <div>
            <a href="#" className="lk-footer__brandlink" aria-label="Sikt">
              <SiktSymbol s={40} />
              <span className="lk-footer__brandtext"><strong>Sikt</strong>Kunnskapssektorens<br/>tjenesteleverandør</span>
            </a>
            <div className="lk-totop">
              <button className="lk-btn lk-btn--strong" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Gå tilbake til toppen
              </button>
            </div>
          </div>
          <div className="lk-footer__cols">
            {FOOT_COLS.map(col => (
              <div key={col.h} className="lk-footer__col">
                <h4>{col.h}</h4>
                <ul>
                  {col.links.map(([label, ext]) => (
                    <li key={label}><a href="#">{label}{ext && <span className="lk-ext"><ExternalLink s={15} /></span>}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  SearchIcon, ArrowRight, ArrowLeft, ExternalLink, FilterIcon, PinIcon, ChevronDown, XIcon, Plus,
  EyeIcon, SparkleIcon, FeideMark, CaretRight, GradCapIcon, SpinnerGap,
  SiktSymbol, CategoryArt, Illustration, Header, Footer, useAuth, LK_USER,
});
