import { useState } from "react";
import { Check, SmilePlus } from "lucide-react";
import { submitPendingMessage } from "@/lib/love-messages";

export default function LoveMessages() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const addEmoji = () => setMessage(current => `${current}${current ? " " : ""}😊`.slice(0, 150));

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
    <label className="az-message-field">Escribe tu mensaje
      <textarea required maxLength={150} rows={3} value={message} onChange={event => { setMessage(event.target.value); setStatus("idle"); }} placeholder="Escribe tu mensaje"/>
      <span className="az-message-tools"><button type="button" onClick={addEmoji}><SmilePlus size={16}/>Añadir emoji</button><small>{message.length}/150</small></span>
    </label>
    <div className="az-message-bottom"><p>{["localhost", "127.0.0.1"].includes(window.location.hostname) ? "Vista previa: el mensaje de prueba se guarda solo en este navegador." : "Lo leeremos antes de compartirlo en el libro de recuerdos."}</p><button className="az-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : "Enviar"}</button></div>
    <p className="az-form-status" role="status">{status === "success" ? <><Check size={18}/> Guardado. Gracias por dejarnos este recuerdo.</> : status === "error" ? "No se ha podido enviar. El mensaje sigue aquí para que puedas intentarlo de nuevo." : ""}</p>
  </form>;
}
