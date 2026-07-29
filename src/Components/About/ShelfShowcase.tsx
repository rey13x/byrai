import { useState } from "react";

type RecordItem = {
  artist: string;
  album: string;
  year: number;
  spineColor: string;
  spineInk: string;
  url?: string;
};

type BookItem = {
  title: string;
  author: string;
  year: number;
  spineTitle: string;
  spineAuthor: string;
  spineColor: string;
  spineInk: string;
  spine: number;
  coverWidth: number;
  coverHeight: number;
  url?: string;
};

const records: RecordItem[] = [
  { artist: "Avicii", album: "TIM", year: 2019, spineColor: "#8f8a89", spineInk: "#171717", url: "https://music.apple.com/us/album/tim/1462628887" },
  { artist: "Dr. Dre", album: "The Chronic", year: 1992, spineColor: "#1f1f1f", spineInk: "#f7f7f7", url: "https://music.apple.com/us/album/the-chronic/1440835584" },
  { artist: "Twenty One Pilots", album: "Trench", year: 2018, spineColor: "#d4ae21", spineInk: "#111111", url: "https://music.apple.com/us/album/trench/1297323097" },
  { artist: "The Weeknd", album: "After Hours", year: 2020, spineColor: "#681818", spineInk: "#ffffff", url: "https://music.apple.com/us/album/after-hours/1499378108" },
  { artist: "Billie Eilish", album: "Happier Than Ever", year: 2021, spineColor: "#1c1e22", spineInk: "#f8f8f8", url: "https://music.apple.com/us/album/happier-than-ever/1564530715" },
];

const books: BookItem[] = [
  { title: "Grid Systems in Graphic Design", author: "Josef Müller-Brockmann", year: 1981, spineTitle: "Grid Systems", spineAuthor: "JMB", spineColor: "#df6029", spineInk: "#171717", spine: 24, coverWidth: 411, coverHeight: 600, url: "https://niggli.ch/en/products/rastersysteme-fur-die-visuelle-gestaltung" },
  { title: "Refactoring UI", author: "Adam Wathan", year: 2020, spineTitle: "Refactoring UI", spineAuthor: "AW+SS", spineColor: "#1f3045", spineInk: "#f2f2f2", spine: 24, coverWidth: 380, coverHeight: 600 },
  { title: "Universal UX", author: "Lynn Miller", year: 2022, spineTitle: "Universal UX", spineAuthor: "IP", spineColor: "#2d2f30", spineInk: "#ffffff", spine: 22, coverWidth: 380, coverHeight: 600 },
  { title: "Creative Act", author: "Twyla Tharp", year: 2012, spineTitle: "Creative Act", spineAuthor: "RR", spineColor: "#e2e0db", spineInk: "#111111", spine: 22, coverWidth: 360, coverHeight: 600 },
  { title: "Show Your Work!", author: "Austin Kleon", year: 2014, spineTitle: "Show Your Work!", spineAuthor: "AK", spineColor: "#c99b2a", spineInk: "#111111", spine: 20, coverWidth: 330, coverHeight: 600 },
  { title: "Make Something", author: "Dylan Kain", year: 2020, spineTitle: "Make Something", spineAuthor: "MM", spineColor: "#2b2231", spineInk: "#f2f2f2", spine: 22, coverWidth: 360, coverHeight: 600 },
];

const SectionTitle = ({
  index,
  delay,
  children,
}: {
  index: number;
  delay: number;
  children: React.ReactNode;
}) => (
  <div className="shelf-section-title" style={{ animationDelay: `${delay}ms` }}>
    <span className="shelf-section-index">{index}</span>
    <h3 className="shelf-section-heading">{children}</h3>
  </div>
);

const VinylShelf = () => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(records.length / 2));

  return (
    <div className="vinyl-shelf-wrapper">
      <ul className="vinyl-shelf-list">
        {records.map((record, index) => {
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const scale = Math.max(0.86, 1 - distance * 0.06);
          const translate = offset * 46;
          const zIndex = records.length - distance;

          return (
            <li
              key={`${record.artist}-${record.album}`}
              className={`vinyl-card ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              style={{
                transform: `translateX(${translate}px) scale(${scale})`,
                zIndex,
              }}
            >
              <a
                href={record.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="vinyl-card-link"
              >
                <div className="vinyl-card-label">{record.artist}</div>
                <div className="vinyl-card-title">{record.album}</div>
                <div className="vinyl-card-year">{record.year}</div>
                <div className="vinyl-card-spine" style={{ backgroundColor: record.spineColor, color: record.spineInk }}>
                  <span>{record.album}</span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Bookshelf = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="bookshelf-wrapper">
      <ul className="bookshelf-list">
        {books.map((book, index) => {
          const isSelected = index === selected;
          return (
            <li key={book.title} className="book-spine-frame">
              <button
                type="button"
                className={`book-spine ${isSelected ? "book-spine-selected" : ""}`}
                style={{
                  backgroundColor: book.spineColor,
                  color: book.spineInk,
                  width: `${book.spine}px`,
                }}
                onClick={() => setSelected(index)}
              >
                <span className="book-spine-text">{book.spineTitle}</span>
                <span className="book-spine-author">{book.spineAuthor}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default function ShelfShowcase() {
  return (
    <section className="w-full max-w-4xl mx-auto p-6">
      {records.length > 0 && (
        <section className="mt-16">
          <SectionTitle index={1} delay={320}>
            On rotation
          </SectionTitle>
          <div className="enter mt-5" style={{ '--enter-delay': '360ms' } as React.CSSProperties}>
            <VinylShelf />
          </div>
        </section>
      )}

      {books.length > 0 && (
        <section className="mt-16">
          <SectionTitle index={2} delay={380}>
            Books I Love
          </SectionTitle>
          <div className="enter mt-5" style={{ '--enter-delay': '420ms' } as React.CSSProperties}>
            <Bookshelf />
          </div>
        </section>
      )}
    </section>
  );
}
