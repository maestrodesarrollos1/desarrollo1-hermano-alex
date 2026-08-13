import { useCountdown } from "@/hooks/use-countdown";
import { weddingData } from "@/data/weddingData";

const AboutInfo = () => {
  const countdownItems = useCountdown();

  return (
    <section id="countdown" data-editor-component="countdown" className="scroll-animate overflow-hidden bg-[#0A1710] px-5 py-20 text-[#F7F1E5] md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[.72fr_1.28fr] md:items-end">
        <div>
          <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#D9B76F]">La cuenta atras</p>
          <h2 className="mt-6 max-w-[20rem] font-script text-6xl leading-[.82] md:max-w-md md:text-7xl">Una noche para recordar</h2>
          <p className="mt-7 max-w-xs font-body text-sm leading-7 text-[#F7F1E5]/62">
            Guardad la fecha. Lo demas sera una historia para contar muchas veces.
          </p>
          <p className="mt-10 font-nav text-[10px] uppercase tracking-[.25em] text-[#D9B76F]" data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</p>
        </div>

        <div className="border-y border-[#F7F1E5]/22">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#F7F1E5]/18 md:grid-cols-4 md:divide-y-0">
            {countdownItems.map((item) => (
              <div key={item.label} className="min-h-40 px-5 py-7 md:min-h-52 md:px-7 md:py-10">
                <p className="font-script text-6xl leading-none text-[#F7F1E5] md:text-7xl">{item.value}</p>
                <p className="mt-6 font-nav text-[10px] font-medium uppercase tracking-[.27em] text-[#D9B76F]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
