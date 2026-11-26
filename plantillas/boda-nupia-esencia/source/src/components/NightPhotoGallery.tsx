import { templateValues as v } from "@/config/template-values";

export default function NightPhotoGallery() {
  return <section className="demo-album" aria-labelledby="demo-album-title">
    <div className="az-wrap demo-album__layout">
      <div className="demo-album__copy"><p className="az-kicker">Un instante para guardar</p><h2 id="demo-album-title">Lo que queda<br /><em>con nosotros.</em></h2><p>Un lugar, una mirada y todo lo que todavía está por venir.</p><span>{v.couple.partner1} &amp; {v.couple.partner2}</span></div>
      <figure className="demo-album__photo"><img src={v.images.galeria1} alt="Pareja caminando entre olivos" loading="lazy" /><figcaption>UNA HISTORIA POR CONTAR <span>01 / 01</span></figcaption></figure>
    </div>
  </section>;
}
