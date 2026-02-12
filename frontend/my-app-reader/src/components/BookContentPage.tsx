import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


type Theme = "light" | "sepia" | "dark";

export default function BookContentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state as { id: number };

  const textUrl = `/api-gutenberg/cache/epub/${id}/pg${id}.txt`;


  const [theme, setTheme] = useState<Theme>("sepia");
  const [fontScale, setFontScale] = useState(1.0);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [font, setFont] = useState<"serif" | "sans">("serif");
  const [panelOpen, setPanelOpen] = useState(false);

  const [raw, setRaw] = useState<string>("");
  const [pages, setPages] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const readerRef = useRef<HTMLDivElement | null>(null);

  const cssVars = useMemo(() => {
    const themes = {
      light: { bg: "#f3f3f3", paper: "#ffffff", ink: "#222", muted: "rgba(0,0,0,.15)" },
      sepia: { bg: "#f6f1e6", paper: "#fbf7ef", ink: "#2b2b2b", muted: "rgba(0,0,0,.15)" },
      dark: { bg: "#121212", paper: "#1c1c1c", ink: "#eaeaea", muted: "rgba(255,255,255,.18)" }
    };

    const family =
      font === "sans"
        ? "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        : '"Georgia","Iowan Old Style","Palatino",serif';

    return {
      "--bg": themes[theme].bg,
      "--paper": themes[theme].paper,
      "--ink": themes[theme].ink,
      "--muted": themes[theme].muted,
      "--accent": "#f9efe2",
      "--fontFamily": family,
      "--fontSize": `${13 * fontScale}px`,
      "--lineHeight": String(lineHeight),
      
    } as React.CSSProperties;
  }, [theme, font, fontScale, lineHeight]);

  const goBack = () => {
    navigate(`/books/${id}`);
  };
  useEffect(() => {
    let cancelled = false;

    async function loadTxt() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(textUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();

        if (!cancelled) {
          setRaw(text.replace(/\r\n/g, "\n"));
          setPageIndex(0);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTxt();
    return () => {
      cancelled = true;
    };
  }, [textUrl]);

  useEffect(() => {
    if (!raw) return;

    const el = readerRef.current;
    if (!el) return;

    const paragraphs = raw
      .split(/\n{2,}/g)
      .map(p => p.trim())
      .filter(Boolean);

    const measure = document.createElement("div");
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.pointerEvents = "none";
    measure.style.left = "-99999px";
    measure.style.top = "0";
    measure.style.width = `${el.clientWidth}px`;
    measure.style.fontFamily = getComputedStyle(el).fontFamily;
    measure.style.fontSize = getComputedStyle(el).fontSize;
    measure.style.lineHeight = getComputedStyle(el).lineHeight;
    measure.style.whiteSpace = "pre-wrap";
    measure.style.wordBreak = "break-word";
    document.body.appendChild(measure);

    const maxHeight = el.clientHeight;
    const newPages: string[] = [];
    let current = "";

    const flush = () => {
      if (current.trim()) newPages.push(current.trim());
      current = "";
    };

    for (const p of paragraphs) {
      const candidate = current ? `${current}\n\n${p}` : p;
      measure.textContent = candidate;

      if (measure.scrollHeight <= maxHeight) {
        current = candidate;
        continue;
      }

      flush();

      measure.textContent = p;
      if (measure.scrollHeight <= maxHeight) {
        current = p;
        continue;
      }

      const sentences = p.split(/(?<=[.!?])\s+/g);
      let tmp = "";
      for (const s of sentences) {
        const cand2 = tmp ? `${tmp} ${s}` : s;
        measure.textContent = cand2;
        if (measure.scrollHeight <= maxHeight) {
          tmp = cand2;
        } else {
          if (tmp.trim()) newPages.push(tmp.trim());
          tmp = s;
        }
      }
      if (tmp.trim()) newPages.push(tmp.trim());
      current = "";
    }

    flush();
    document.body.removeChild(measure);

    setPages(newPages.length ? newPages : [raw]);
    setPageIndex(i => Math.min(i, Math.max(0, newPages.length - 1)));
  }, [raw, fontScale, lineHeight, font]);

  useEffect(() => {
    const onResize = () => {
      setFontScale(v => v);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const progress = pages.length ? Math.round(((pageIndex + 1) / pages.length) * 100) : 0;

  const prev = () => setPageIndex(i => Math.max(0, i - 1));
  const next = () => setPageIndex(i => Math.min(pages.length - 1, i + 1));
  const reset = () => {
    setTheme("sepia");
    setFont("serif");
    setFontScale(1.0);
    setLineHeight(1.7);
  };

  return (
    <div style={cssVars} className="br-root">
      <style>{styles}</style>

      <div className="br-shell">
        
        <button className="br-iconbtn" onClick={goBack} title="Retour">⟵</button>
        <div className="br-headerOutside">
          <div className="br-title">Contenu du livre</div>
          <div className="br-subtitle">Lecture</div>
        </div>
        <div className="br-topbar">
          <div className="br-actions">
            <button
              className="br-iconbtn br-settingsBtn"
              onClick={() => setPanelOpen(v => !v)}
              title="Paramètres"
            >
              ⚙︎
            </button>
          </div>
        </div>

        <div className="br-book">
          <div className="br-spread">
            {/* Page gauche */}
            <section className="br-page">

              <div className="br-progressRow">
                <div className="br-bar"><div className="br-barFill" style={{ width: `${progress}%` }} /></div>
                <div className="br-progressText">{progress}%</div>
              </div>

              <div className="br-reader" ref={readerRef}>
                {loading && <div className="br-info">Chargement…</div>}
                {err && <div className="br-error">Impossible de charger le TXT : {err}</div>}
                {!loading && !err && (
                   <div className="br-flipPage" key={pageIndex}>
                  <article className="br-content">
                    {pages[pageIndex] || ""}
                  </article>
                    </div>
                )}
              </div>

              <div className="br-navRow">
                <button className="br-navBtn" onClick={prev} disabled={pageIndex === 0}>
                  ← Page précédente
                </button>
                <button className="br-navBtn" onClick={next} disabled={pageIndex >= pages.length - 1}>
                  Page suivante →
                </button>
              </div>

              <div className="br-footer">
                <span>{pages.length ? `${pageIndex + 1} / ${pages.length}` : ""}</span>
              </div>
            </section>

            {/* Page droite : panneau “Paramètres” décor */}
            <section className="br-page br-right">
              <div className="br-reader">
                {!loading && !err && (
                  <article className="br-content">
                    {pages[pageIndex + 1] || ""}
                  </article>
                )}
              </div>
            </section>
          </div>

          {/* Panel paramètres (overlay) */}
          <div className={`br-panel ${panelOpen ? "open" : ""}`}>
            <h3>Paramètres</h3>

            <div className="br-grid">
              <div className="br-row">
                <div>Taille texte</div>
                <input
                  className="br-slider"
                  type="range"
                  min="0.85"
                  max="1.4"
                  step="0.01"
                  value={fontScale}
                  onChange={(e) => setFontScale(Number(e.target.value))}
                />
              </div>

              <div className="br-row">
                <div>Hauteur</div>
                <input
                  className="br-slider"
                  type="range"
                  min="1.2"
                  max="2.2"
                  step="0.05"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                />
              </div>

              <div className="br-row">
                <div>Police</div>
                <div className="br-seg">
                  <button className={`br-chip ${font === "serif" ? "active" : ""}`} onClick={() => setFont("serif")}>Serif</button>
                  <button className={`br-chip ${font === "sans" ? "active" : ""}`} onClick={() => setFont("sans")}>Sans</button>
                </div>
              </div>

              <div className="br-row">
                <div>Thème</div>
                <div className="br-seg">
                  <button className={`br-chip ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>Clair</button>
                  <button className={`br-chip ${theme === "sepia" ? "active" : ""}`} onClick={() => setTheme("sepia")}>Sépia</button>
                  <button className={`br-chip ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>Sombre</button>
                </div>
              </div>

              <div className="br-row">
                <button className="br-chip" onClick={reset}>Réinitialiser</button>
                <button className="br-chip" onClick={() => setPanelOpen(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
.br-root{
  min-height:100vh;
  background: radial-gradient(circle at top, #1e293b, #0f172a);
  display:flex; justify-content:center; align-items:center;
  padding:24px; box-sizing:border-box;
  color: var(--ink);
}
.br-settingsBtn{
  position: fixed;
  right: 50px;
  top: 20px;
  z-index: 1000;
}
.br-shell{
  width:1150px;height:1000px; display:flex; flex-direction:column; }
.br-topbar{ display:flex; justify-content:space-between; align-items:center; padding: 6px 4px 12px; }
.br-crumb{ opacity:.7; font-size:14px; }
.br-actions{ display:flex; gap:10px; }
.br-iconbtn{
  width:36px;height:36px;border-radius:999px;
   border: 1px solid #ffffff;
  background: transparent;
  color: #ffffff;
  cursor:pointer;
}

.br-book{
  flex:1;
  background: #1e293b;
  border-radius:18px;
  padding:18px;
  overflow:hidden;
  position:relative;
}
  .br-headerOutside .br-title,
.br-headerOutside .br-subtitle {
  color: #ffffff;
}

.br-spread{
  height:100%;
  background: var(--paper);
  border-radius:14px;
  box-shadow: 0 18px 45px rgba(0,0,0,.12);
  display:grid;
  grid-template-columns: 1fr 1fr;
  overflow:hidden;
  position:relative;
}
.br-spread:before{
  content:"";
  position:absolute;left:50%;top:0;width:20px;height:100%;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,.18), transparent);
  opacity:.35; transform:translateX(-1px);
  pointer-events:none;
}

.br-page{ position:relative; padding:26px 26px 80px; box-sizing:border-box; display:flex; flex-direction:column; gap:10px; }
.br-title{ font-family: var(--fontFamily); font-size:26px; }
.br-subtitle{ font-family: var(--fontFamily); font-size:34px; margin-top:-6px; }
.br-page{
  position: relative;
}
.br-progressRow{ display:flex; align-items:center; gap:10px; font-size:14px; opacity:.85; }
.br-bar{ flex:1; height:6px; border-radius:999px; background: rgba(0,0,0,.12); overflow:hidden; }
.br-barFill{ height:100%; background: var(--accent); width:0%; }
.br-progressText{ min-width:42px; text-align:right; }

.br-reader{
  border:1px solid var(--muted);
  border-radius:14px;
  overflow:hidden;
  padding:18px;
  flex:1;
  background: transparent;
}

.br-content{
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--fontFamily);
  font-size: var(--fontSize);
  line-height: var(--lineHeight);
  color: var(--ink);
}

.br-navRow{
  position:absolute; left:0; right:0; bottom:14px;
  display:flex; justify-content:space-between; padding:0 26px; gap:720px;
}
.br-navBtn{
  border:1px solid var(--muted);
  background: rgba(255,255,255,.55);
  color: var(--ink);
  border-radius:999px;
  padding:12px 16px;
  cursor:pointer;
  min-width:180px;
}
.br-navBtn:disabled{ opacity:.5; cursor:not-allowed; }

.br-footer{
  position:absolute;
  bottom: 56px;
  left: 26px;
  opacity:.6;
  font-size:13px;
}

.br-rightTitle{ font-family: var(--fontFamily); font-size:26px; opacity:.9; }
.br-rightHint{ opacity:.65; margin-top:10px; font-size:16px; font-family: var(--fontFamily); }
.br-right{ padding-top: 64px; }

.br-panel{
  position:absolute;
  right:18px; bottom:18px;
  width:min(420px, 92%);
  background: rgba(20,20,20,.75);
  color:#f5f5f5;
  border:1px solid rgba(255,255,255,.12);
  border-radius:18px;
  box-shadow: 0 22px 60px rgba(0,0,0,.35);
  padding:14px;
  backdrop-filter: blur(14px);
  display:none;
  margin-bottom: 550px;
  margin-right: 50px;
}
.br-panel.open{ display:block; }
.br-panel h3{ margin:0 0 12px; font-size:16px; font-weight:600; opacity:.95; }
.br-grid{ display:grid; grid-template-columns:1fr; gap:12px; }
.br-row{ display:flex; align-items:center; justify-content:space-between; gap:12px; font-size:14px; }
.br-seg{ display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
.br-chip{
  padding:8px 10px; border-radius:999px;
  border:1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.08);
  color:#fff; cursor:pointer; font-size:13px;
}
.br-chip.active{
  background: rgb(79 70 229 / var(--tw-bg-opacity, 1));
  border-color: rgb(79 70 229 / var(--tw-bg-opacity, 1));
}
.br-slider{ width:220px; }
.br-info{ opacity:.7; }
.br-error{ color:#b00020; background: rgba(176,0,32,.08); padding:12px; border-radius:12px; }

@media (max-width: 900px){
  .br-spread{ grid-template-columns: 1fr; }
  .br-spread:before{ display:none; }
  .br-right{ display:none; }
}
  .br-navRow{
  z-index: 10;
}
  .br-flipPage {
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 0.6s ease, opacity 0.6s ease;
  backface-visibility: hidden;
  position: relative;
}

.br-flipPage.enter {
  transform: rotateY(-180deg);
  opacity: 0;
}

.br-flipPage.enter-active {
  transform: rotateY(0deg);
  opacity: 1;
}

.br-flipPage.exit {
  transform: rotateY(0deg);
  opacity: 1;
}

.br-flipPage.exit-active {
  transform: rotateY(180deg);
  opacity: 0;
}
`;
