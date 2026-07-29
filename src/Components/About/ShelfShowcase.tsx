import { useState } from "react";
import { records, books } from "../../lib/personal";

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
                  <img
                    src="/images/records/placeholder.jpg"
                    alt="record artwork"
                    className="vinyl-card-art"
                  />
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
