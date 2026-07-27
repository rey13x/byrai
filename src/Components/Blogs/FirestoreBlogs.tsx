import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Lock } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/Button";
import { type Article, formatTimestamp, subscribeArticles } from "../../lib/articleUtils";

export default function FirestoreBlogs({ limit = 2, showViewAll = true }: { limit?: number; showViewAll?: boolean }) {
  const { theme } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeArticles((items) => {
      setArticles(items);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const visible = articles.slice(0, limit);
  const headingColor = theme === "dark" ? "text-white" : "text-slate-900";
  const titleColor = theme === "dark" ? "text-white" : "text-slate-900";
  const descColor = theme === "dark" ? "text-gray-400" : "text-slate-600";
  const dateColor = theme === "dark" ? "text-gray-500" : "text-slate-500";

  return (
    <section className="py-5 w-full max-w-3xl mx-auto px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${headingColor}`}>Article</h2>
      </div>

      <div className="space-y-0">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 text-center text-sm text-slate-500 dark:text-zinc-400">
            Loading articles...
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 text-center text-sm text-slate-500 dark:text-zinc-400">
            No articles available yet.
          </div>
        ) : (
          visible.map((article, idx) => (
            <div key={article.id}>
              <Link to={`/article/${article.slug ?? article.id}`} className="flex items-start group cursor-pointer hover:opacity-95">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl flex items-center justify-center mr-5 mt-1 bg-transparent">
                  <img src={article.mediaUrl || ""} alt={article.title} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-semibold flex items-center gap-2 text-[15px] leading-tight tracking-tight ${titleColor}`}>
                      <span className="line-clamp-1">{article.title}</span>
                      {article.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                      <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 flex-shrink-0" />
                    </h3>
                  </div>
                  <div className={`text-[13px] mt-0.5 ${dateColor}`}>{formatTimestamp(article.timestamp)}</div>
                  <p className={`text-[14px] leading-snug tracking-tight mt-1.5 ${descColor}`}>{article.description}</p>
                </div>
              </Link>
              {idx < visible.length - 1 && <div className="border-b border-dashed border-gray-300 dark:border-zinc-800/80 my-6" />}
            </div>
          ))
        )}

      </div>

      {/* PremiumModal not used here; soft paywall is handled in the viewer */}

      {showViewAll && (
        <div className="mt-8 flex justify-end">
            <Button
            to="/article"
            text="View all Articles"
            icon={<ArrowUpRight className="h-4 w-4" />}
            variant="outline"
            className={`rounded-md px-5 py-2.5 text-sm font-medium transition-all ${theme === "dark"
              ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          />
        </div>
      )}
    </section>
  );
}
