import { useCountdown } from "@/hooks/use-countdown";
import { weddingData } from "@/data/weddingData";

const AboutInfo = () => {
  const countdownItems = useCountdown();

  return (
    <section id="countdown" data-editor-component="countdown" className="scroll-animate bg-white px-5 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden border border-[#DDECE0] bg-[#0D1F18] text-white shadow-[0_24px_70px_rgba(15,61,46,0.12)] lg:grid-cols-[0.68fr_1.32fr]">
          <div className="relative flex flex-col justify-between border-b border-white/12 p-6 md:p-8 lg:border-b-0 lg:border-r">
            <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full border border-white/10" aria-hidden="true" />
            <div className="relative">
              <p className="font-nav text-xs uppercase tracking-[0.36em] text-white/54">Cuenta atras</p>
              <h2 className="mt-4 font-script text-4xl leading-none md:text-5xl">La noche se acerca</h2>
            </div>
            <p className="relative mt-8 text-sm leading-7 text-white/70">
              <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
              {" · "}
              <span data-editor-key="event.city">{weddingData.event.city}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4">
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className="flex min-h-[10rem] flex-col items-center justify-center border-white/12 p-6 text-center odd:border-r md:min-h-[13rem] md:border-r md:last:border-r-0"
              >
                <p className="font-script text-5xl leading-none text-white md:text-6xl">{item.value}</p>
                <p className="mt-4 font-nav text-[10px] uppercase tracking-[0.3em] text-white/54">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
