import { weddingData } from "@/data/weddingData";
import leftPlant from "../../resources/left.png";
import rightPlant from "../../resources/right.png";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

const Logo = ({ className = "", compact = false }: LogoProps) => {
  return (
    <div
      className={`wedding-logo relative mx-auto w-full max-w-[1120px] bg-transparent px-[18cqw] py-[5cqw] text-center ${
        compact ? "is-compact" : ""
      } ${className}`}
      role="img"
      aria-label={`${weddingData.couple.display}, ${weddingData.event.dateLabel}`}
    >
      <img
        src={leftPlant}
        alt=""
        aria-hidden="true"
        className="wedding-logo-plant wedding-logo-plant-left pointer-events-none absolute select-none object-contain"
      />
      <img
        src={rightPlant}
        alt=""
        aria-hidden="true"
        className="wedding-logo-plant wedding-logo-plant-right pointer-events-none absolute select-none object-contain"
      />

      <div className="relative z-10 flex min-h-[36cqw] flex-col items-center justify-center gap-[3cqw]">
        <p className="wedding-logo-name uppercase leading-none tracking-[0.18em] text-[#0F3D2E]">
          <span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
          {" y "}
          <span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
        </p>
        <p className="wedding-logo-title min-w-0 uppercase leading-none tracking-[0.12em] text-[#1F5E46]">
          Invitación especial
        </p>
        <p className="wedding-logo-date uppercase leading-none tracking-[0.3em] text-[#0F3D2E]">
          <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
        </p>
      </div>
    </div>
  );
};

export default Logo;
