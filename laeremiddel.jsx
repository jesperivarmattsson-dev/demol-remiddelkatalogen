/* ============================================================
   Læremiddel-detaljside ("Om læremiddelet")
   Felt fra teaching-aid-skjemaet: tittel, beskrivelse, fag,
   språk, trinn, leverandør, tjeneste (isPartOf), bilde.
   Reached via Laeremiddel.html?id=<id>.
   ============================================================ */
const { useState, useMemo } = React;

function pickItem() {
  const id = new URLSearchParams(window.location.search).get("id");
  return SK_ITEMS.find(it => String(it.id) === String(id)) || SK_ITEMS[0];
}
const serviceFor = (name) => SK_SERVICES.find(s => s.name === name) || null;

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
function Pills({ items }) {
  return <div className="tj-pills">{items.map(x => <span key={x} className="sk-trinnpill">{x}</span>)}</div>;
}

function App() {
  const item = useMemo(pickItem, []);
  const service = useMemo(() => serviceFor(item.serviceName), [item]);
  const [open, setOpen] = useState(false);

  return (
    <div className="tj-page">
      <Header variant="accent" homeHref="Startside.html" defaultLang="Norsk bokmål" />

      <div className="tj-hero">
        <div className="tj-wrap">
          <nav className="sk-breadcrumb">
            <a href="Startside.html">Hjem</a><span>/</span>
            {service && <React.Fragment><a href={"Tjeneste.html?id=" + service.slug}>{service.name}</a><span>/</span></React.Fragment>}
            {item.title}
          </nav>
          <div className="tj-head">
            <Tile name={item.title} thumb={item.thumb} index={item.id} className="lm-hero-thumb" imgClassName="tj-mthumb__img" />
            <div className="tj-headinfo">
              <div className="tj-badges"><span className="lm-typebadge">{item.type}</span></div>
              <h1 className="tj-title">{item.title}</h1>
              <p className="tj-vendor">
                Levert av {item.vendor}
                {service
                  ? <React.Fragment> som en del av tjenesten <a href={"Tjeneste.html?id=" + service.slug}>{service.name}</a>.</React.Fragment>
                  : "."}
              </p>
              <a className="lk-btn lk-btn--strong" href={item.url || "#"} target="_blank" rel="noopener noreferrer">Gå til læremiddelet <ExternalLink s={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <main className="tj-main">
        <div className="tj-wrap">
          <h2 className="tj-h2">Om læremiddelet</h2>
          <div className="tj-panel">
            <section className="tj-block">
              <h3 className="tj-block__h">Beskrivelse</h3>
              <p className={"tj-desc" + (open ? " is-open" : "")}>{item.desc}</p>
              {item.desc.length > 220 && (
                <button className="tj-vismore-btn" aria-expanded={open} onClick={() => setOpen(o => !o)}>
                  {open ? "Vis mindre" : "Vis mer"} <ChevronDown s={16} />
                </button>
              )}
            </section>
            <section className="tj-block"><h3 className="tj-block__h">Fag</h3><Pills items={item.fag} /></section>
            <section className="tj-block"><h3 className="tj-block__h">Språk</h3><Pills items={item.sprak} /></section>
            <section className="tj-block"><h3 className="tj-block__h">Trinn</h3><Pills items={item.trinn.length ? item.trinn : item.levels} /></section>
          </div>

          {service && (
            <div className="tj-panel lm-part">
              <h2 className="lm-part__h">Dette læremiddelet er en del av {service.name}</h2>
              <p className="tj-p">Læremiddelet {item.title} er en del av {service.name}. Skoleeier er ansvarlig for at tjenesten følger lovpålagte krav før læremiddelet kan tas i bruk. Les mer om <a href="#">hva du må gjøre før du kan ta i bruk en ny digital tjeneste her. <ExternalLink s={15} /></a></p>
              <div className="lm-svc">
                <Tile name={service.name} thumb={service.thumb} index={service.name.length} className="lm-svc__logo" imgClassName="tj-mthumb__img" />
                <div className="lm-svc__body">
                  <div className="tj-badges">
                    <span className="sk-typebadge sk-typebadge--tjeneste">Tjeneste</span>
                    {service.vurdert && <a className="sk-vurdert tj-vurdert-link" href={"Tjeneste.html?id=" + service.slug}>Vurdert</a>}
                  </div>
                  <h3 className="lm-svc__title">Om {service.name}</h3>
                  <ul className="tj-links lm-svc__links">
                    {service.vurdert && <li><a href={"Tjeneste.html?id=" + service.slug}>Se vurderingen av tjenesten i Feide kundeportal <ExternalLink s={15} /></a></li>}
                    <li><a href="#">Les personvernerklæringen til {service.name} <ExternalLink s={15} /></a></li>
                    <li><a href={"Tjeneste.html?id=" + service.slug}>Besøk informasjonssiden om {service.name}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
