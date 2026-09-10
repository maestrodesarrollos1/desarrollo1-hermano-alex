import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { templateValues as v } from "@/config/template-values";
const photos = [
  [v.images.galeria1,"Con el mar de fondo","Adrián y Gema junto a la playa"],
  [v.images.galeria2,"En cualquier lugar","La pareja frente al Coliseo"],
  [v.images.galeria3,"Tú, siempre","Un beso junto al mar"],
  [v.images.galeria4,"Los tres","Adrián y Gema con Nala en Navidad"],
  [v.images.galeria5,"El próximo destino","Juntos durante un viaje"],
  [v.images.galeria6,"Sin prisa","Adrián y Gema junto a un canal"],
  [v.images.galeria7,"Otra aventura","La pareja durante una excursión"],
  [v.images.galeria8,"Nuestra compañía","Juntos con Nala en la montaña"],
  [v.images.galeria9,"Una parada más","La pareja junto a una cabina roja"],
  [v.images.galeria10,"A la misma orilla","Adrián y Gema en kayak"],
  [v.images.galeria11,"De celebración","Adrián y Gema vestidos para una celebración"],
  [v.images.galeria12,"Todo lo que viene","La pareja en un paisaje de montaña"],
].filter(([src])=>!!src);
export default function NightPhotoGallery() {
  const [ref,api]=useEmblaCarousel({align:"start",loop:false,skipSnaps:false});
  const [selected,setSelected]=useState(0);
  const [canNext,setCanNext]=useState(true);
  const [canPrevious,setCanPrevious]=useState(false);
  const [lightbox,setLightbox]=useState<number|null>(null);
  const opener=useRef<HTMLButtonElement|null>(null);
  const sync=useCallback(()=>{if(api){setSelected(api.selectedScrollSnap());setCanNext(api.canScrollNext());setCanPrevious(api.canScrollPrev());}},[api]);
  useEffect(()=>{if(!api)return;sync();api.on("select",sync);api.on("reInit",sync);return()=>{api.off("select",sync);api.off("reInit",sync);};},[api,sync]);
  const move=(delta:number)=>setLightbox(current=>current===null?null:(current+delta+photos.length)%photos.length);
  return <section className="az-album" aria-labelledby="album-title">
    <div className="az-wrap az-section-heading"><div><p className="az-kicker">Nuestro álbum</p><h2 id="album-title">Un montón de <em>nosotros.</em></h2></div>
      <div className="az-album-controls"><span>{String(selected+1).padStart(2,"0")} / {photos.length}</span><button className="az-icon" disabled={!canPrevious} onClick={()=>api?.scrollPrev()} aria-label="Fotos anteriores" title="Fotos anteriores"><ArrowLeft/></button><button className="az-icon" disabled={!canNext} onClick={()=>api?.scrollNext()} aria-label="Más fotos" title="Más fotos"><ArrowRight/></button></div>
    </div>
    <div className="az-album-viewport" ref={ref}><div className="az-album-track">
      {photos.map(([src,caption,alt],i)=><figure className="az-album-photo" key={src}>
        <button onClick={event=>{opener.current=event.currentTarget;setLightbox(i);}} aria-label={`Ampliar foto: ${caption}`}>
          <img src={src} srcSet={src.startsWith("/images/pareja/") ? `${src.replace(".webp","-small.webp")} 640w, ${src} 1200w` : undefined} sizes="(max-width: 600px) 80vw, 320px" alt={alt} loading="lazy" width="640" height="800"/><span className="az-photo-expand"><Expand size={18}/></span>
        </button>
        <figcaption><span>{caption}</span><span>{String(i+1).padStart(2,"0")}</span></figcaption>
      </figure>)}
    </div></div>
    <Dialog.Root open={lightbox!==null} onOpenChange={open=>{if(!open)setLightbox(null);}}>
      <Dialog.Portal><Dialog.Overlay className="az-lightbox-overlay"/><Dialog.Content className="az-lightbox" aria-describedby={undefined} onCloseAutoFocus={e=>{e.preventDefault();opener.current?.focus();}} onKeyDown={e=>{if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1);}}>
        <Dialog.Title className="sr-only">Álbum de Adrián y Gema</Dialog.Title>
        <Dialog.Close className="az-icon az-lightbox-close" aria-label="Cerrar fotografía" title="Cerrar fotografía"><X/></Dialog.Close>
        {lightbox!==null && <img src={photos[lightbox][0]} alt={photos[lightbox][2]}/>}
        <div className="az-lightbox-controls"><button className="az-icon" onClick={()=>move(-1)} aria-label="Foto anterior"><ArrowLeft/></button><span aria-live="polite">{lightbox!==null ? photos[lightbox][1] : ""}</span><button className="az-icon" onClick={()=>move(1)} aria-label="Foto siguiente"><ArrowRight/></button></div>
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
  </section>;
}
