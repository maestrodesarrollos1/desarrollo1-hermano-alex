import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { submitPendingMessage } from "@/lib/love-messages";

const LoveMessages = () => {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageFieldRef = useRef<HTMLTextAreaElement | null>(null);

  const clearFormStatus = () => {
    setSubmitted(false);
    setSubmitError("");
  };

  const canSubmit = useMemo(
    () => formData.name.trim().length > 1 && formData.message.trim().length > 0,
    [formData],
  );

  useEffect(() => {
    if (!messageFieldRef.current) return;
    messageFieldRef.current.style.height = "auto";
    messageFieldRef.current.style.height = `${messageFieldRef.current.scrollHeight}px`;
  }, [formData.message]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    const runSubmission = async () => {
      setIsSubmitting(true);
      setSubmitError("");
      try {
        await submitPendingMessage({ name: formData.name, message: formData.message });
        setFormData({ name: "", message: "" });
        setSubmitted(true);
      } catch {
        setSubmitError("No se pudo enviar el mensaje. Intentalo otra vez.");
      } finally {
        setIsSubmitting(false);
      }
    };

    void runSubmission();
  };

  return (
    <form onSubmit={handleSubmit} className="grid border border-[#14382A]/18 bg-[#F7F1E5] p-3 shadow-[0_28px_70px_rgba(7,20,15,.1)] lg:grid-cols-[.72fr_1.28fr]">
      <div className="relative bg-[#123C2D] p-8 text-[#F7F1E5] md:p-11">
        <div className="absolute inset-4 border border-[#F7F1E5]/16" aria-hidden="true" />
        <div className="relative">
          <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#D9B76F]">Libro de los invitados</p>
          <h3 className="mt-7 font-script text-6xl leading-[.8] md:text-7xl">Deja unas palabras</h3>
          <p className="mt-8 max-w-xs text-sm leading-7 text-[#F7F1E5]/68">Una nota breve que quedara guardada con los recuerdos de este dia.</p>
        </div>
      </div>
      <div className="grid gap-7 p-8 md:p-11">
        <input
          value={formData.name}
          onChange={(event) => {
            setFormData((current) => ({ ...current, name: event.target.value }));
            clearFormStatus();
          }}
          maxLength={50}
          placeholder="Tu nombre"
          className="min-h-12 border-0 border-b border-[#14382A]/26 bg-transparent font-body text-sm text-[#14382A] outline-none transition-colors placeholder:text-[#14382A]/45 focus:border-[#B58A3C]"
        />
        <textarea
          ref={messageFieldRef}
          value={formData.message}
          onChange={(event) => {
            setFormData((current) => ({ ...current, message: event.target.value }));
            clearFormStatus();
          }}
          maxLength={150}
          rows={4}
          placeholder="Tu mensaje"
          className="min-h-32 resize-none border-0 border-b border-[#14382A]/26 bg-transparent font-body text-sm text-[#14382A] outline-none transition-colors placeholder:text-[#14382A]/45 focus:border-[#B58A3C]"
        />
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="font-nav inline-flex min-h-14 items-center justify-center gap-3 bg-[#123C2D] px-6 text-[10px] font-medium uppercase tracking-[.26em] text-[#F7F1E5] transition hover:bg-[#B58A3C] hover:text-[#14382A] disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
        {submitted ? <p className="text-sm text-[#4F8B6D]">Mensaje enviado. Lo revisaremos antes de publicarlo.</p> : null}
        {submitError ? <p className="text-sm text-[#A14848]">{submitError}</p> : null}
      </div>
    </form>
  );
};

export default LoveMessages;
