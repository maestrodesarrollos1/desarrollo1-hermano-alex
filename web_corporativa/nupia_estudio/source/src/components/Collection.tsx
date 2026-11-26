import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { designs } from "../data/designs";

type Props = { onChoose: (design: string) => void };

const Collection = ({ onChoose }: Props) => {
  const [selected, setSelected] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const design = designs[selected];

  useEffect(() => {
    if (!isPreviewOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isPreviewOpen]);

  const closePreview = () => {
    dialog.current?.close();
    setIsPreviewOpen(false);
    previewButton.current?.focus({ preventScroll: true });
  };

  const choose = () => {
    onChoose(design.title);
    requestAnimationFrame(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      document.getElementById("contact-names")?.focus({ preventScroll: true });
    });
  };

  return (
    <section id="coleccion" className="collection" aria-labelledby="collection-title">
      <div className="collection__intro brand-shell">
        <p className="brand-index">02 / LA COLECCIÓN NUPIA</p>
        <h2 id="collection-title">Elegid la experiencia<br /><em>que queréis abrir.</em></h2>
        <p>Tres maneras de dar forma a vuestra invitación. Descubrid una boda de ejemplo y explorad cada nivel a vuestro ritmo.</p>
      </div>
      <div className="collection-stage">
        <img key={design.id} className="collection-stage__image" src={design.image + "-1600.webp"} srcSet={design.image + "-800.webp 800w, " + design.image + "-1600.webp 1600w"} sizes="100vw" width={1672} height={941} alt={design.alt} loading="lazy" decoding="async" />
        <div className="collection-stage__shade" aria-hidden="true" />
        <div className="collection-stage__meta brand-shell"><span>ESTUDIO DE DISEÑO / {design.category}</span><span>0{selected + 1} / 03</span></div>
        <div className="collection-stage__content brand-shell">
          <div aria-live="polite"><h3>{design.title}</h3><p>{design.description}</p><p className="collection-stage__price">{design.price}</p></div>
          <button ref={previewButton} className="light-button" type="button" onClick={() => setIsPreviewOpen(true)}>Abrir ejemplo completo <ArrowUpRight aria-hidden="true" /></button>
        </div>
      </div>
      <div className="collection-selector brand-shell" aria-label="Elegir ejemplo">
        {designs.map((item, index) => (
          <button type="button" key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <span>0{index + 1}</span><span>{item.title}<small>{item.category}</small></span><ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="collection__aside brand-shell"><span>{design.detail}</span><button type="button" className="text-link" onClick={choose}>Este nivel nos encaja <ArrowUpRight aria-hidden="true" /></button></div>
      <dialog ref={dialog} className="design-dialog design-dialog--example" aria-labelledby="example-title" onCancel={(event) => { event.preventDefault(); closePreview(); }} onClick={(event) => { if (event.target === event.currentTarget) closePreview(); }}>
        {isPreviewOpen && <div className="design-dialog__body">
          <div className="design-dialog__header">
            <div><p className="brand-index">NUPIA / EJEMPLO COMPLETO</p><h3 id="example-title">{design.title}</h3></div>
            <button type="button" className="icon-button" onClick={closePreview} aria-label="Cerrar ejemplo" title="Cerrar ejemplo"><X aria-hidden="true" /></button>
          </div>
          <div className="example-preview"><iframe src={design.previewUrl} title={`Ejemplo completo ${design.title}`} /></div>
          <div className="design-dialog__footer"><p><strong>{design.price}</strong><br />{design.detail}</p><button type="button" className="dark-button" onClick={() => { closePreview(); choose(); }}>Este nivel nos encaja <ArrowUpRight aria-hidden="true" /></button></div>
        </div>}
      </dialog>
    </section>
  );
};

export default Collection;
