import { useCountdown } from "@/hooks/use-countdown";

const AboutInfo = () => {
  const countdownItems = useCountdown();

  return (
    <section id="countdown" data-editor-component="countdown" className="scroll-animate bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#7FAF8E]">Cuenta atras</p>
        <h2 className="mt-4 font-script text-4xl text-[#0F3D2E] md:text-6xl">Ya falta menos</h2>
        <div className="mx-auto mt-6 h-px w-20 bg-[#DDF0E1]" />

        <div className="mt-12 grid grid-cols-2 gap-px bg-[#EAF6EC] md:grid-cols-4">
          {countdownItems.map((item) => (
            <div key={item.label} className="bg-white px-4 py-8 text-center">
              <p className="font-script text-5xl text-[#0F3D2E] md:text-6xl">{item.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.32em] text-[#2E7D59]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
