import { useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, X } from "lucide-react";
import { archiveModels, templateArchive } from "../data/templateArchive";

const TemplateArchive = () => {
  const [openTemplate, setOpenTemplate] = useState<string | null>(null);

  return (
  <main className="template-archive" id="contenido">
    <header className="archive-header">
      <a className="archive-back" href="/" aria-label="Volver a la pagina principal de Nupia">
        <ArrowLeft aria-hidden="true" /> Nupia
      </a>
      <p>COLECCIÓN NUPIA / DISEÑOS DE BODA</p>
    </header>

    <section className="archive-intro" aria-labelledby="archive-title">
      <p className="brand-index">DISEÑOS PARA EMPEZAR</p>
      <h1 id="archive-title">Una invitación<br />puede <em>decir mucho</em><br />antes de abrirse.</h1>
      <p>Elegid la atmósfera que se parezca a vosotros. Después, decidiremos juntos cuánto queréis contar dentro de ella.</p>
    </section>

    <section className="archive-grid" aria-label="Plantillas disponibles">
      {templateArchive.map((template) => (
        <article className={`archive-card archive-card--${template.tone}`} data-design={template.id} key={template.id}>
          <div className="archive-card__image">
            <img src={template.image} alt={template.alt} loading="lazy" />
            <span className="archive-card__number">{template.number}</span>
            <p className="archive-card__caption">NUPIA / {template.direction}</p>
          </div>
          <div className="archive-card__copy">
            <p className="brand-index">{template.direction}</p>
            <h2>{template.title}</h2>
            <p>{template.note}</p>
            <button
              className="archive-card__models-trigger"
              type="button"
              aria-expanded={openTemplate === template.id}
              aria-controls={`models-${template.id}`}
              onClick={() => setOpenTemplate((current) => current === template.id ? null : template.id)}
            >
              {openTemplate === template.id ? "Cerrar opciones" : "Ver esta invitación"}
              {openTemplate === template.id ? <X aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
            </button>
            {openTemplate === template.id ? (
              <div className="archive-models" id={`models-${template.id}`}>
                <p className="archive-models__intro">Tres maneras de hacerla vuestra. El diseño se mantiene; la historia crece.</p>
                {archiveModels.map((model) => (
                  <a
                    key={model.id}
                    href={`${template.previewUrl}?modelo=${model.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="archive-model"
                  >
                    <span className="archive-model__meta"><strong>{model.name}</strong><small>{model.price}</small></span>
                    <span>{model.description}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  </main>
  );
};

export default TemplateArchive;
