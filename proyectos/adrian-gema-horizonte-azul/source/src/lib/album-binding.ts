import type { PageFlip } from "page-flip";

export function turnAlbumPage(book: PageFlip, direction: -1 | 1) {
  const rect = book.getRender().getRect();
  // page-flip's flipPrev uses x=10, outside the corner hit area in portrait.
  // Use book-relative corners for toolbar and keyboard turns in both layouts.
  book.getFlipController().flip({
    x: rect.left + (direction > 0 ? rect.width - 10 : 10),
    y: rect.top + rect.height - 2,
  });
}

// Keep the binding on the same clock as page-flip's rigid covers, including
// a dragged turn that is cancelled. There is no second timed CSS animation.
export function bindAlbumMotion(book: PageFlip, surface: HTMLElement) {
  let frame = 0;
  let active = false;
  let sourcePage = 0;
  let disposed = false;

  const paint = (moving: boolean) => {
    const portrait = book.getOrientation() === "portrait";
    const last = book.getPageCount() - 1;
    const index = moving ? sourcePage : book.getCurrentPageIndex();
    let left = index === 0 ? 0 : 1;
    let right = index === last ? 0 : 1;
    let shade = 0;
    const calculation = moving ? book.getFlipController().getCalculation() : null;

    if (calculation?.getPosition()) {
      const progress = Math.max(0, Math.min(1, calculation.getFlippingProgress() / 100));
      const projection = Math.cos(Math.PI * progress);
      shade = Math.sin(Math.PI * progress) * 0.22;
      const forward = calculation.getDirection() === 0;
      if (index === 0 && forward) left = Math.max(0, -projection);
      else if (index === 1 && !forward) left = Math.max(0, projection);
      else if (index === last && !forward) right = Math.max(0, -projection);
      else if (index === last - (portrait ? 1 : 2) && forward) right = Math.max(0, projection);
    }

    surface.dataset.layout = portrait ? "portrait" : "landscape";
    surface.style.setProperty("--nb-left", String(portrait ? 0 : left));
    surface.style.setProperty("--nb-right", String(portrait ? 1 : right));
    surface.style.setProperty("--nb-center", `${portrait ? 0 : (left - right) * 25}%`);
    surface.style.setProperty("--nb-gutter", String(portrait ? 0 : Math.min(left, right)));
    surface.style.setProperty("--nb-shade", String(shade));
  };

  const tick = () => {
    if (disposed || !active) return;
    paint(true);
    frame = requestAnimationFrame(tick);
  };

  return {
    sync() { if (!active && !disposed) paint(false); },
    state(state: string) {
      if (disposed) return;
      if (state === "read") {
        active = false;
        cancelAnimationFrame(frame);
        paint(false);
      } else if (!active) {
        sourcePage = book.getCurrentPageIndex();
        active = true;
        frame = requestAnimationFrame(tick);
      }
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
    },
  };
}
