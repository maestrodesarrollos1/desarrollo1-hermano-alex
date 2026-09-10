import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, RotateCcw, X } from "lucide-react";
import { designs } from "../data/designs";
import OpeningPreview from "./OpeningPreview";

type Props = { onChoose: (design: string) => void };

const Collection = ({ onChoose }: Props) => {
  const [selected, setSelected] = useState(0);
  const [run, setRun] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const design = designs[selected];

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  const close = () => {
    dialog.current?.close();
    setIsOpen(false);
    openButton.current?.focus({ preventScroll: true });
  };
  const choose = () => {
    onChoose(design.title);
    close();
    requestAnimationFrame(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      document.getElementById("contact-names")?.focus({ preventScroll: true });
    });
  };

  return (
    <section id="coleccion" className="collection" aria-labelledby="collection-title">
      <div className="collection__intro brand-shell">
        <p className="brand-index">02 / LA COLECCIÓN NUPIA</p>
        <h2 id="collection-title">Imaginad vuestros<br /><em>nombres aquí.</em></h2>
        <p>Una misma mirada al detalle. Distintas maneras de invitar. Abrid cada diseño y descubrid cómo empieza la experiencia de vuestros invitados.</p>
      </div>
      <div className="collection-stage">
        <img key={design.id} className="collection-stage__image" src={design.image + "-1600.webp"} srcSet={design.image + "-800.webp 800w, " + design.image + "-1600.webp 1600w"} sizes="100vw" width={1672} height={941} alt={design.alt} loading="lazy" decoding="async" />
        <div className="collection-stage__shade" aria-hidden="true" />
        <div className="collection-stage__meta brand-shell"><span>ESTUDIO DE DISEÑO / {design.category}</span><span>0{selected + 1} / 02</span></div>
        <div className="collection-stage__content brand-shell">
          <div aria-live="polite"><h3>{design.title}</h3><p>{design.description}</p></div>
          <button ref={openButton} className="light-button" type="button" onClick={() => { setRun(0); setIsOpen(true); }}>Vivir la invitación <ArrowUpRight aria-hidden="true" /></button>
        </div>
      </div>
      <div className="collection-selector brand-shell" aria-label="Elegir diseño">
        {designs.map((item, index) => (
          <button type="button" key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <span>0{index + 1}</span><span>{item.title}<small>{item.category}</small></span><ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="collection__aside brand-shell">¿Tenéis otra idea en mente? <a href="#contacto">Contádnosla <ArrowUpRight aria-hidden="true" /></a></p>
      <dialog ref={dialog} className="design-dialog design-dialog--interactive" aria-labelledby="design-dialog-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        {isOpen && <div className="design-dialog__body">
          <div className="design-dialog__header">
            <div><p className="brand-index">NUPIA / UNA INVITACIÓN PARA ABRIR</p><h3 id="design-dialog-title">{design.title}</h3></div>
            <div className="design-dialog__actions">
              <button type="button" className="icon-button" onClick={() => setRun(current => current + 1)} aria-label="Repetir apertura" title="Repetir apertura"><RotateCcw aria-hidden="true" /></button>
              <button type="button" className="icon-button" onClick={close} aria-label="Cerrar diseño" title="Cerrar diseño"><X aria-hidden="true" /></button>
            </div>
          </div>
          <OpeningPreview design={design.id} title={design.title} run={run} onClose={close} />
          <div className="design-dialog__footer"><p>Apertura interactiva con contenido de ejemplo.<br />Vuestros nombres. Vuestra forma de celebrar.</p><button type="button" className="dark-button" onClick={choose}>Este estilo nos encaja <ArrowUpRight aria-hidden="true" /></button></div>
        </div>}
      </dialog>
    </section>
  );
};
export default Collection;
