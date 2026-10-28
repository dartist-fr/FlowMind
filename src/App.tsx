import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, Bot, Check, ChevronDown, Clock3,
  GitBranch, LayoutDashboard, Menu, Play, Plus, Search, Settings2,
  ShieldCheck, Sparkles, Workflow, X, Zap
} from "lucide-react";

type Flow = {
  id: number;
  name: string;
  description: string;
  status: "Actif" | "Brouillon";
  steps: number;
  updated: string;
};

const initialFlows: Flow[] = [
  { id: 1, name: "Veille quotidienne", description: "Collecter les nouveautés et préparer un résumé.", status: "Actif", steps: 4, updated: "Il y a 12 min" },
  { id: 2, name: "Organiser mes notes", description: "Classer les notes selon leur sujet.", status: "Brouillon", steps: 3, updated: "Hier" },
  { id: 3, name: "Assistant de rédaction", description: "Préparer un brouillon à partir d’une idée.", status: "Actif", steps: 5, updated: "Il y a 2 jours" },
];

type Filter = "Tous" | "Actifs" | "Brouillons";

export default function App() {
  const [flows, setFlows] = useState(initialFlows);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Tous");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const visible = useMemo(() => flows.filter((flow) => {
    const matchesQuery = `${flow.name} ${flow.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "Tous" || (filter === "Actifs" ? flow.status === "Actif" : flow.status === "Brouillon");
    return matchesQuery && matchesFilter;
  }), [flows, query, filter]);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  }

  function createFlow() {
    if (!name.trim()) return;
    setFlows((current) => [{
      id: Date.now(),
      name: name.trim(),
      description: "Nouveau workflow à configurer.",
      status: "Brouillon",
      steps: 1,
      updated: "À l’instant",
    }, ...current]);
    setName("");
    setFilter("Tous");
    setQuery("");
    setCreating(false);
    notify("Workflow ajouté à cette session.");
  }

  const activeCount = flows.filter((flow) => flow.status === "Actif").length;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${navOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#dashboard" aria-label="FlowMind, accueil">
          <span className="brand-mark"><Workflow size={21} strokeWidth={2.2} /></span>
          <span className="brand-name">flow<span>mind</span><small>WORKFLOW STUDIO</small></span>
          <button className="icon-btn close-nav" onClick={(event) => { event.preventDefault(); setNavOpen(false); }} aria-label="Fermer le menu"><X size={18} /></button>
        </a>

        <button className="workspace" onClick={() => notify("Tu es dans ton espace personnel.")}>
          <span className="avatar">D</span>
          <span className="workspace-copy"><b>Mon espace</b><small>Espace personnel</small></span>
          <ChevronDown size={15} className="workspace-chevron" />
        </button>

        <p className="nav-label">ESPACE DE TRAVAIL</p>
        <nav className="nav-list" aria-label="Navigation principale">
          <a className="nav-link active" href="#dashboard" onClick={() => setNavOpen(false)}><LayoutDashboard size={17} />Vue d’ensemble</a>
          <a className="nav-link" href="#workflows" onClick={() => setNavOpen(false)}><Workflow size={17} />Mes workflows<span className="nav-count">{flows.length}</span></a>
          <a className="nav-link" href="#activity" onClick={(event) => { event.preventDefault(); notify("L’historique sera disponible avec le moteur d’exécution."); }}><Activity size={17} />Historique</a>
        </nav>

        <p className="nav-label nav-label-tools">OUTILS</p>
        <nav className="nav-list" aria-label="Outils">
          <a className="nav-link" href="#assistant" onClick={(event) => { event.preventDefault(); notify("L’assistant IA est prévu dans une prochaine version."); }}><Sparkles size={17} />Assistant IA<span className="nav-soon">BIENTÔT</span></a>
          <a className="nav-link" href="#integrations" onClick={(event) => { event.preventDefault(); notify("Les intégrations ne sont pas encore activées."); }}><GitBranch size={17} />Intégrations</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="local-card">
            <span className="local-shield"><ShieldCheck size={17} /></span>
            <span><b>Mode local</b><small>Sans API payante</small></span>
            <i aria-label="Actif" />
          </div>
          <a className="nav-link settings-link" href="#settings" onClick={(event) => { event.preventDefault(); notify("Les paramètres seront ajoutés prochainement."); }}><Settings2 size={17} />Paramètres</a>
          <div className="profile">
            <span className="avatar">D</span>
            <span><b>Damien</b><small>Espace personnel</small></span>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      {navOpen && <button className="scrim" onClick={() => setNavOpen(false)} aria-label="Fermer le menu" />}

      <main className="main-area" id="dashboard">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu" onClick={() => setNavOpen(true)} aria-label="Ouvrir le menu"><Menu size={20} /></button>
            <div className="breadcrumb"><span>Mon espace</span><span className="breadcrumb-slash">/</span><b>Vue d’ensemble</b></div>
          </div>
          <div className="top-actions">
            <span className="local-status"><i />Prêt à explorer</span>
            <button className="shortcut" onClick={() => document.getElementById("workflow-search")?.focus()} aria-label="Rechercher"><Search size={16} /><kbd>/</kbd></button>
            <span className="avatar top-avatar">D</span>
          </div>
        </header>

        <div className="content">
          <section className="welcome">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> TON ESPACE D’AUTOMATISATION</p>
              <h1>Les bonnes idées méritent <span>un plan.</span></h1>
              <p className="welcome-sub">Salut Damien, prêt à simplifier ton quotidien ?</p>
            </div>
            <button className="primary" onClick={() => setCreating(true)}><Plus size={17} />Nouveau workflow</button>
          </section>

          <section className="hero">
            <div className="hero-glow" />
            <div className="hero-copy">
              <span className="hero-kicker"><Sparkles size={13} /> FLOWMIND STUDIO <span className="kicker-divider" /> APERÇU MVP</span>
              <h2>Moins de répétition.<br /><em>Plus d’élan.</em></h2>
              <p>Transforme tes tâches répétitives en workflows simples, transparents et maîtrisés. Commence petit, avance à ton rythme.</p>
              <button className="hero-btn" onClick={() => setCreating(true)}>Créer une automatisation <ArrowRight size={16} /></button>
              <div className="hero-note"><ShieldCheck size={14} /> Tes données restent dans cette session</div>
            </div>
            <div className="workflow-art" aria-hidden="true">
              <div className="art-grid" />
              <svg className="connection-lines" viewBox="0 0 390 280" fill="none">
                <path d="M195 57 V94 M195 144 V181" stroke="url(#line)" strokeWidth="1.5" strokeDasharray="4 5" />
                <path d="M195 57 V94 M195 144 V181" stroke="#9B8BFF" strokeWidth="1.5" />
                <defs><linearGradient id="line" x1="195" y1="57" x2="195" y2="181"><stop stopColor="#A99AFF" /><stop offset="1" stopColor="#5DD9B0" /></linearGradient></defs>
              </svg>
              <div className="art-node trigger-node"><span className="art-node-icon trigger-icon"><Zap size={17} /></span><span className="art-node-copy"><small>01 · DÉCLENCHEUR</small><b>Nouvelle idée</b></span><span className="node-check"><Check size={12} /></span></div>
              <div className="art-node process-node"><span className="art-node-icon process-icon"><Bot size={17} /></span><span className="art-node-copy"><small>02 · TRAITEMENT</small><b>Organiser le contenu</b></span><Sparkles size={15} className="node-sparkle" /></div>
              <div className="art-node action-node"><span className="art-node-icon action-icon"><Check size={17} /></span><span className="art-node-copy"><small>03 · RÉSULTAT</small><b>Tout est prêt</b></span><span className="node-check"><Check size={12} /></span></div>
              <div className="art-status"><span /> Flux visualisé <b>03 étapes</b></div>
              <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            </div>
            <div className="hero-index">01 <span>/</span> 03</div>
          </section>

          <section className="stats" aria-label="Statistiques des workflows">
            <article className="stat-card">
              <div className="stat-top"><span>Workflows créés</span><span className="stat-icon stat-purple"><Workflow size={17} /></span></div>
              <div className="stat-value">{flows.length}<span className="stat-trend"><ArrowDownRight size={13} /> espace perso</span></div>
              <p>Dans cette session</p>
              <div className="stat-progress"><span style={{ width: `${Math.min(flows.length * 12, 100)}%` }} /></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Workflows actifs</span><span className="stat-icon stat-green"><Zap size={17} /></span></div>
              <div className="stat-value">{activeCount}<span className="stat-trend trend-green"><span className="tiny-dot" /> disponibles</span></div>
              <p>Prêts à être simulés</p>
              <div className="stat-progress progress-green"><span style={{ width: `${flows.length ? (activeCount / flows.length) * 100 : 0}%` }} /></div>
            </article>
            <article className="stat-card stat-card-note">
              <div className="stat-top"><span>Exécutions réelles</span><span className="stat-icon stat-blue"><Clock3 size={17} /></span></div>
              <div className="stat-value">—<span className="stat-trend">moteur à venir</span></div>
              <p>Les tests actuels sont simulés</p>
              <div className="stat-note"><ShieldCheck size={13} /> Aucune action externe lancée</div>
            </article>
          </section>

          <section className="section-head" id="workflows">
            <div><span className="section-overline">TON ESPACE DE TRAVAIL</span><h2>Mes workflows <span className="heading-count">{flows.length.toString().padStart(2, "0")}</span></h2><p>Retrouve tes idées, ajuste-les et teste ton prochain flux.</p></div>
            <button className="text-btn" onClick={() => setCreating(true)}>Nouveau workflow <ArrowRight size={15} /></button>
          </section>

          <section className="workflow-panel">
            <div className="toolbar">
              <div className="tabs" role="group" aria-label="Filtrer les workflows">
                {(["Tous", "Actifs", "Brouillons"] as Filter[]).map((item) => <button key={item} className={`tab ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>{item}<span>{item === "Tous" ? flows.length : item === "Actifs" ? activeCount : flows.length - activeCount}</span></button>)}
              </div>
              <label className="search-box"><Search size={16} /><input id="workflow-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un workflow…" /><kbd>⌘ K</kbd></label>
            </div>

            <div className="flow-list">
              {visible.map((flow) => <article className="flow-card" key={flow.id}>
                <span className={`flow-icon flow-icon-${flow.id % 3}`}>{flow.id % 3 === 1 ? <Zap size={19} /> : flow.id % 3 === 2 ? <GitBranch size={19} /> : <Bot size={19} />}</span>
                <div className="flow-info">
                  <div className="flow-title"><h3>{flow.name}</h3><span className={`status ${flow.status === "Actif" ? "is-active" : "is-draft"}`}><i />{flow.status}</span></div>
                  <p>{flow.description}</p>
                  <div className="flow-meta"><span><GitBranch size={13} />{flow.steps} étapes</span><span className="meta-separator">·</span><span><Clock3 size={13} />{flow.updated}</span></div>
                </div>
                <button className="run-btn" onClick={() => notify(`Simulation de « ${flow.name} » lancée. Aucune action externe exécutée.`)}><Play size={13} fill="currentColor" />Tester</button>
              </article>)}
              {visible.length === 0 && <div className="empty-state"><span><Search size={22} /></span><b>Aucun workflow trouvé</b><p>Modifie ta recherche ou crée une nouvelle automatisation.</p><button className="secondary" onClick={() => { setQuery(""); setFilter("Tous"); }}>Réinitialiser les filtres</button></div>}
            </div>
            <div className="panel-foot"><span>Affichage de <b>{visible.length}</b> sur <b>{flows.length}</b> workflows</span><span><span className="tiny-dot" /> Modifications non persistantes</span></div>
          </section>

          <section className="bottom-cards">
            <article className="tip-card"><span className="tip-icon tip-spark"><Sparkles size={18} /></span><div><span className="tip-label">UN CONSEIL POUR COMMENCER</span><b>Pars d’une petite tâche.</b><p>Repère une action répétitive, puis découpe-la en étapes simples. Le reste viendra progressivement.</p></div><ArrowRight size={16} className="tip-arrow" /></article>
            <article className="tip-card"><span className="tip-icon tip-shield"><ShieldCheck size={18} /></span><div><span className="tip-label">TRANSPARENCE D’ABORD</span><b>Tu gardes le contrôle.</b><p>Le bouton Tester lance une simulation. Aucun email ou fichier externe n’est modifié.</p></div><span className="free-tag">OPEN SOURCE</span></article>
          </section>

          <footer className="site-footer"><span className="footer-brand"><span className="footer-mark"><Workflow size={13} /></span>FlowMind <span className="footer-separator">/</span> Open source</span><span className="footer-motto">Décris. Construis. Automatise.</span><a href="https://github.com/dartist-fr/FlowMind" target="_blank" rel="noreferrer">Explorer sur GitHub <ArrowRight size={13} /></a></footer>
        </div>
      </main>

      {creating && <div className="modal-bg" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreating(false); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-top"><span className="modal-icon"><Workflow size={20} /></span><button className="icon-btn" onClick={() => setCreating(false)} aria-label="Fermer"><X size={18} /></button></div>
          <span className="modal-kicker">FLOWMIND STUDIO</span><h2 id="modal-title">Une nouvelle idée ?</h2><p>Donne un nom à ton workflow. Tu pourras ensuite définir les étapes à automatiser.</p>
          <label htmlFor="flow-name">Nom du workflow</label><input id="flow-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createFlow(); }} placeholder="Ex. Organiser mes notes" />
          <small className="modal-hint"><ShieldCheck size={14} />Créé localement dans cette session.</small>
          <div className="modal-actions"><button className="secondary" onClick={() => setCreating(false)}>Annuler</button><button className="primary" disabled={!name.trim()} onClick={createFlow}><Plus size={16} />Créer le workflow</button></div>
        </section>
      </div>}

      {notice && <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Fermer"><X size={15} /></button></div>}
    </div>
  );
}
