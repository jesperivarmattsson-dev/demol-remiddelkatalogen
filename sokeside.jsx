/* ============================================================
   Søkeside — app
   Left filter panel, search field, active-filter bar,
   result cards, pagination, info box. Driven by sokedata.js.
   ============================================================ */
const { useState, useEffect, useMemo, useRef } = React;

const PAGE = 6;
const CHIP_PREFIX = { type: "Type", fag: "Fag", trinn: "Trinn", sprak: "Språk", malgruppe: "Målgruppe", tdl: "" };

/* empty selection object built from the active filter groups */
const blankFilters = () => { const o = { levels: [] }; SK_GROUP_KEYS.forEach(k => { o[k] = []; }); return o; };

/* map a start-page level label onto the (nynorsk) søkeside level */
function normalizeLevel(n) {
  if (!n) return null;
  const s = n.toLowerCase();
  if (s.includes("videreg") || s.includes("vidareg")) return "Vidaregående";
  if (s.includes("voksen")) return "Voksenopplæring";
  if (s.includes("grunn")) return "Grunnskole";
  return null;
}

/* does an item pass the filters? skipKey lets us ignore one dimension (unused here, kept for counts) */
function matchItem(item, f, skipKey) {
  const q = f.query.trim().toLowerCase();
  const title = item.title || item.name || "";
  if (q) {
    const typeStr = Array.isArray(item.type) ? item.type.join(" ") : (item.type || "");
    const hay = (title + " " + item.vendor + " " + item.desc + " " + item.fag.join(" ") + " " + typeStr).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (skipKey !== "levels" && f.levels.length && !f.levels.some(v => item.levels.includes(v))) return false;
  for (const key of SK_GROUP_KEYS) {
    if (key === skipKey) continue;
    const sel = f[key];
    if (sel && sel.length) {
      if (key === "tdl") { if (!item.vurdert) return false; continue; }
      const val = item[key];
      const arr = Array.isArray(val) ? val : (val ? [val] : []);
      if (!sel.some(v => arr.includes(v))) return false;
    }
  }
  return true;
}

/* ---------- Nested fag-tree (Videregåendefag) ----------
   Recursive accordion: utdanningsprogram → programområde → fag (checkbox).
   A node is a string (leaf/fag) or { l, c } (expandable branch). */
function FagTreeNode({ node, depth, filters, toggle }) {
  const [open, setOpen] = useState(false);
  const pad = 8 + depth * 20;
  if (typeof node === "string") {
    return (
      <label className="sk-check sk-ftree__leaf" style={{ paddingLeft: pad }}>
        <input type="checkbox" checked={filters.fag.includes(node)} onChange={() => toggle("fag", node)} />
        <span>{node}</span>
      </label>
    );
  }
  return (
    <div className="sk-ftree__node">
      <button className="sk-fnode" aria-expanded={open} style={{ paddingLeft: pad }} onClick={() => setOpen(o => !o)}>
        <span className="sk-fnode__label">{node.l}</span><ChevronDown s={18} />
      </button>
      {open && (
        <div className="sk-ftree__children">
          {node.c.map((child, i) => (
            <FagTreeNode key={(typeof child === "string" ? child : child.l) + i} node={child} depth={depth + 1} filters={filters} toggle={toggle} />
          ))}
        </div>
      )}
    </div>
  );
}
function FagTree({ nodes, filters, toggle }) {
  return (
    <div className="sk-ftree">
      {nodes.map((n, i) => (
        <FagTreeNode key={(typeof n === "string" ? n : n.l) + i} node={n} depth={0} filters={filters} toggle={toggle} />
      ))}
    </div>
  );
}

/* ---------- Filter panel ---------- */
function FilterGroup({ g, filters, toggle, open, onToggleOpen, expanded, onToggleExpand }) {
  const isTree = !!g.tree;
  const opts = isTree ? [] : (expanded ? g.options : g.options.slice(0, g.initial));
  const hasMore = !isTree && g.options.length > g.initial;
  return (
    <div className="sk-fgroup">
      <button className="sk-fgroup__head" aria-expanded={open} onClick={onToggleOpen}>
        {g.title}<ChevronDown s={18} />
      </button>
      {open && (
        isTree ? (
          <div className="sk-fgroup__list sk-fgroup__list--tree">
            <FagTree nodes={g.tree} filters={filters} toggle={toggle} />
          </div>
        ) : (
          <div className="sk-fgroup__list">
            {opts.map(opt => (
              <label className="sk-check" key={opt}>
                <input type="checkbox" checked={filters[g.key].includes(opt)} onChange={() => toggle(g.key, opt)} />
                <span>{opt}</span>
              </label>
            ))}
            {hasMore && (
              <button className="sk-vismore" aria-expanded={expanded} onClick={onToggleExpand}>
                {expanded ? "Vis mindre" : "Vis mer"} <ChevronDown s={14} />
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}

function FilterPanel({ groups, filters, toggle, openGroups, setOpenGroups, expandedGroups, setExpandedGroups, onApply, dirty }) {
  return (
    <aside className="sk-filters">
      <h2 className="sk-filters__head"><FilterIcon s={18} /> Filter</h2>
      <button className="lk-btn lk-btn--strong sk-apply" onClick={onApply} disabled={!dirty}>
        {dirty ? "Bruk filter" : "Filter er brukt"}
      </button>
      {groups.map(g => (
        <FilterGroup key={g.uid} g={g} filters={filters} toggle={toggle}
          open={openGroups[g.uid] === true}
          onToggleOpen={() => setOpenGroups(s => ({ ...s, [g.uid]: !s[g.uid] }))}
          expanded={!!expandedGroups[g.uid]}
          onToggleExpand={() => setExpandedGroups(s => ({ ...s, [g.uid]: !s[g.uid] }))} />
      ))}
    </aside>
  );
}

/* ---------- Active filter bar ---------- */
function FilterBar({ filters, applied, toggleLevel, toggle, removeApplied, clearAll }) {
  const chips = [];
  SK_GROUP_KEYS.forEach(key => (applied[key] || []).forEach(v => chips.push({ key, value: v })));
  const anyActive = applied.levels.length > 0 || chips.length > 0;
  return (
    <div className="sk-filterbar">
      <div className="sk-levels" role="group" aria-label="Skoleslag">
        {SK_LEVELS.map(lv => {
          const active = filters.levels.includes(lv);
          return (
            <button key={lv} aria-pressed={active}
              className={"sk-pill sk-pill--level" + (active ? " sk-pill--active" : "")}
              onClick={() => toggleLevel(lv)}>
              {lv} <span className="ic">{active ? <XIcon s={14} /> : <Plus s={16} />}</span>
            </button>
          );
        })}
      </div>
      {chips.length > 0 && (
        <div className="sk-chiprow">
          {chips.map(c => (
            <button key={c.key + c.value} className="sk-pill sk-pill--active" onClick={() => removeApplied(c.key, c.value)}>
              {CHIP_PREFIX[c.key] ? CHIP_PREFIX[c.key] + ": " : ""}{c.value} <span className="ic"><XIcon s={14} /></span>
            </button>
          ))}
          {anyActive && <button className="sk-clearall" onClick={clearAll}>Fjern alle filtre <XIcon s={14} /></button>}
        </div>
      )}
    </div>
  );
}

/* ---------- Result card ---------- */
function Thumb({ item, index }) {
  const c = SK_THUMBS[index % SK_THUMBS.length];
  const [ok, setOk] = useState(false);
  return (
    <div className="sk-thumb" style={{ background: c.bg, color: c.fg }}>
      {!ok && <span>{item.title[0]}</span>}
      {item.thumb && (
        <img className="sk-thumb__img" src={item.thumb} alt="" loading="lazy"
          style={{ opacity: ok ? 1 : 0 }} onLoad={() => setOk(true)} onError={() => setOk(false)} />
      )}
    </div>
  );
}
function FagPills({ fag }) {
  const shown = fag.slice(0, 3);
  const extra = fag.length - shown.length;
  return (
    <div className="sk-metapills">
      {shown.map(f => {
        const col = SK_FAG_COLOR[f];
        return <span key={f} className="sk-fagpill" style={col ? { background: col.bg, color: col.fg } : undefined}>{f}</span>;
      })}
      {extra > 0 && <span className="sk-morepill">+{extra}</span>}
    </div>
  );
}
function TrinnPills({ item }) {
  const list = item.trinn.length ? item.trinn : item.levels;
  const shown = list.slice(0, 3);
  const extra = list.length - shown.length;
  return (
    <div className="sk-metapills">
      {shown.map(t => <span key={t} className="sk-trinnpill">{t}</span>)}
      {extra > 0 && <span className="sk-morepill">+{extra}</span>}
    </div>
  );
}
function ResultCard({ item, index }) {
  return (
    <a className="sk-card" href={"Laeremiddel.html?id=" + item.id}>
      <Thumb item={item} index={index} />
      <div className="sk-card__main">
        <div className="sk-badges">
          <span className="sk-typebadge">{item.type}</span>
          {item.vurdert && <span className="sk-vurdert">Vurdert</span>}
        </div>
        <h3 className="sk-card__title">{item.title}</h3>
        <p className="sk-card__vendor">Leveres av {item.vendor}</p>
        <p className="sk-card__desc">{item.desc}</p>
      </div>
      <div className="sk-meta">
        <div className="sk-meta__col"><p className="sk-meta__h">Fag</p><FagPills fag={item.fag} /></div>
        <div className="sk-meta__col"><p className="sk-meta__h">Trinn</p><TrinnPills item={item} /></div>
      </div>
    </a>
  );
}

function TjenesteCard({ item, index }) {
  return (
    <a className="sk-card sk-card--tjeneste" href={"Tjeneste.html?id=" + encodeURIComponent(item.slug)}>
      <Thumb item={{ title: item.name, thumb: item.thumb }} index={index} />
      <div className="sk-card__main">
        <div className="sk-badges">
          <span className="sk-typebadge sk-typebadge--tjeneste">Tjeneste</span>
          {item.vurdert && <span className="sk-vurdert">Vurdert</span>}
        </div>
        <h3 className="sk-card__title">{item.name}</h3>
        <p className="sk-card__vendor">Levert av {item.vendor}</p>
        <p className="sk-card__desc">{item.desc}</p>
        <p className="sk-service-meta">{item.memberTotal} læremidler i tjenesten</p>
      </div>
      <div className="sk-meta">
        <div className="sk-meta__col"><p className="sk-meta__h">Fag</p><FagPills fag={item.fag} /></div>
        <div className="sk-meta__col"><p className="sk-meta__h">Trinn</p><TrinnPills item={item} /></div>
      </div>
    </a>
  );
}

/* ---------- App ---------- */
function App() {
  const params = new URLSearchParams(window.location.search);
  const initLevel = normalizeLevel(params.get("niva"));
  const initQuery = params.get("q") || "";

  /* draft = det brukaren vel i panelet. applied = det resultatlista faktisk brukar.
     Filtreringa skjer først når "Bruk filter" blir trykt. Søketeksten er live. */
  const initial = { query: initQuery, ...blankFilters(), levels: initLevel ? [initLevel] : [] };
  const [draft, setDraft] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const filters = draft;
  const [openGroups, setOpenGroups] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [shown, setShown] = useState(PAGE);
  const resultsRef = useRef(null);

  const setQuery = (q) => { setDraft(f => ({ ...f, query: q })); setApplied(f => ({ ...f, query: q })); };
  const toggle = (key, v) => setDraft(f => ({ ...f, [key]: f[key].includes(v) ? f[key].filter(x => x !== v) : [...f[key], v] }));
  /* Skoleslag (gradeGroup) er fleirval — vel eitt eller fleire og kombiner.
     Kvart valt nivå legg til si eiga Fag-gruppe; Årstrinn er slått saman. */
  const toggleLevel = (lv) => toggle("levels", lv);
  const clearAll = () => { setDraft(f => ({ query: f.query, ...blankFilters() })); setApplied(f => ({ query: f.query, ...blankFilters() })); };
  const removeApplied = (key, v) => {
    const drop = (f) => ({ ...f, [key]: (f[key] || []).filter(x => x !== v) });
    setDraft(drop); setApplied(drop);
  };
  const groups = useMemo(() => skGroupsForLevels(draft.levels), [draft.levels]);

  const sameSel = (a, b) => ["levels", ...SK_GROUP_KEYS].every(k => {
    const x = a[k] || [], y = b[k] || [];
    return x.length === y.length && x.every(v => y.includes(v));
  });
  const dirty = !sameSel(draft, applied);

  const services = useMemo(() => SK_SERVICES.filter(s => matchItem(s, applied)), [applied]);
  const laremidler = useMemo(() => SK_ITEMS.filter(it => matchItem(it, applied)), [applied]);
  const list = useMemo(() => [...services, ...laremidler], [services, laremidler]);
  useEffect(() => { setShown(PAGE); }, [applied]);
  const visible = list.slice(0, shown);

  const onApply = () => {
    setApplied(draft);
    if (resultsRef.current) {
      const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sk-page">
      <Header homeHref="Startside.html" />
      <div className="sk-layout">
        <FilterPanel groups={groups} filters={filters} toggle={toggle}
          openGroups={openGroups} setOpenGroups={setOpenGroups}
          expandedGroups={expandedGroups} setExpandedGroups={setExpandedGroups}
          onApply={onApply} dirty={dirty} />
        <div className="sk-content">
          <nav className="sk-breadcrumb"><a href="Startside.html">Hjem</a><span>/</span>Søk</nav>
          <div className="sk-searchbar">
            <input type="search" value={filters.query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Søk på filter eller læremidler" aria-label="Søk på filter eller læremidler" />
            <span className="sk-searchbar__icon"><SearchIcon s={20} /></span>
          </div>
          <FilterBar filters={filters} applied={applied} toggleLevel={toggleLevel} toggle={toggle} removeApplied={removeApplied} clearAll={clearAll} />
          <h2 className="sk-count" ref={resultsRef}>{list.length} {list.length === 1 ? "resultat" : "resultater"}</h2>

          {visible.length === 0 ? (
            <div className="sk-empty"><h3>Ingen treff</h3><p>Prøv et annet søkeord, eller fjern noen filtre.</p></div>
          ) : visible.map((it, i) => (
            it.kind === "tjeneste"
              ? <TjenesteCard key={it.id} item={it} index={i} />
              : <ResultCard key={it.id} item={it} index={i} />
          ))}

          {visible.length > 0 && (
            <React.Fragment>
              <p className="sk-showing">Viser {visible.length} av {list.length} resultater</p>
              {shown < list.length && (
                <button className="lk-btn lk-btn--ghost sk-morebtn" onClick={() => setShown(s => s + PAGE)}>
                  Vis flere resultater <Plus s={18} />
                </button>
              )}
            </React.Fragment>
          )}

          <section className="sk-infobox">
            <h3 className="sk-infobox__title">Læremiddelkatalogen er under utvikling</h3>
            <p className="sk-infobox__body">Ønsker du å gi innspill til forbedringer, eller lese mer om hva katalogen er og hva som blir veien videre?</p>
            <div className="sk-infobox__btns">
              <a className="lk-btn lk-btn--ghost" href="#">Gi tilbakemelding <ExternalLink s={18} /></a>
              <a className="lk-btn lk-btn--ghost" href="#">Les mer på Sikt sine sider <ExternalLink s={18} /></a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
