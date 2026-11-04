import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { templateValues } from "@/config/template-values";
import { getAlbumPhotos } from "@/data/photo-album";
import { fetchApprovedMessages, LOVE_MESSAGES_UPDATED_EVENT, type MessageItem } from "@/lib/love-messages";
import "@/photo-pile.css";

const photos = getAlbumPhotos();
const offsets = [[0, 0, -1.2, 1], [-10.64, 16.68, 1.65, .978], [14, 31, -1.2, .954], [-16.3, 45.34, -1.85, .93], [14.28, 61.64, 1.65, .906], [-6.18, 75.82, 1.15, .882]];

export default function NightPhotoGallery() {
  const [current, setCurrent] = useState(0);
  const [drag, setDrag] = useState(0);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [fits, setFits] = useState<Record<string, boolean>>({});
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  useEffect(() => {
    if (!templateValues.sections.messages) return;
    let disposed = false;
    const refresh = () => { void fetchApprovedMessages().then(items => { if (!disposed) setMessages(items); }).catch(() => {}); };
    refresh();
    window.addEventListener(LOVE_MESSAGES_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { disposed = true; window.removeEventListener(LOVE_MESSAGES_UPDATED_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  if (!photos.length) return null;
  const move = (step: number) => { setDrag(0); setCurrent(value => (value + step + photos.length) % photos.length); };
  const visibleMessages = Array.from({ length: Math.min(4, messages.length) }, (_, index) => messages[(current * 2 + index) % messages.length]);
  const rail = (side: "left" | "right") => <aside className={`story-photo-pile__rail story-photo-pile__rail--${side}`} aria-label="Mensajes de nuestros invitados">
    {visibleMessages.filter((_, index) => index % 2 === (side === "left" ? 0 : 1)).map(message => <blockquote key={message.id} className={`story-photo-pile__cloud story-photo-pile__cloud--${side}`}>
      <div className="story-photo-pile__cloud-card"><p className="story-photo-pile__cloud-message">{message.message}</p><cite className="story-photo-pile__cloud-name">{message.name}</cite></div>
    </blockquote>)}
  </aside>;
  return <section className="az-album az-photo-pile" aria-labelledby="album-title">
    <div className="az-wrap az-pile-heading"><p className="az-kicker">Recuerdos de una vida juntos</p><h2 id="album-title" data-editor-key="album.title">{templateValues.album.title}</h2><p>Los viajes. Lo cotidiano. Y todo lo que nos queda.</p></div>
    <div className="story-photo-pile az-wrap"><div className="story-photo-pile__stage">
      {rail("left")}
      <div className="story-photo-pile__center" role="group" aria-roledescription="carrusel" aria-label="Recuerdos de Adrián y Gema" tabIndex={0} onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
      }}>
        <div className="story-photo-pile__container">
          {offsets.slice(0, photos.length).map(([x, y, rotation, scale], depth) => {
            const photo = photos[(current + depth) % photos.length];
            const contained = fits[photo.id] !== false;
            return <div key={photo.id} className={`story-photo-pile__img${depth === 0 ? " story-photo-pile__img--interactive" : ""}${depth === 0 && drag ? " story-photo-pile__img--dragging" : ""}`}
              aria-hidden={depth !== 0} style={{ zIndex: 12 - depth, transform: `translate(-50%, 0px) translate3d(${x + (depth === 0 ? drag : 0)}px, ${y}px, 0px) rotate(${rotation + (depth === 0 ? drag / 25 : 0)}deg) scale(${scale})`, transition: depth === 0 && drag ? "none" : undefined }}
              onPointerDown={depth === 0 ? event => { if (event.button !== 0) return; pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); } : undefined}
              onPointerMove={depth === 0 ? event => { if (pointer.current?.id === event.pointerId) setDrag(event.clientX - pointer.current.x); } : undefined}
              onPointerUp={depth === 0 ? event => { const start = pointer.current; pointer.current = null; setDrag(0); if (start?.id !== event.pointerId) return; const dx = event.clientX - start.x; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(event.clientY - start.y)) move(dx < 0 ? 1 : -1); } : undefined}
              onPointerCancel={() => { pointer.current = null; setDrag(0); }}>
              {contained && <div className="story-photo-pile__img-backdrop" aria-hidden="true"><img src={photo.src} alt="" className="story-photo-pile__img-backdrop-media" draggable={false}/><div className="story-photo-pile__img-backdrop-wash"/></div>}
              <img src={photo.src} alt={photo.alt} draggable={false} loading={depth === 0 ? "eager" : "lazy"} decoding="async" className={`story-photo-pile__media${contained ? " story-photo-pile__media--contained" : ""}`} style={{ objectFit: contained ? "contain" : "cover" }} onLoad={event => { const image = event.currentTarget; const ratio = image.naturalWidth / image.naturalHeight; const contain = Math.abs(ratio / (5 / 6) - 1) > .2; setFits(previous => previous[photo.id] === contain ? previous : { ...previous, [photo.id]: contain }); }}/>
            </div>;
          })}
        </div>
        <div className="story-photo-pile__controls"><button type="button" className="story-photo-pile__button" aria-label="Ver foto anterior" disabled={photos.length < 2} onClick={() => move(-1)}><ChevronLeft size={20}/></button><span className="az-pile-position" aria-live="polite" aria-atomic="true">{current + 1} / {photos.length}</span><button type="button" className="story-photo-pile__button" aria-label="Ver foto siguiente" disabled={photos.length < 2} onClick={() => move(1)}><ChevronRight size={20}/></button></div>
        {(photos[current].caption || photos[current].date) && <p className="az-pile-caption">{photos[current].caption}{photos[current].date && ` · ${photos[current].date}`}</p>}
      </div>
      {rail("right")}
    </div></div>
  </section>;
}
