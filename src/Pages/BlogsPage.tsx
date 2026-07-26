import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeArticles, type Article, formatTimestamp } from "../lib/articleUtils";
import { ChevronRight, ArrowLeft, Lock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../Components/ui/Button";

export default function BlogsPage() {
    const { theme } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const [showFlag, setShowFlag] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeArticles(setArticles);
        return () => unsubscribe();
    }, []);

    const blogsPerPage = 3;
    const totalPages = Math.ceil(articles.length / blogsPerPage);

    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = articles.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const mainStyles = theme === "dark" ? "bg-black text-white" : "bg-white text-slate-800";
    const headingStyles = theme === "dark" ? "text-white" : "text-slate-900";
    const titleStyles = theme === "dark" ? "text-white" : "text-slate-900";
    const descriptionStyles = theme === "dark" ? "text-gray-400" : "text-slate-600";
    const metaStyles = theme === "dark" ? "text-neutral-400" : "text-slate-500";
    const dateStyles = theme === "dark" ? "text-gray-500" : "text-slate-500";

    return (
            <main className={`min-h-screen max-w-3xl mx-auto py-10 px-6 ${mainStyles}`}>
                <div className="mb-15 flex justify-start gs_reveal">
                <Button
                    text="Back to home"
                    icon={<ArrowLeft className="w-3 h-3" />}
                    to="/"
                    variant="outline"
                    className="rounded-lg px-3 py-2 text-xs font-semibold"
                />
            </div>

            <div className="flex items-center justify-between mb-6 gs_reveal">
                <div className="relative flex items-center gap-3">
                    <h1 className={`text-xl font-bold ${headingStyles}`}>Article</h1>
                    <div className="relative">
                        <span
                            className="ml-2 text-lg font-semibold text-[#8B0000] cursor-pointer select-none"
                            onMouseEnter={() => setShowFlag(true)}
                            onMouseLeave={() => setShowFlag(false)}
                            onClick={() => setShowFlag((s) => !s)}
                        >
                            IND
                        </span>
                        <div className={`absolute left-full top-1/2 z-50 transform -translate-y-1/2 ml-2 transition-all ${showFlag ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <div className="text-2xl leading-none select-none">
                                <span className="inline-block animate-pulse">🇮🇩</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-0">
                {currentBlogs.map((blog, idx) => (
                    <div key={blog.id} className="gs_reveal">
                        <Link
                            to={`/blogs/${blog.id}`}
                            className="flex items-start group cursor-pointer hover:opacity-95"
                        >
                            <div className="w-24 h-24 flex-shrink-0 rounded-xl border border-slate-100 dark:border-gray-700 flex items-center justify-center p-1 mr-5 mt-1 shadow-sm">
                                <img src={blog.mediaUrl || ""} alt={blog.title} className="w-full h-full object-cover rounded-[0.4rem]" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className={`font-semibold flex items-center gap-2 text-[15px] leading-tight tracking-tight ${titleStyles}`}>
                                        <span className="line-clamp-1">{blog.title}</span>
                                        {blog.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                                        <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 flex-shrink-0" />
                                    </h3>
                                </div>

                                <div className={`text-[13px] mt-0.5 ${dateStyles}`}>{formatTimestamp(blog.timestamp)}</div>

                                <p className={`text-[14px] leading-snug tracking-tight mt-1.5 ${descriptionStyles}`}>
                                    {blog.description}
                                </p>
                            </div>
                        </Link>

                        {idx < currentBlogs.length - 1 && (
                            <div className="border-b border-dashed border-gray-300 dark:border-zinc-800/80 my-6" />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-dashed border-gray-300 dark:border-zinc-800/80 pt-6">
                <div className={`text-sm font-medium ${metaStyles}`}>
                    Page {currentPage} of {Math.max(1, totalPages)}
                </div>
                <div className="flex gap-3">
                    <Button
                        text="Previous"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm rounded-lg sm:px-4 sm:py-2"
                    />
                    <Button
                        text="Next"
                        variant="outline"
                        onClick={handleNext}
                        disabled={currentPage >= totalPages}
                        className="px-4 py-2 text-sm rounded-lg sm:px-4 sm:py-2"
                    />
                </div>
            </div>

        </main>
    );
}
