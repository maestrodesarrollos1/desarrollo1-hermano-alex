import { useEffect, useMemo, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import {
  submitPendingMessage,
} from "@/lib/love-messages";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PRIORITY_MESSAGE_EMOJIS = [
  "💍",
  "💐",
  "👰🏻‍♀️",
  "🤵🏻",
  "💗",
  "🫶🏻",
  "🫂",
  "🥂",
  "🍾",
  "🥵",
  "🤤",
  "❤️",
  "😘",
  "🥰",
  "💋",
  "😍",
  "🫶🏻",
  "🥹",
  "❤️‍🩹",
  "🎉",
  "🎂",
  "🎀",
  "💗",
  "🥳",
] as const;

const EXTRA_MESSAGE_EMOJIS = ["✨", "🌿", "🎶", "📸", "🌸", "☀️", "🌙", "🍰", "🍷", "💌", "💕", "⭐"] as const;

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
        setSubmitError("No se pudo enviar el mensaje. Inténtalo otra vez.");
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
    <div className="mx-auto max-w-xl border border-[#EAF6EC] bg-white p-6 shadow-[0_16px_40px_rgba(15,61,46,0.05)] md:p-8">
      <p className="max-w-lg text-sm leading-relaxed text-[#1F5E46]">
        {"Si te apetece escr\u00EDbenos algo pero que sea bonito \u{1F60B}"}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-[#1F5E46]">Tu nombre</span>
          <input
            value={formData.name}
            onChange={(event) => {
              setFormData((current) => ({ ...current, name: event.target.value }));
              clearFormStatus();
            }}
            maxLength={50}
            placeholder="Tu nombre"
            className="w-full border border-[#EAF6EC] bg-white px-4 py-3 text-[#0F3D2E] outline-none transition focus:border-[#C9E6D0]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-[#1F5E46]">Escribe tu mensaje</span>
          <textarea
            ref={messageFieldRef}
            value={formData.message}
            onChange={(event) => {
              setFormData((current) => ({ ...current, message: event.target.value }));
              clearFormStatus();
            }}
            placeholder="Escribe tu mensaje"
            maxLength={150}
            rows={3}
            className="w-full resize-none overflow-hidden border border-[#EAF6EC] bg-white px-4 py-3 text-[#0F3D2E] outline-none transition focus:border-[#C9E6D0]"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-[#DDECE0] bg-[#F8FCF8] px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#1F5E46] transition hover:border-[#C9E6D0] hover:bg-white"
                >
                  <SmilePlus className="h-4 w-4" aria-hidden="true" />
                  Añadir emoji
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={10}
                className="w-[min(92vw,360px)] border-[#DDECE0] bg-[#FBFEFB] p-0 text-[#0F3D2E] shadow-[0_20px_48px_rgba(15,61,46,0.12)]"
              >
                <div className="border-b border-[#EAF6EC] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#7FAF8E]">Teclado de emojis</p>
                  <p className="mt-2 text-sm leading-6 text-[#1F5E46]">Toca un emoji para añadirlo a tu mensaje.</p>
                </div>
                <div className="max-h-[320px] overflow-y-auto px-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <p className="mb-3 text-[11px] uppercase tracking-[0.26em] text-[#7FAF8E]">Favoritos</p>
                      <div className="grid grid-cols-6 gap-2">
                        {PRIORITY_MESSAGE_EMOJIS.map((emoji, index) => (
                          <button
                            key={`priority-${emoji}-${index}`}
                            type="button"
                            onClick={() => handleEmojiInsert(emoji)}
                            className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#EAF6EC] bg-white text-xl transition hover:-translate-y-px hover:border-[#C9E6D0] hover:bg-[#F8FCF8]"
                            aria-label={`Añadir ${emoji} al mensaje`}
                          >
                            <span aria-hidden="true">{emoji}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-[11px] uppercase tracking-[0.26em] text-[#7FAF8E]">Más emojis</p>
                      <div className="grid grid-cols-6 gap-2">
                        {EXTRA_MESSAGE_EMOJIS.map((emoji, index) => (
                          <button
                            key={`extra-${emoji}-${index}`}
                            type="button"
                            onClick={() => handleEmojiInsert(emoji)}
                            className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#EAF6EC] bg-white text-xl transition hover:-translate-y-px hover:border-[#C9E6D0] hover:bg-[#F8FCF8]"
                            aria-label={`Añadir ${emoji} al mensaje`}
                          >
                            <span aria-hidden="true">{emoji}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-right text-xs text-[#7FAF8E]">
              {formData.message.length}/150
            </span>
          </div>
        </label>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full border border-[#0F3D2E] bg-[#0F3D2E] px-5 py-4 text-sm uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-[#0F3D2E] disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {submitted ? (
        <p className="mt-4 text-sm text-[#2E7D59]">
          Mensaje enviado. Lo revisaremos antes de publicarlo.
        </p>
      ) : null}
      {submitError ? <p className="mt-4 text-sm text-[#A14848]">{submitError}</p> : null}
    </div>
  );
};

export default LoveMessages;
