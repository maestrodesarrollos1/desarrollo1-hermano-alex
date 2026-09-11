import { useEffect, useRef, useState } from "react";
import type { PageFlip } from "page-flip";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { templateValues } from "@/config/template-values";
import { getAlbumPhotos, type AlbumPhoto } from "@/data/photo-album";
import { fetchApprovedMessages, type MessageItem } from "@/lib/love-messages";
import "@/notebook.css";

const photos = getAlbumPhotos();

const noteColors = ["yellow", "pink", "blue"];
const notePositions = ["top-left", "top-right", "bottom-left"];

function distributeNotes(messages: MessageItem[]) {
  const pages = Array.from({ length: photos.length }, () => [] as MessageItem[]);
  const shuffled = [...messages].sort(() => Math.random() - .5);
  const count = Math.ceil(Math.random() * Math.min(shuffled.length, photos.length * 3));
  shuffled.slice(0, count).forEach((message, index) => {
    const available = pages.map((notes, page) => notes.length < 3 ? page : -1).filter(page => page >= 0);
    const page = available[Math.floor(Math.random() * available.length)];
    pages[page].push(message);
  });
  return pages;
}

function createSheet(photo: AlbumPhoto, index: number, notes: MessageItem[]) {
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
  image.loading = "lazy";
  image.dataset.src = photo.src;
  // The pins make each print feel placed on the page rather than painted into it.
  const pinLeft = document.createElement("i");
  pinLeft.className = "nb-pushpin nb-pushpin--left";
  pinLeft.setAttribute("aria-hidden", "true");
  const pinRight = document.createElement("i");
  pinRight.className = "nb-pushpin nb-pushpin--right";
  pinRight.setAttribute("aria-hidden", "true");
  notes.forEach((message, noteIndex) => {
    const note = document.createElement("aside");
    note.className = `nb-postit nb-postit--${noteColors[(index + noteIndex) % noteColors.length]} nb-postit--${notePositions[noteIndex]}`;
    const text = document.createElement("span");
    text.textContent = message.message;
    const author = document.createElement("small");
    author.textContent = `— ${message.name}`;
    note.append(text, author);
    mount.append(note);
  });
  mount.prepend(image, pinLeft, pinRight);
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
  const [inView, setInView] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reducedMotion = useRef(false);
  const queuedDirection = useRef<-1 | 1 | null>(null);
  const isTurning = useRef(false);

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
        // Only messages approved in /moderation can become notes in the book.
        const approvedMessages = await fetchApprovedMessages();
        if (disposed) return;
        const pageNotes = distributeNotes(approvedMessages);
        const sheets = photos.map((photo, index) => createSheet(photo, index, pageNotes[index]));
        sheets.forEach(sheet => element.append(sheet));
        instance = new PageFlip(element, {
          width: 430, height: 565, size: "stretch",
          minWidth: 270, maxWidth: 470, minHeight: 355, maxHeight: 618,
          showCover: false, usePortrait: true, autoSize: true,
          drawShadow: true, maxShadowOpacity: 0.42, flippingTime: 1120,
          mobileScrollSupport: false, showPageCorners: true,
          disableFlipByClick: true, swipeDistance: 28,
          useMouseEvents: !media.matches,
        });
        bookRef.current = instance;
        const smoothCornerReturn = () => {
          const controllableBook = instance as PageFlip & {
            getState: () => string;
            getFlipController: () => { stopMove: () => void };
          };
          if (controllableBook.getState() === "fold_corner") controllableBook.getFlipController().stopMove();
        };
        element.addEventListener("mouseleave", smoothCornerReturn);
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
        instance.on("changeState", event => {
          if (disposed) return;
          const isReading = event.data === "read";
          isTurning.current = !isReading;
          setTurning(!isReading);
          if (isReading && queuedDirection.current !== null) {
            const direction = queuedDirection.current;
            queuedDirection.current = null;
            window.requestAnimationFrame(() => {
              if (disposed || !instance) return;
              if (direction > 0) instance.flipNext("bottom"); else instance.flipPrev("bottom");
            });
          }
        });
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

  useEffect(() => {
    const target = host.current;
    if (!target) return;
    const observer = new IntersectionObserver(entries => {
      setInView(entries[0]?.isIntersecting ?? false);
    }, { threshold: .22 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Let the closed front board paint first.  Opening before PageFlip has
    // mounted its spread makes the cover appear to be rendered over the photos.
    if (!inView) {
      setBookOpen(false);
      return;
    }
    if (!ready || bookOpen) return;
    let timer = 0;
    const frame = window.requestAnimationFrame(() => {
      timer = window.setTimeout(() => setBookOpen(true), 420);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [ready, inView, bookOpen]);

  const lastVisible = Math.min(current + (portrait ? 0 : 1), photos.length - 1);
  const next = (direction: -1 | 1) => {
    const book = bookRef.current;
    if (!book) return;
    if (direction < 0 && current === 0) return;
    if (direction > 0 && lastVisible >= photos.length - 1) return;
    if (isTurning.current) {
      queuedDirection.current = direction;
      return;
    }
    if (reducedMotion.current) {
      if (direction > 0) book.turnToNextPage(); else book.turnToPrevPage();
      return;
    }
    if (direction > 0) book.flipNext("bottom"); else book.flipPrev("bottom");
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
        <div className={`nb-cover${turning ? " is-turning" : ""}${ready ? " is-ready" : ""}${bookOpen ? " is-open" : ""}`} role="group" aria-label="Libreta de recuerdos" aria-describedby="nb-position" tabIndex={0}
          onKeyDown={event => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              next(event.key === "ArrowRight" ? 1 : -1);
            }
          }}>
          <div className="nb-host" ref={host} aria-hidden="true"/>
          <div className="nb-book-lid" aria-hidden="true">
            <i/>
            <b><span>{templateValues.couple.partner1} <em>&amp;</em> {templateValues.couple.partner2}</span><small>Nuestro álbum</small></b>
          </div>
          {!ready && <span className="nb-loading" role="status">Abriendo los recuerdos…</span>}
        </div>
      </div>
      <div className="az-wrap nb-controls">
        <button className="az-icon" disabled={!ready || current === 0} onClick={() => next(-1)} aria-label="Página anterior" title="Página anterior"><ArrowLeft/></button>
        <div className="nb-position">
          <p id="nb-position" aria-live="polite" aria-atomic="true">
            {ready ? `Recuerdo ${String(current + 1).padStart(2, "0")}${lastVisible !== current ? ` / ${String(lastVisible + 1).padStart(2, "0")}` : ""} de ${photos.length}` : "Nuestro álbum"}
          </p>
          <span className="nb-progress" aria-hidden="true"><i style={{ width: `${((lastVisible + 1) / photos.length) * 100}%` }}/></span>
        </div>
        <button className="az-icon" disabled={!ready || lastVisible >= photos.length - 1} onClick={() => next(1)} aria-label="Página siguiente" title="Página siguiente"><ArrowRight/></button>
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
