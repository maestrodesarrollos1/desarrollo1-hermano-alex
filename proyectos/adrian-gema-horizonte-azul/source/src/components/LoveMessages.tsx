import { lazy, Suspense, useRef, useState } from "react";
import { Check, SmilePlus, X } from "lucide-react";
import { submitPendingMessage } from "@/lib/love-messages";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MessageEmojiPicker = lazy(() => import("./MessageEmojiPicker"));

export default function LoveMessages() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const textarea = useRef<HTMLTextAreaElement>(null);
  const selection = useRef({ start: 0, end: 0 });
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiNotice, setEmojiNotice] = useState("");
  const addEmoji = (emoji: string) => {
    const { start, end } = selection.current;
    const next = message.slice(0, start) + emoji + message.slice(end);
    if (next.length > 150) {
      setEmojiNotice("No queda espacio para este emoji. Acorta un poco el mensaje.");
      return;
    }
    setMessage(next);
    setStatus("idle");
    setEmojiNotice("");
    selection.current = { start: start + emoji.length, end: start + emoji.length };
    requestAnimationFrame(() => textarea.current?.setSelectionRange(selection.current.start, selection.current.end));
  };

  return <form className="az-message-form" onSubmit={async event => {
    event.preventDefault();
    if (name.trim().length < 2 || !message.trim() || status === "sending") return;
    setStatus("sending");
    try {
      await submitPendingMessage({ name, message });
      setName(""); setMessage(""); setStatus("success");
    } catch { setStatus("error"); }
  }}>
    <p className="az-postit-form-title">Dejadnos un mensaje en el álbum 😋</p>
    <label>Tu nombre
      <input required minLength={2} maxLength={50} autoComplete="name" value={name} onChange={event => { setName(event.target.value); setStatus("idle"); }} placeholder="Tu nombre"/>
    </label>
    <div className="az-message-field">
      <label htmlFor="love-message">Escribe tu mensaje</label>
      <textarea id="love-message" ref={textarea} required maxLength={150} rows={3} value={message}
        onSelect={event => { selection.current = { start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd }; }}
        onChange={event => { setMessage(event.target.value); setStatus("idle"); setEmojiNotice(""); }} placeholder="Escribe tu mensaje"/>
      <div className="az-message-tools">
        <Popover open={emojiOpen} onOpenChange={open => { setEmojiOpen(open); setEmojiNotice(""); }}>
          <PopoverTrigger asChild><button type="button" onClick={() => {
            if (!emojiOpen && textarea.current) selection.current = { start: textarea.current.selectionStart, end: textarea.current.selectionEnd };
          }}><SmilePlus size={16}/>Añadir emoji</button></PopoverTrigger>
          <PopoverContent className="az-emoji-popover" align="start" side="top" sideOffset={8} collisionPadding={12} aria-label="Elegir emojis">
            <div className="az-emoji-heading"><span>Elige tus emojis</span><button type="button" aria-label="Cerrar emojis" onClick={() => setEmojiOpen(false)}><X size={18}/></button></div>
            <Suspense fallback={<p role="status">Cargando emojis…</p>}><MessageEmojiPicker onSelect={addEmoji}/></Suspense>
            <p className="az-emoji-notice" role="status">{emojiNotice}</p>
          </PopoverContent>
        </Popover>
        <small>{message.length}/150</small>
      </div>
    </div>
    <div className="az-message-bottom"><p>{["localhost", "127.0.0.1"].includes(window.location.hostname) ? "Vista previa: el mensaje de prueba se guarda solo en este navegador." : "Lo leeremos antes de compartirlo en el libro de recuerdos."}</p><button className="az-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : "Enviar"}</button></div>
    <p className="az-form-status" role="status">{status === "success" ? <><Check size={18}/> Guardado. Gracias por dejarnos este recuerdo.</> : status === "error" ? "No se ha podido enviar. El mensaje sigue aquí para que puedas intentarlo de nuevo." : ""}</p>
  </form>;
}
