import { useEffect, useMemo, useState } from "react";
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
  const [flows, setFlows] = useState<Flow[]>(() => {
    try {
      const saved = window.localStorage.getItem("flowmind:workflows:v1");
      if (!saved) return initialFlows;
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialFlows;
      const valid = parsed.filter((item): item is Flow =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.description === "string" &&
        (item.status === "Actif" || item.status === "Brouillon") &&
        typeof item.steps === "number" &&
        typeof item.updated === "string"
      );
      return valid;
    } catch {
      return initialFlows;
    }
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Tous");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [editing, setEditing] = useState<Flow | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSteps, setEditSteps] = useState("1");
  const [editStatus, setEditStatus] = useState<Flow["status"]>("Brouillon");
  const [panel, setPanel] = useState<"history" | "settings" | "ai" | "integrations" | null>(null);
  const [history, setHistory] = useState<{id:number; name:string; time:string; result:string}[]>(() => {
    try {
      const raw = window.localStorage.getItem("flowmind:history:v1");
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is {id:number; name:string; time:string; result:string} =>
        item !== null && typeof item === "object" &&
        typeof item.id === "number" && typeof item.name === "string" &&
        typeof item.time === "string" && typeof item.result === "string"
      );
    } catch { return []; }
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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
    notify("Workflow enregistré sur cet appareil.");
  }

  useEffect(() => {
    try {
      window.localStorage.setItem("flowmind:workflows:v1", JSON.stringify(flows));
    } catch {
      notify("Impossible de sauvegarder localement : le stockage du navigateur est indisponible.");
    }
  }, [flows]);

  useEffect(() => {
    try { localStorage.setItem("flowmind:history:v1", JSON.stringify(history.slice(0, 100))); } catch { /* local storage may be unavailable */ }
  }, [history]);

  function startEdit(flow: Flow) {
    setEditing(flow); setEditName(flow.name); setEditDescription(flow.description);
    setEditSteps(String(flow.steps)); setEditStatus(flow.status); setCreating(false);
  }
  function saveEdit() {
    if (!editing || !editName.trim()) return;
    setFlows(current => current.map(flow => flow.id === editing.id ? {
      ...flow, name: editName.trim(), description: editDescription.trim(),
      steps: Math.max(1, Math.min(50, Number(editSteps) || 1)), status: editStatus, updated: "À l’instant"
    } : flow));
    setEditing(null); notify("Workflow modifié et sauvegardé sur cet appareil.");
  }
  function runSimulation(flow: Flow) {
    const time = new Date().toLocaleString("fr-FR");
    setHistory(current => [{ id: Date.now(), name: flow.name, time, result: "Simulation terminée — aucune action externe exécutée" }, ...current].slice(0, 100));
    notify(`Simulation de « ${flow.name} » enregistrée dans l’historique.`);
  }
  function deleteFlow(id: number) {
    const flow = flows.find(item => item.id === id);
    setFlows(current => current.filter(item => item.id !== id));
    setConfirmDelete(null);
    if (flow) notify(`Workflow « ${flow.name} » supprimé.`);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      if ((event.key === "/" && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        document.getElementById("workflow-search")?.focus();
      }
      if (event.key === "Escape") {
        setCreating(false);
        setNavOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
          <button className="nav-link nav-action" onClick={() => setPanel("history")}><Activity size={17} />Historique<span className="nav-count">{history.length}</span></button>
        </nav>

        <p className="nav-label nav-label-tools">OUTILS</p>
        <nav className="nav-list" aria-label="Outils">
          <button className="nav-link nav-action" onClick={() => setPanel("ai")}><Sparkles size={17} />Assistant IA<span className="nav-soon">À VENIR</span></button>
          <button className="nav-link nav-action" onClick={() => setPanel("integrations")}><GitBranch size={17} />Intégrations<span className="nav-soon">À VENIR</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="local-card">
            <span className="local-shield"><ShieldCheck size={17} /></span>
            <span><b>Mode local</b><small>Sans API payante</small></span>
            <i aria-label="Actif" />
          </div>
          <button className="nav-link nav-action settings-link" onClick={() => setPanel("settings")}><Settings2 size={17} />Paramètres</button>
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
              <div className="hero-note"><ShieldCheck size={14} /> Tes données restent sur cet appareil</div>
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
              <p>Sur cet appareil</p>
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
                <div className="flow-actions">
                  <button className="run-btn" onClick={() => runSimulation(flow)}><Play size={13} fill="currentColor" />Tester</button>
                  <button className="mini-action" onClick={() => startEdit(flow)} aria-label={`Modifier ${flow.name}`} title="Modifier"><Settings2 size={15} /></button>
                  <button className="mini-action danger-action" onClick={() => setConfirmDelete(flow.id)} aria-label={`Supprimer ${flow.name}`} title="Supprimer"><X size={15} /></button>
                </div>
              </article>)}
              {visible.length === 0 && <div className="empty-state"><span><Search size={22} /></span><b>Aucun workflow trouvé</b><p>Modifie ta recherche ou crée une nouvelle automatisation.</p><button className="secondary" onClick={() => { setQuery(""); setFilter("Tous"); }}>Réinitialiser les filtres</button></div>}
            </div>
            <div className="panel-foot"><span>Affichage de <b>{visible.length}</b> sur <b>{flows.length}</b> workflows</span><span><span className="tiny-dot" /> Sauvegarde locale activée</span></div>
          </section>

          <section className="bottom-cards">
            <article className="tip-card"><span className="tip-icon tip-spark"><Sparkles size={18} /></span><div><span className="tip-label">UN CONSEIL POUR COMMENCER</span><b>Pars d’une petite tâche.</b><p>Repère une action répétitive, puis découpe-la en étapes simples. Le reste viendra progressivement.</p></div><ArrowRight size={16} className="tip-arrow" /></article>
            <article className="tip-card"><span className="tip-icon tip-shield"><ShieldCheck size={18} /></span><div><span className="tip-label">TRANSPARENCE D’ABORD</span><b>Tu gardes le contrôle.</b><p>Le bouton Tester lance une simulation. Aucun email ou fichier externe n’est modifié.</p></div><span className="free-tag">OPEN SOURCE</span></article>
          </section>

          <footer className="site-footer"><span className="footer-brand"><span className="footer-mark"><Workflow size={13} /></span>FlowMind <span className="footer-separator">/</span> Open source</span><span className="footer-motto">Décris. Construis. Automatise.</span><a href="https://github.com/dartist-fr/FlowMind" target="_blank" rel="noreferrer">Explorer sur GitHub <ArrowRight size={13} /></a></footer>
        </div>
      </main>

      {(creating || editing) && <div className="modal-bg" onMouseDown={(event) => { if (event.target === event.currentTarget) { setCreating(false); setEditing(null); } }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-top"><span className="modal-icon"><Workflow size={20} /></span><button className="icon-btn" onClick={() => { setCreating(false); setEditing(null); }} aria-label="Fermer"><X size={18} /></button></div>
          <span className="modal-kicker">FLOWMIND STUDIO</span><h2 id="modal-title">{editing ? "Modifier le workflow" : "Une nouvelle idée ?"}</h2>
          <p>{editing ? "Modifie les informations et enregistre tes changements." : "Crée un workflow. Les étapes sont une configuration descriptive : elles ne lancent pas encore d’actions réelles."}</p>
          <label htmlFor="flow-name">{editing ? "Nom" : "Nom du workflow"}</label>
          <input id="flow-name" autoFocus value={editing ? editName : name} onChange={(event) => editing ? setEditName(event.target.value) : setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") editing ? saveEdit() : createFlow(); }} placeholder="Ex. Organiser mes notes" />
          {editing && <>
            <label htmlFor="flow-description">Description</label><textarea id="flow-description" value={editDescription} onChange={event => setEditDescription(event.target.value)} rows={3} />
            <label htmlFor="flow-steps">Nombre d’étapes (1–50)</label><input id="flow-steps" type="number" min="1" max="50" value={editSteps} onChange={event => setEditSteps(event.target.value)} />
            <label htmlFor="flow-status">Statut</label><select id="flow-status" value={editStatus} onChange={event => setEditStatus(event.target.value as Flow["status"])}><option value="Brouillon">Brouillon</option><option value="Actif">Actif (simulation disponible)</option></select>
          </>}
          <small className="modal-hint"><ShieldCheck size={14} />Sauvegardé localement sur cet appareil.</small>
          <div className="modal-actions"><button className="secondary" onClick={() => { setCreating(false); setEditing(null); }}>Annuler</button><button className="primary" disabled={!(editing ? editName.trim() : name.trim())} onClick={editing ? saveEdit : createFlow}>{editing ? <Check size={16} /> : <Plus size={16} />}{editing ? "Enregistrer" : "Créer le workflow"}</button></div>
        </section>
      </div>}
      {confirmDelete !== null && <div className="modal-bg"><section className="modal" role="alertdialog" aria-modal="true"><h2>Supprimer ce workflow ?</h2><p>Cette suppression est définitive sur cet appareil.</p><div className="modal-actions"><button className="secondary" onClick={() => setConfirmDelete(null)}>Annuler</button><button className="primary danger-primary" onClick={() => deleteFlow(confirmDelete)}>Supprimer</button></div></section></div>}
      {panel && <div className="modal-bg" onMouseDown={event => { if (event.target === event.currentTarget) setPanel(null); }}><section className="modal panel-modal" role="dialog" aria-modal="true" aria-labelledby="panel-title"><div className="modal-top"><span className="modal-icon"><Settings2 size={20} /></span><button className="icon-btn" onClick={() => setPanel(null)} aria-label="Fermer"><X size={18} /></button></div>
        {panel === "history" && <><span className="modal-kicker">JOURNAL LOCAL</span><h2 id="panel-title">Historique des tests</h2><p>Les simulations récentes sont enregistrées sur cet appareil. Elles ne correspondent pas à des exécutions réelles.</p>{history.length === 0 ? <div className="empty-state"><b>Aucun test pour le moment</b><p>Lance « Tester » sur un workflow pour ajouter une entrée ici.</p></div> : <div className="history-list">{history.map(item => <article className="history-entry" key={item.id}><b>{item.name}</b><small>{item.time}</small><p>{item.result}</p></article>)}</div>}<div className="modal-actions"><button className="secondary" onClick={() => { setHistory([]); notify("Historique effacé."); }}>Effacer l’historique</button><button className="primary" onClick={() => setPanel(null)}>Fermer</button></div></>}
        {panel === "settings" && <><span className="modal-kicker">PRÉFÉRENCES</span><h2 id="panel-title">Paramètres et données</h2><p>FlowMind fonctionne actuellement sans compte : les données restent dans le stockage local de ce navigateur.</p><div className="settings-summary"><p><b>{flows.length}</b> workflow(s) enregistré(s)</p><p><b>{history.length}</b> entrée(s) d’historique</p><p>Stockage : localStorage du navigateur</p></div><div className="modal-actions"><button className="secondary" onClick={() => { if (confirm("Effacer tous les workflows et l’historique de cet appareil ? Cette action est irréversible.")) { setFlows([]); setHistory([]); notify("Données locales effacées."); } }}>Effacer toutes les données</button><button className="primary" onClick={() => setPanel(null)}>Fermer</button></div></>}
        {panel === "ai" && <><span className="modal-kicker">ASSISTANT IA</span><h2 id="panel-title">Pas encore connecté</h2><p>L’assistant IA n’est pas implémenté dans cette version. Aucun modèle n’est appelé et aucune donnée n’est envoyée à un service externe.</p><p>Une future version pourra proposer un modèle local ou une intégration configurée par l’utilisateur.</p><div className="modal-actions"><button className="primary" onClick={() => setPanel(null)}>Compris</button></div></>}
        {panel === "integrations" && <><span className="modal-kicker">CONNECTEURS</span><h2 id="panel-title">Intégrations indisponibles</h2><p>Aucun service externe n’est actuellement connecté. Les workflows ne peuvent donc pas envoyer d’e-mails, modifier des fichiers ou déclencher d’actions dans d’autres applications.</p><p>Cette section sera activée quand des connecteurs réels et leurs autorisations seront développés.</p><div className="modal-actions"><button className="primary" onClick={() => setPanel(null)}>Compris</button></div></>}
      </section></div>}

      {notice && <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Fermer"><X size={15} /></button></div>}
    </div>
  );
}
