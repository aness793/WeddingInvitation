import { useEffect, useState } from "react";

const DEFAULT_TARGET = new Date("2026-12-22T14:00:00+01:00");

function getTimeLeft(targetMs: number) {
  const totalSeconds = Math.floor(Math.max(0, targetMs - Date.now()) / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

type CountdownTimerProps = {
  target?: Date;
};

export function CountdownTimer({ target = DEFAULT_TARGET }: CountdownTimerProps) {
  const targetMs = target.getTime();
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetMs));

  useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(getTimeLeft(targetMs));
    if (Date.now() >= targetMs) clearInterval(timer);
  }, 1000);

  return () => clearInterval(timer);
}, [targetMs]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div
      role="timer"
      className="flex items-start justify-center gap-3 sm:gap-5"
    >
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-start gap-3 sm:gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-900 shadow-lg ring-1 ring-white/10 sm:h-24 sm:w-24">
              <span
                className="font-mono text-3xl font-bold tabular-nums text-white sm:text-5xl"
                aria-label={`${value} ${label.toLowerCase()}`}
              >
                {String(value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm">
              {label}
            </span>
          </div>

          {i < units.length - 1 && (
            <span className="pt-3 text-2xl font-bold text-slate-400 sm:pt-6 sm:text-4xl">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}