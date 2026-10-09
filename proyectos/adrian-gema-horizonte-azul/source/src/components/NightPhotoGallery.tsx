import { useEffect, useRef, useState } from "react";
import type { PageFlip } from "page-flip";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { templateValues } from "@/config/template-values";
import { getAlbumPhotos, type AlbumPhoto } from "@/data/photo-album";
import { fetchApprovedMessages, type MessageItem } from "@/lib/love-messages";
import { bindAlbumMotion, turnAlbumPage } from "@/lib/album-binding";
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

function createBoundCover(side: "front" | "back") {
  const page = document.createElement("div");
  page.className = `nb-page nb-bound-cover nb-bound-cover--${side}`;
  page.dataset.density = "hard";
  const inner = document.createElement("div");
  inner.className = "nb-bound-cover-inner";
  const names = `${templateValues.couple.partner1} & ${templateValues.couple.partner2}`;

  if (side === "front") {
    const eyebrow = document.createElement("span");
    eyebrow.className = "nb-bound-cover-kicker";
    eyebrow.textContent = "Nuestro álbum";
    const title = document.createElement("strong");
    title.className = "nb-bound-cover-title";
    title.textContent = names;
    const portrait = document.createElement("figure");
    portrait.className = "nb-bound-cover-portrait";
    const image = document.createElement("img");
    image.src = templateValues.images.landing || templateValues.images.hero;
    image.alt = "";
    image.draggable = false;
    image.decoding = "async";
    portrait.append(image);
    const details = document.createElement("small");
    details.className = "nb-bound-cover-details";
    details.textContent = `${templateValues.event.dateLabel} · ${templateValues.event.venue}`;
    inner.append(eyebrow, title, portrait, details);
  } else {
    const monogram = document.createElement("span");
    monogram.className = "nb-bound-cover-monogram";
    monogram.textContent = `${templateValues.couple.partner1.charAt(0)}${templateValues.couple.partner2.charAt(0)}`;
    const closing = document.createElement("strong");
    closing.className = "nb-bound-cover-closing";
    closing.textContent = templateValues.story.title;
    const rule = document.createElement("i");
    rule.setAttribute("aria-hidden", "true");
    const details = document.createElement("small");
    details.className = "nb-bound-cover-details";
    details.textContent = `${names} · ${templateValues.event.dateLabel}`;
    inner.append(monogram, closing, rule, details);
  }

  page.append(inner);
  return page;
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
  mount.prepend(image);
  const number = document.createElement("span");
  number.className = "nb-page-number";
  number.textContent = String(index + 1).padStart(2, "0");
  if (photo.caption || photo.date) {
    const caption = document.createElement("figcaption");
    const title = document.createElement("span");
    title.textContent = photo.caption;
    const date = document.createElement("small");
    date.textContent = photo.date;
    caption.append(title, date);
    content.append(header, mount, caption, number);
  } else content.append(header, mount, number);
  page.append(content);
  return page;
}

function createClosingSheet() {
  const page = document.createElement("article");
  page.className = "nb-page nb-closing-sheet";
  const print = document.createElement("div");
  print.className = "nb-closing-print";
  const header = document.createElement("div");
  header.className = "nb-closing-header";
  const names = document.createElement("span");
  names.textContent = `${templateValues.couple.partner1} & ${templateValues.couple.partner2}`;
  const date = document.createElement("span");
  date.textContent = templateValues.event.dateLabel;
  header.append(names, date);
  const message = document.createElement("div");
  message.className = "nb-closing-message";
  const eyebrow = document.createElement("span");
  eyebrow.textContent = "Hasta aquí, nuestras fotos";
  const title = document.createElement("strong");
  title.textContent = "Lo siguiente";
  const titleLine = document.createElement("span");
  titleLine.textContent = "es con vosotros.";
  title.append(titleLine);
  const copy = document.createElement("p");
  copy.textContent = `Nos falta una foto: la de todos juntos el ${templateValues.event.dateLabel} en ${templateValues.event.venue}.`;
  message.append(eyebrow, title, copy);
  const footer = document.createElement("div");
  footer.className = "nb-closing-footer";
  footer.textContent = "Nos vemos allí";
  print.append(header, message, footer);
  page.append(print);
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
  const isTurning = useRef(false);

  useEffect(() => {
    const parent = host.current;
    if (!parent || !photos.length) return;
    let disposed = false;
    let instance: PageFlip | null = null;
    let binding: ReturnType<typeof bindAlbumMotion> | null = null;
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
        const photoSheets = photos.map((photo, index) => createSheet(photo, index, pageNotes[index]));
        const sheets = [createBoundCover("front"), ...photoSheets, createClosingSheet(), createBoundCover("back")];
        sheets.forEach(sheet => element.append(sheet));
        instance = new PageFlip(element, {
          width: 430, height: 565, size: "stretch",
          minWidth: 270, maxWidth: 470, minHeight: 355, maxHeight: 618,
          showCover: true, usePortrait: true, autoSize: true,
          drawShadow: true, maxShadowOpacity: 0.32, flippingTime: 1450,
          mobileScrollSupport: false, showPageCorners: false,
          disableFlipByClick: true, swipeDistance: 28,
          useMouseEvents: !media.matches,
        });
        bookRef.current = instance;
        binding = bindAlbumMotion(instance, parent.parentElement!);
        const sync = () => {
          if (disposed || !instance) return;
          const index = instance.getCurrentPageIndex();
          setCurrent(index);
          setPortrait(instance.getOrientation() === "portrait");
          binding?.sync();
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
          binding?.state(event.data);
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
      binding?.destroy();
      instance?.destroy();
      bookRef.current = null;
      parent.replaceChildren();
    };
  }, []);

  const lastPage = photos.length + 2;
  const onFrontCover = current === 0;
  const onClosingPage = current === photos.length + 1 || (!portrait && current === photos.length);
  const onBackCover = current >= lastPage;
  const firstVisiblePhoto = onFrontCover || onClosingPage || onBackCover ? -1 : Math.max(0, current - 1);
  const lastVisiblePhoto = firstVisiblePhoto < 0 ? -1 : Math.min(firstVisiblePhoto + (portrait ? 0 : 1), photos.length - 1);
  const next = (direction: -1 | 1) => {
    const book = bookRef.current;
    if (!book) return;
    if (direction < 0 && current === 0) return;
    if (direction > 0 && onBackCover) return;
    if (isTurning.current) return;
    if (reducedMotion.current) {
      if (direction > 0) book.turnToNextPage(); else book.turnToPrevPage();
      return;
    }
    turnAlbumPage(book, direction);
  };
  const visible = firstVisiblePhoto < 0 ? [] : photos.slice(firstVisiblePhoto, lastVisiblePhoto + 1);
  const movePhoto = (step: number) => setLightbox(index => index === null ? null : (index + step + photos.length) % photos.length);
  if (!photos.length) return null;

  return <section className="az-album nb-section" aria-labelledby="album-title">
    <div className="az-wrap nb-heading">
      <p className="az-kicker">Recuerdos de una vida juntos</p>
      <h2 id="album-title" data-editor-key="album.title">{templateValues.album.title}</h2>
      <p>Los viajes. Lo cotidiano. Y todo lo que nos queda.</p>
    </div>
    {failed ? <div className="az-wrap nb-fallback">{photos.map((photo, index) => <figure key={photo.id}>
      <img src={photo.src} alt={photo.alt} loading="lazy"/>{(photo.caption || photo.date) && <figcaption>{photo.caption}{photo.date && ` · ${photo.date}`}</figcaption>}
      <button className="az-text-button" onClick={event => { opener.current = event.currentTarget; setLightbox(index); }}><Expand size={16}/> Ampliar foto</button>
    </figure>)}</div> : <>
      <div className="nb-stage az-wrap">
        <div className={`nb-cover${ready ? " is-ready" : ""}`} role="group" aria-label="Libreta de recuerdos" aria-describedby="nb-position" tabIndex={0}
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
        <div className="nb-position">
          <p id="nb-position" aria-live="polite" aria-atomic="true">
            {ready ? onFrontCover ? "Portada" : onClosingPage ? "Lo siguiente, con vosotros" : onBackCover ? "Contraportada" : `${String(firstVisiblePhoto + 1).padStart(2, "0")}${lastVisiblePhoto !== firstVisiblePhoto ? ` / ${String(lastVisiblePhoto + 1).padStart(2, "0")}` : ""} · ${photos.length}` : "Nuestro álbum"}
          </p>
          <span className="nb-progress" aria-hidden="true"><i style={{ width: `${(current / lastPage) * 100}%` }}/></span>
        </div>
        <button className="az-icon" disabled={!ready || onBackCover || turning} onClick={() => next(1)} aria-label="Página siguiente" title="Página siguiente"><ArrowRight/></button>
      </div>
      <div className="az-wrap nb-enlarge">{ready && visible.map((photo, offset) => <button key={photo.id} className="az-text-button"
        onClick={event => { opener.current = event.currentTarget; setLightbox(firstVisiblePhoto + offset); }}
        aria-label={`Ampliar fotografía ${firstVisiblePhoto + offset + 1}`} title={`Ver completa la fotografía ${firstVisiblePhoto + offset + 1}`}>
        <Expand size={15}/><span>{photo.caption || (portrait ? "Ver en grande" : offset === 0 ? "Ampliar izquierda" : "Ampliar derecha")}</span>
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
