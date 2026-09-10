import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { submitPendingMessage } from "@/lib/love-messages";
export default function LoveMessages() {
  const [name,setName]=useState("");
  const [message,setMessage]=useState("");
  const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
  return <form className="az-message-form" onSubmit={async e=>{
    e.preventDefault();
    if(name.trim().length<2 || !message.trim() || status==="sending")return;
    setStatus("sending");
    try {await submitPendingMessage({name,message});setName("");setMessage("");setStatus("success");}
    catch {setStatus("error");}
  }}>
    <label>Vuestro nombre<input required minLength={2} maxLength={50} autoComplete="name" value={name} onChange={e=>{setName(e.target.value);setStatus("idle");}} placeholder="Así sabremos de quién es"/></label>
    <label className="az-message-field">Vuestro mensaje<textarea required maxLength={150} rows={3} value={message} onChange={e=>{setMessage(e.target.value);setStatus("idle");}} placeholder="Queridos Adrián y Gema…"/><small>{message.length} / 150</small></label>
    <div className="az-message-bottom"><p>{["localhost", "127.0.0.1"].includes(window.location.hostname) ? "Vista previa: el mensaje de prueba se guarda solo en este navegador." : "Lo leeremos antes de compartirlo en el libro de recuerdos."}</p><button className="az-button" type="submit" disabled={status==="sending"}>{status==="sending" ? "Enviando…" : "Enviar unas palabras"}<ArrowUpRight size={17}/></button></div>
    <p className="az-form-status" role="status">{status==="success" ? <><Check size={18}/> Guardado. Gracias por dejarnos este recuerdo.</> : status==="error" ? "No se ha podido enviar. El mensaje sigue aquí para que puedas intentarlo de nuevo." : ""}</p>
  </form>;
}
