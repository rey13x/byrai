import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/Button";
import { ArrowLeft, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { subscribeArticles, parseArticleContent, formatTimestamp, type Article } from "../../lib/articleUtils";
import PremiumModal from "./PremiumModal";

const CodeBlock = ({ language, code, filename }: { language: string; code: string; filename?: string }) => {
  const { theme } = useTheme();
  return (
    <div className={`my-6 rounded-lg overflow-hidden border shadow-sm text-[13px] ${theme === 'dark' ? 'border-zinc-800' : 'border-slate-200'}`}>
      {(filename || language) && (
        <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className="flex items-center gap-2">
            {language === 'bash' || language === 'terminal' ? <Terminal className="w-4 h-4 text-slate-500" /> : null}
            <span className={`text-xs font-medium font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {filename || language}
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${theme === 'dark' ? 'bg-zinc-700' : 'bg-slate-300'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full ${theme === 'dark' ? 'bg-zinc-700' : 'bg-slate-300'}`}></div>
          </div>
        </div>
      )}
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '13px', lineHeight: '1.6', backgroundColor: theme === 'dark' ? '#0d1117' : '#1e1e1e' }}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const BlogContentRenderer = ({ content }: { content: ReturnType<typeof parseArticleContent> }) => {
  const { theme } = useTheme();
  const paragraphColor = theme === 'dark' ? 'text-neutral-300' : 'text-slate-700';

  const renderVideo = (src: string, key: number) => {
    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
    if (isYouTube) {
      const videoIdMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
      const embedId = videoIdMatch ? videoIdMatch[1] : src;
      return (
        <div key={key} className="my-8 rounded-xl overflow-hidden border shadow-sm">
          <iframe
            src={`https://www.youtube.com/embed/${embedId}`}
            title={embedId}
            loading="lazy"
            className="w-full h-[420px] bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <div key={key} className="my-8 rounded-xl overflow-hidden border shadow-sm bg-black">
        <video controls className="w-full h-auto max-h-[560px] bg-black" src={src}>
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={index} className={`leading-relaxed ${paragraphColor}`}>{block.text}</p>;
          case 'code':
            return <CodeBlock key={index} language={block.language} code={block.code} filename={block.id} />;
          case 'video':
            return renderVideo(block.src, index);
          case 'image':
            return (
              <figure key={index} className="my-8">
                <img src={block.src} alt={block.alt} className="w-full rounded-xl" />
                <figcaption className="text-sm text-slate-500 mt-2 italic">{block.alt}</figcaption>
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default function BlogViewer() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [article, setArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeArticles((items) => {
      setArticle(items.find((item) => item.id === slug) || null);
    });
    return () => unsubscribe();
  }, [slug]);

  useEffect(() => {
    if (article && article.isLocked) {
      setShowModal(true);
    }
  }, [article]);

  const mainStyles = theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-800';
  const metaStyles = theme === 'dark' ? 'text-neutral-400' : 'text-slate-500';

  if (!article) {
    return (
      <main className={`min-h-screen max-w-3xl mx-auto py-10 px-6 ${mainStyles}`}>
        <p className="text-lg">Article not found.</p>
        <Button text="Back to all blogs" icon={<ArrowLeft className="w-4 h-4" />} to="/blogs" variant="outline" className="mt-4 rounded-lg px-3 py-2 text-xs font-semibold" />
      </main>
    );
  }

  const contentBlocks = parseArticleContent(article.content, {
    embeddedCodes: article.embeddedCodes,
    embeddedImages: article.embeddedImages,
    embeddedVideos: article.embeddedVideos,
  });

  return (
    <main className={`min-h-screen max-w-3xl mx-auto py-10 px-6 ${mainStyles}`}>
      <div className="mb-8 flex justify-start">
        <Button text="Back to all blogs" icon={<ArrowLeft className="w-4 h-4" />} to="/blogs" variant="outline" className="rounded-lg px-3 py-2 text-xs font-semibold" />
      </div>

      <article className="pb-20">
        <figure className="mb-8 w-full">
          <img src={article.mediaUrl} alt={article.title} className="w-full rounded-xl object-cover" />
        </figure>

        <header className="mb-10">
          <h1 className="text-xl sm:text-3xl font-bold mb-4 leading-tight">{article.title}</h1>
          <div className={`flex flex-wrap items-center gap-4 text-sm ${metaStyles}`}>
            <span>{formatTimestamp(article.timestamp)}</span>
          </div>
        </header>

        <BlogContentRenderer content={contentBlocks} />
      </article>
      <PremiumModal open={showModal} onClose={() => setShowModal(false)} />
    </main>
  );
}
