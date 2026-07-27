import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

type Book = {
  title: string;
  author: string;
  color: string;
  summary: string;
};

const books: Book[] = [
  {
    title: "Quiet Hours",
    author: "M. Nova",
    color: "bg-orange-400",
    summary: "A gentle read about quiet afternoons and the craft of close listening.",
  },
  {
    title: "Paper Trails",
    author: "J. Mercer",
    color: "bg-sky-500",
    summary: "A memoir shaped like a bookshelf page, layered with warm type and ink.",
  },
  {
    title: "Penumbra",
    author: "A. Cole",
    color: "bg-violet-500",
    summary: "A poetic journey through shadow, light, and the pages between.",
  },
];

export default function Bookshelf() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(0);
  const selectedBook = books[open];
  const textColor = theme === "dark" ? "text-white" : "text-slate-900";
  const shelfBg = theme === "dark" ? "bg-zinc-950/80 border-zinc-800" : "bg-white border-slate-200";

  return (
    <section className={`w-full max-w-4xl mx-auto p-6 ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>
      <h2 className={`text-2xl font-bold mb-6 ${textColor}`}>Bookshelf</h2>
      <div className={`rounded-3xl border ${shelfBg} overflow-hidden`}>
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed mb-5 opacity-80">
            A compact shelf of selected reads, formatted with stacked spines and a quick detail view.
          </p>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {books.map((book, index) => (
              <button
                key={book.title}
                type="button"
                onClick={() => setOpen(index)}
                className={`min-w-[4.5rem] rounded-xl border transition-all duration-200 ${
                  index === open ? "border-current shadow-[0_14px_32px_-22px_rgba(0,0,0,0.5)]" : "border-slate-200/80 hover:border-slate-400"
                } ${theme === "dark" ? "bg-zinc-900/80" : "bg-slate-50"}`}
                aria-label={`Select ${book.title}`}
              >
                <div className={`h-40 w-16 rounded-2xl shadow-inner ${book.color}`} />
                <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-slate-500">{book.author}</div>
              </button>
            ))}
          </div>
          <div className={`rounded-3xl border ${theme === "dark" ? "border-zinc-800 bg-zinc-900/90" : "border-slate-200 bg-white"} p-5`}>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Currently open</span>
              <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-white">{selectedBook.title}</h3>
              <p className="text-sm opacity-80">{selectedBook.author}</p>
              <p className="text-sm leading-relaxed opacity-80">{selectedBook.summary}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
