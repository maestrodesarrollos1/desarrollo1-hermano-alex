const works = [
  {
    number: "03 / 05",
    title: "Jardin tras la cena",
    descriptor: "Un comienzo de terciopelo y luz baja.",
    image: "/images/jewel-case-editorial.png",
    alt: "Caja verde con lazo de seda y una flor blanca",
  },
  {
    number: "04 / 05",
    title: "La casa de las flores",
    descriptor: "Una entrada que se abre hacia una celebración luminosa.",
    image: "/images/rose-double-doors.png",
    alt: "Puertas rosas abiertas hacia una estancia con flores",
  },
] as const;

const Collection = () => (
  <section id="coleccion" className="collection" aria-labelledby="collection-title">
    <div className="collection__intro brand-shell">
      <p className="brand-index">03 / COLECCION</p>
      <h2 id="collection-title">No elegís una plantilla.<br /><em>Encontráis un tono.</em></h2>
      <p>Algunas bodas piden penumbra. Otras, una puerta abierta y flores. La página empieza por escuchar cuál es la vuestra.</p>
    </div>

    <div className="collection__works">
      {works.map((work) => (
        <article className="collection-work" key={work.title}>
          <img src={work.image} alt={work.alt} loading="lazy" decoding="async" />
          <div className="collection-work__wash" aria-hidden="true" />
          <div className="collection-work__meta">
            <span>{work.number}</span>
            <p>{work.descriptor}</p>
          </div>
          <h3>{work.title}</h3>
          <span className="collection-work__direction">VER DIRECCIÓN</span>
        </article>
      ))}
    </div>
  </section>
);

export default Collection;
