import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

type RecordItem = {
  artist: string;
  album: string;
  year: number;
  accent: string;
  description: string;
};

const records: RecordItem[] = [
  {
    artist: "The Blue Tones",
    album: "Midnight Groove",
    year: 1978,
    accent: "from-sky-400 to-indigo-700",
    description: "A warm analog set of soft rock and late-night compositions.",
  },
  {
    artist: "Luna Drift",
    album: "Moonlit Pages",
    year: 1984,
    accent: "from-fuchsia-400 to-rose-600",
    description: "Dreamy synth textures layered like a record loop.",
  },
  {
    artist: "Cassette Choir",
    album: "Velvet Alley",
    year: 1992,
    accent: "from-emerald-400 to-teal-700",
    description: "A private collection of intimate album pressings.",
  },
];

export default function VinylShelf() {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(1);
  const activeRecord = records[activeIndex];
  const textColor = theme === "dark" ? "text-white" : "text-slate-900";
  const panelBg = theme === "dark" ? "bg-zinc-950/80 border-zinc-800" : "bg-white shadow-sm border-slate-200";

  return (
    <section className={`w-full max-w-4xl mx-auto p-6 ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>
      <h2 className={`text-2xl font-bold mb-6 ${textColor}`}>Vinyl Shelf</h2>
      <div className={`rounded-3xl border ${panelBg} overflow-hidden`}>
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed mb-5 opacity-80">
            A small shelf of favorite albums, styled like vintage vinyl sleeves and pressings.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {records.map((record, index) => (
              <button
                key={record.album}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`min-w-[12rem] rounded-[2rem] border transition-all duration-200 ${
                  index === activeIndex
                    ? "border-current shadow-[0_16px_40px_-24px_rgba(0,0,0,0.5)]"
                    : "border-slate-200/80 hover:border-slate-400"
                } ${theme === "dark" ? "bg-zinc-900/80" : "bg-slate-50"}`}
              >
                <div className={`aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br ${record.accent} shadow-inner`}>
                  <div className="flex h-full flex-col justify-end p-4 text-white">
                    <span className="text-xs uppercase tracking-[0.3em] opacity-80">{record.year}</span>
                    <span className="mt-2 text-lg font-semibold leading-tight">{record.album}</span>
                    <span className="text-xs opacity-80">{record.artist}</span>
                  </div>
                </div>
                <div className="px-4 py-3 text-left">
                  <p className="text-sm font-semibold mb-1">{record.artist}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{record.album}</p>
                </div>
              </button>
            ))}
          </div>
          <div className={`rounded-3xl border ${theme === "dark" ? "border-zinc-800 bg-zinc-900/90" : "border-slate-200 bg-white"} p-5`}
          >
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Now selected</span>
              <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-white">{activeRecord.album}</h3>
              <p className="text-sm opacity-80">{activeRecord.artist} · {activeRecord.year}</p>
              <p className="text-sm leading-relaxed opacity-80">{activeRecord.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
