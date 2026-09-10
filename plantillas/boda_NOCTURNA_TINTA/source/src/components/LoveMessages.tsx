import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquareHeart, Send, SmilePlus } from "lucide-react";
import { submitPendingMessage } from "@/lib/love-messages";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MESSAGE_EMOJIS = ["♡", "✦", "♪", "✧", "❦", "★", "☾", "✺", "✉", "♥", "❥", "✶"] as const;

const LoveMessages = () => {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
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
        await submitPendingMessage({
          name: formData.name,
          message: formData.message,
        });

        setFormData({ name: "", message: "" });
        setSubmitted(true);
      } catch {
        setSubmitted(false);
        setSubmitError("No se pudo enviar el mensaje. Intentalo otra vez.");
      } finally {
        setIsSubmitting(false);
      }
    };

    void runSubmission();
  };

  const handleEmojiInsert = (emoji: string) => {
    const field = messageFieldRef.current;
    const currentMessage = formData.message;
    const start = field?.selectionStart ?? currentMessage.length;
    const end = field?.selectionEnd ?? currentMessage.length;
    const nextMessage = `${currentMessage.slice(0, start)}${emoji}${currentMessage.slice(end)}`;

    if (nextMessage.length > 150) return;

    setFormData((current) => ({ ...current, message: nextMessage }));
    clearFormStatus();
    setIsEmojiPickerOpen(false);

    window.requestAnimationFrame(() => {
      if (!field) return;
      const nextCursor = start + emoji.length;
      field.focus();
      field.setSelectionRange(nextCursor, nextCursor);
    });
  };

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#DDECE0] bg-white shadow-[0_22px_62px_rgba(15,61,46,0.08)] lg:grid-cols-[0.82fr_1.18fr]">
      <div className="relative bg-[#0D1F18] p-6 text-white md:p-8">
        <div className="absolute -right-20 top-10 h-44 w-44 rounded-full border border-white/10" aria-hidden="true" />
        <MessageSquareHeart className="h-8 w-8 text-white/62" aria-hidden="true" />
        <p className="mt-8 font-nav text-xs uppercase tracking-[0.32em] text-white/54">Libro de deseos</p>
        <p className="mt-4 font-script text-4xl leading-tight md:text-5xl">Una nota para guardar</p>
        <p className="mt-6 text-sm leading-7 text-white/70">
          Mensajes breves, bonitos y revisables antes de mostrarlos en la web.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 p-6 md:p-8">
        <label className="block">
          <span className="mb-2 block font-nav text-[11px] uppercase tracking-[0.24em] text-[#7FAF8E]">Tu nombre</span>
          <input
            value={formData.name}
            onChange={(event) => {
              setFormData((current) => ({ ...current, name: event.target.value }));
              clearFormStatus();
            }}
            maxLength={50}
            placeholder="Tu nombre"
            className="w-full border-0 border-b border-[#DDECE0] bg-transparent px-0 py-3 text-[#0F3D2E] outline-none transition focus:border-[#A7605F]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-nav text-[11px] uppercase tracking-[0.24em] text-[#7FAF8E]">Mensaje</span>
          <textarea
            ref={messageFieldRef}
            value={formData.message}
            onChange={(event) => {
              setFormData((current) => ({ ...current, message: event.target.value }));
              clearFormStatus();
            }}
            placeholder="Escribe algo para los novios"
            maxLength={150}
            rows={4}
            className="w-full resize-none overflow-hidden border-0 border-b border-[#DDECE0] bg-transparent px-0 py-3 text-[#0F3D2E] outline-none transition focus:border-[#A7605F]"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-[#DDECE0] bg-[#FBFEFB] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#1F5E46] transition hover:border-[#A7605F] hover:text-[#A7605F]"
              >
                <SmilePlus className="h-4 w-4" aria-hidden="true" />
                Simbolos
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={10}
              className="w-[min(92vw,310px)] border-[#DDECE0] bg-white p-4 text-[#0F3D2E] shadow-[0_20px_48px_rgba(15,61,46,0.12)]"
            >
              <div className="grid grid-cols-6 gap-2">
                {MESSAGE_EMOJIS.map((emoji, index) => (
                  <button
                    key={`${emoji}-${index}`}
                    type="button"
                    onClick={() => handleEmojiInsert(emoji)}
                    className="flex h-10 w-10 items-center justify-center border border-[#EAF6EC] bg-[#FBFEFB] text-lg transition hover:border-[#A7605F] hover:bg-[#F1DDD5]"
                    aria-label={`Anadir ${emoji} al mensaje`}
                  >
                    <span aria-hidden="true">{emoji}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <span className="font-nav text-xs text-[#7FAF8E]">{formData.message.length}/150</span>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="font-nav inline-flex min-h-14 items-center justify-center gap-2 border border-[#0F3D2E] bg-[#0F3D2E] px-5 text-sm uppercase tracking-[0.26em] text-white transition hover:border-[#A7605F] hover:bg-[#A7605F] disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
        </button>

        {submitted ? <p className="text-sm text-[#2E7D59]">Mensaje enviado. Lo revisaremos antes de publicarlo.</p> : null}
        {submitError ? <p className="text-sm text-[#A14848]">{submitError}</p> : null}
      </form>
    </div>
  );
};

export default LoveMessages;
