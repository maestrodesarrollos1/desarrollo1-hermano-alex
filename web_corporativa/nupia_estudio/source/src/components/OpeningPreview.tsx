import { useEffect, useRef, useState } from "react";

type Props = { design: string; title: string; run: number; onClose: () => void };

const OpeningPreview = ({ design, title, run, onClose }: Props) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const timeout = useRef<number | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "nupia:close-opening") onClose();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [onClose]);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    timeout.current = window.setTimeout(() => setFailed(true), 15000);
    return () => window.clearTimeout(timeout.current);
  }, [design, run]);

  return (
    <div className="opening-preview">
      {!loaded && <div className="opening-preview__loading" role="status">
        <p>{failed ? "La invitación está tardando en cargar." : "Preparando la invitación…"}</p>
        {failed && <button type="button" className="text-link" onClick={() => { setFailed(false); frame.current?.contentWindow?.location.reload(); }}>Volver a intentar</button>}
      </div>}
      <iframe key={run} ref={frame} src={`/opening.html?design=${encodeURIComponent(design)}`} title={`Apertura interactiva de ${title}`} onLoad={() => { window.clearTimeout(timeout.current); setLoaded(true); }} />
    </div>
  );
};
export default OpeningPreview;
