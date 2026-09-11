import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { demoDesign, weddingData } from "./demo-values";

const GardenOpening = lazy(() => import("../../../../../plantillas/boda_ANILLO_VERDE/source/src/components/EnvelopeIntro"));
const FlowerOpening = lazy(() => import("../../../../../plantillas/boda_PUERTAS_ROSA/source/src/components/EnvelopeIntro"));

const OpeningDemo = () => {
  const [entered, setEntered] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const Opening = demoDesign === "jardin" ? GardenOpening : FlowerOpening;

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.parent.postMessage({ type: "nupia:close-opening" }, window.location.origin);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  useEffect(() => {
    if (entered) { title.current?.focus({ preventScroll: true }); return; }
    const container = root.current;
    if (!container) return;
    let revealed = false;
    // The original openings hide the card visually; also keep hidden controls out of the tab order.
    const syncFocus = () => {
      const card = container.querySelector<HTMLElement>("article[aria-hidden]");
      if (!card) return;
      const hidden = card.getAttribute("aria-hidden") === "true";
      card.inert = hidden;
      container.querySelectorAll<HTMLButtonElement>("section > button").forEach(button => { button.inert = !hidden; });
      if (!hidden && !revealed) {
        revealed = true;
        card.tabIndex = -1;
        card.focus({ preventScroll: true });
      }
    };
    const observer = new MutationObserver(syncFocus);
    observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-hidden"] });
    syncFocus();
    return () => observer.disconnect();
  }, [entered]);

  return (
    <div ref={root}>
      {!entered ? <Suspense fallback={<p className="opening-loading" role="status">Preparando vuestra invitación…</p>}>
        <Opening onComplete={() => setEntered(true)} />
      </Suspense> : (
        <main className={`celebration-intro celebration-intro--${demoDesign}`}>
          <img src={`/images/${demoDesign === "jardin" ? "dinner" : "rose-dinner"}-editorial-demo.webp`} alt="Mesa de celebración con flores y velas" />
          <div className="celebration-intro__shade" aria-hidden="true" />
          <div className="celebration-intro__content">
            <p className="celebration-intro__eyebrow">BIENVENIDOS A NUESTRA BODA</p>
            <h1 ref={title} tabIndex={-1}>{weddingData.couple.partner1}<em>&amp;</em>{weddingData.couple.partner2}</h1>
            <div className="celebration-intro__details"><p>{weddingData.event.dateLabel}<br />{weddingData.event.venue} · {weddingData.event.city}</p><p>Nos vemos donde<br />empieza todo.</p></div>
          </div>
        </main>
      )}
    </div>
  );
};
export default OpeningDemo;
