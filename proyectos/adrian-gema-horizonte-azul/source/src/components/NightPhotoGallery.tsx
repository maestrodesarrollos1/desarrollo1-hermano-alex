import { useEffect, useRef, useState } from "react";
import type { PageFlip } from "page-flip";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { templateValues } from "@/config/template-values";
import { getAlbumPhotos, type AlbumPhoto } from "@/data/photo-album";
import "@/notebook.css";

const photos = getAlbumPhotos();

function createSheet(photo: AlbumPhoto, index: number) {
  const page = document.createElement("div");
  page.className = "nb-page";
  const content = document.createElement("figure");
  content.className = "nb-page-content";
  const header = document.createElement("span");
  header.className = "nb-page-heading";
  header.textContent = "Adrián & Gema";
  const mount = document.createElement("div");
  mount.className = "nb-photo-mount";
  const image = document.createElement("img");
  image.alt = photo.alt;
  image.draggable = false;
  image.decoding = "async";
  image.dataset.src = photo.src;
  mount.append(image);
  const caption = document.createElement("figcaption");
  const title = document.createElement("span");
  title.textContent = photo.caption;
  const date = document.createElement("small");
  date.textContent = photo.date;
  caption.append(title, date);
  const number = document.createElement("span");
  number.className = "nb-page-number";
  number.textContent = String(index + 1).padStart(2, "0");
  content.append(header, mount, caption, number);
  page.append(content);
  return page;
}

export default function NightPhotoGallery() {
  const host = useRef<HTMLDivElement>(null);
  const bookRef = useRef<PageFlip | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [turning, setTurning] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const parent = host.current;
    if (!parent || !photos.length) return;
    let disposed = false;
    let instance: PageFlip | null = null;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => { reducedMotion.current = media.matches; };
    motionChanged();
    media.addEventListener("change", motionChanged);
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      try {
        const { PageFlip } = await import("page-flip");
        if (disposed) return;
        // The library owns this subtree, including its cloned sheets on narrow screens.
        const element = document.createElement("div");
        element.className = "nb-engine";
        parent.append(element);
        const sheets = photos.map(createSheet);
        sheets.forEach(sheet => element.append(sheet));
        instance = new PageFlip(element, {
          width: 430, height: 565, size: "stretch",
          minWidth: 270, maxWidth: 470, minHeight: 355, maxHeight: 618,
          showCover: false, usePortrait: true, autoSize: true,
          drawShadow: true, maxShadowOpacity: 0.22, flippingTime: 850,
          mobileScrollSupport: false, showPageCorners: false,
          disableFlipByClick: true, swipeDistance: 35,
          useMouseEvents: !media.matches,
        });
        bookRef.current = instance;
        const sync = () => {
          if (disposed || !instance) return;
          const index = instance.getCurrentPageIndex();
          setCurrent(index);
          setPortrait(instance.getOrientation() === "portrait");
          // Fetch the current spread and its neighbours before the next turn.
          sheets.slice(Math.max(0, index - 2), index + 5).forEach(sheet => {
            const img = sheet.querySelector("img");
            if (img && !img.getAttribute("src")) img.src = img.dataset.src!;
          });
        };
        instance.on("init", () => { sync(); if (!disposed) setReady(true); });
        instance.on("flip", sync);
        instance.on("changeOrientation", sync);
        instance.on("changeState", event => { if (!disposed) setTurning(event.data !== "read"); });
        instance.loadFromHTML(sheets);
      } catch {
        if (!disposed) setFailed(true);
      }
    }, { rootMargin: "350px" });
    observer.observe(parent);
    return () => {
      disposed = true;
      observer.disconnect();
      media.removeEventListener("change", motionChanged);
      instance?.destroy();
      bookRef.current = null;
      parent.replaceChildren();
    };
  }, []);

  const lastVisible = Math.min(current + (portrait ? 0 : 1), photos.length - 1);
  const next = (direction: -1 | 1) => {
    const book = bookRef.current;
    if (!book || turning) return;
    if (direction < 0 && current === 0) return;
    if (direction > 0 && lastVisible >= photos.length - 1) return;
    if (reducedMotion.current) {
      if (direction > 0) book.turnToNextPage(); else book.turnToPrevPage();
    } else {
      if (direction > 0) book.flipNext("bottom"); else book.flipPrev("bottom");
    }
  };
  const visible = photos.slice(current, lastVisible + 1);
  const movePhoto = (step: number) => setLightbox(index => index === null ? null : (index + step + photos.length) % photos.length);
  if (!photos.length) return null;

  return <section className="az-album nb-section" aria-labelledby="album-title">
    <div className="az-wrap nb-heading">
      <p className="az-kicker">Recuerdos de una vida juntos</p>
      <h2 id="album-title" data-editor-key="album.title">{templateValues.album.title}</h2>
      <p>Los viajes. Lo cotidiano. Y todo lo que nos queda.</p>
    </div>
    {failed ? <div className="az-wrap nb-fallback">{photos.map((photo, index) => <figure key={photo.id}>
      <img src={photo.src} alt={photo.alt} loading="lazy"/><figcaption>{photo.caption}{photo.date && ` · ${photo.date}`}</figcaption>
      <button className="az-text-button" onClick={event => { opener.current = event.currentTarget; setLightbox(index); }}><Expand size={16}/> Ampliar foto</button>
    </figure>)}</div> : <>
      <div className="nb-stage az-wrap">
        <div className="nb-cover" role="group" aria-label="Libreta de recuerdos" aria-describedby="nb-position" tabIndex={0}
          onKeyDown={event => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              next(event.key === "ArrowRight" ? 1 : -1);
            }
          }}>
          <div className="nb-host" ref={host} aria-hidden="true"/>
          {!ready && <span className="nb-loading" role="status">Abriendo los recuerdos…</span>}
        </div>
      </div>
      <div className="az-wrap nb-controls">
        <button className="az-icon" disabled={!ready || current === 0 || turning} onClick={() => next(-1)} aria-label="Página anterior" title="Página anterior"><ArrowLeft/></button>
        <p id="nb-position" aria-live="polite" aria-atomic="true">
          {ready ? `Recuerdo ${String(current + 1).padStart(2, "0")}${lastVisible !== current ? ` / ${String(lastVisible + 1).padStart(2, "0")}` : ""} de ${photos.length}` : "Nuestro álbum"}
        </p>
        <button className="az-icon" disabled={!ready || lastVisible >= photos.length - 1 || turning} onClick={() => next(1)} aria-label="Página siguiente" title="Página siguiente"><ArrowRight/></button>
      </div>
      <div className="az-wrap nb-enlarge">{ready && visible.map((photo, offset) => <button key={photo.id} className="az-text-button"
        onClick={event => { opener.current = event.currentTarget; setLightbox(current + offset); }}
        aria-label={`Ampliar foto: ${photo.caption}`} title={`Ver completa: ${photo.caption}`}>
        <Expand size={15}/><span>{photo.caption}</span>
      </button>)}</div>
    </>}
    <Dialog.Root open={lightbox !== null} onOpenChange={open => { if (!open) setLightbox(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="az-lightbox-overlay"/>
        <Dialog.Content className="az-lightbox" aria-describedby={undefined}
          onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }}
          onKeyDown={event => { if (event.key === "ArrowLeft") movePhoto(-1); if (event.key === "ArrowRight") movePhoto(1); }}>
          <Dialog.Title className="sr-only">Álbum de Adrián y Gema</Dialog.Title>
          <Dialog.Close className="az-icon az-lightbox-close" aria-label="Cerrar fotografía" title="Cerrar fotografía"><X/></Dialog.Close>
          {lightbox !== null && <img src={photos[lightbox].src} alt={photos[lightbox].alt}/>}
          <div className="az-lightbox-controls">
            <button className="az-icon" onClick={() => movePhoto(-1)} aria-label="Foto anterior"><ArrowLeft/></button>
            <span aria-live="polite">{lightbox !== null ? photos[lightbox].caption : ""}</span>
            <button className="az-icon" onClick={() => movePhoto(1)} aria-label="Foto siguiente"><ArrowRight/></button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </section>;
}
