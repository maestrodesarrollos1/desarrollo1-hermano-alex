import { useEffect, useMemo, useState } from "react";
import { weddingData } from "@/data/weddingData";

export const useCountdown = () => {
  const targetTime = useMemo(() => new Date(weddingData.event.dateIso).getTime(), []);
  const [timeLeft, setTimeLeft] = useState(() => targetTime - Date.now());

  useEffect(() => {
    const updateTimeLeft = () => {
      setTimeLeft(targetTime - Date.now());
    };

    updateTimeLeft();

    const interval = window.setInterval(updateTimeLeft, 1000);
    return () => window.clearInterval(interval);
  }, [targetTime]);

  const remaining = Math.max(timeLeft, 0);

  return [
    { label: "Dias", value: Math.floor(remaining / (1000 * 60 * 60 * 24)) },
    { label: "Horas", value: Math.floor((remaining / (1000 * 60 * 60)) % 24) },
    { label: "Min", value: Math.floor((remaining / (1000 * 60)) % 60) },
    { label: "Seg", value: Math.floor((remaining / 1000) % 60) },
  ] as const;
};
