import { ArrowUp } from "lucide-react";
import { templateValues as v } from "@/config/template-values";
export default function Footer() {
  return <footer className="az-footer" data-editor-component="footer">
    <div className="az-closing-photo"><img src={v.images.despedida} alt="Adrián y Gema abrazados junto al mar" loading="lazy" width="1200" height="1600"/><div><p className="az-kicker">Lo siguiente, con vosotros.</p><p className="az-closing-title">Nos vemos<br/><em>en nuestra boda.</em></p></div></div>
    <div className="az-footer-bottom az-wrap"><p>{v.couple.partner1} <em>&amp;</em> {v.couple.partner2}</p><span>{v.event.dateLabel}</span><a className="az-icon" href="#hero" aria-label="Volver arriba" title="Volver arriba"><ArrowUp/></a></div>
  </footer>;
}
