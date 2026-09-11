import { CalendarPlus } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";
import { downloadWeddingDate } from "@/lib/wedding-calendar";
export default function AboutInfo() {
  const countdown = useCountdown();
  return <section id="countdown" data-editor-component="countdown" className="az-countdown az-wrap">
    <div><p className="az-kicker">Hay días que se esperan así.</p><h2>El nuestro,<br/><em>cada vez más cerca.</em></h2><button className="az-text-button" onClick={downloadWeddingDate}><CalendarPlus size={17}/> Guardar la fecha</button></div>
    <div className="az-counters" aria-label="Tiempo que falta para la boda">{countdown.map(item=><div key={item.label}><strong>{String(item.value).padStart(2,"0")}</strong><span>{item.label === "Dias" ? "Días" : item.label === "Min" ? "Minutos" : item.label === "Seg" ? "Segundos" : item.label}</span></div>)}</div>
  </section>;
}
