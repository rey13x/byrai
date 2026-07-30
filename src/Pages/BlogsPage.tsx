import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getArticleSlug, subscribeArticles, type Article, formatTimestamp, normalizeArticleCategory, type ArticleCategory } from "../lib/articleUtils";
import { ChevronRight, ArrowLeft, Lock, BookOpen, ChevronDown } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../Components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogsPage() {
    const { theme } = useTheme();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const [activeCategory, setActiveCategory] = useState<"All" | ArticleCategory>("All");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        const unsubscribe = subscribeArticles(setArticles);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const blogsPerPage = 3;

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(articles.map((article) => normalizeArticleCategory(article.category))));
        return ["All", ...uniqueCategories] as Array<"All" | ArticleCategory>;
    }, [articles]);

    const filteredArticles = useMemo(() => {
        if (activeCategory === "All") return articles;
        return articles.filter((article) => normalizeArticleCategory(article.category) === activeCategory);
    }, [activeCategory, articles]);

    const totalPages = Math.max(1, Math.ceil(filteredArticles.length / blogsPerPage));

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);

    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = filteredArticles.slice(startIndex, endIndex);

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
    const tabContainerStyles = theme === "dark"
        ? "bg-zinc-800/50 border border-white/5"
        : "bg-slate-100 border border-slate-200";
    const faqItemStyles = theme === "dark"
        ? "border-zinc-800 bg-transparent"
        : "border-slate-200 bg-transparent";

    const accessRows = [
        {
            title: "User",
            access: "Read free articles",
            icon: <BookOpen className="w-4 h-4" />,
            description: "Browse public articles without a lock and explore available stories.",
        },
        {
            title: "Exclusive",
            access: "Unlock premium content",
            icon: <Lock className="w-4 h-4" />,
            description: "Unlock exclusive articles, enjoy deeper content, and create your own article.",
        },
    ];

    const faqs = [
        {
            question: "Do I need to install the app to read articles?",
            answer: "You can read and browse articles on this website, but activation and article creation are only available through the Pshh App.",
        },
        {
            question: "Can I create my own article from the web?",
            answer: "No. Creating your own article requires the Pshh App. The web is for browsing and discovery only.",
        },
        {
            question: "How do I activate a subscription?",
            answer: "Subscription activation is available through the Pshh App, with payment through QRIS. The app provides the full subscription experience.",
        },
    ];


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
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold shimmer-text ${headingStyles}`}>Articles</h1>
                </div>
            </div>

            <div className="mb-6 gs_reveal">
                <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                    <div className={`inline-flex min-w-max items-center p-0.5 rounded-md ${tabContainerStyles}`}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`relative px-2.5 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-[12px] font-medium rounded-md transition-colors z-10 whitespace-nowrap cursor-pointer ${activeCategory === category
                                    ? theme === "dark"
                                        ? "text-black"
                                        : "text-white"
                                    : theme === "dark"
                                        ? "text-neutral-400 hover:text-white"
                                        : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {activeCategory === category && (
                                    <motion.div
                                        layoutId="articleActiveTab"
                                        className={`absolute inset-0 rounded-md -z-10 ${theme === "dark" ? "bg-white" : "bg-slate-900"}`}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {category === "All" ? "All" : category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-0">
                {currentBlogs.map((blog, idx) => (
                    <div key={blog.id} className="gs_reveal">
                        <Link
                            to={`/article/${getArticleSlug(blog)}`}
                            className="flex items-start group cursor-pointer hover:opacity-95"
                        >
                                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl flex items-center justify-center mr-5 mt-1 bg-transparent relative">
                                {(() => {
                                    const thumb = blog.mediaUrl || blog.videoUrl || (blog.embeddedVideos && blog.embeddedVideos[0]);
                                    const isVideo = thumb && (thumb.includes('youtube.com') || thumb.includes('youtu.be') || thumb.endsWith('.mp4') || thumb.endsWith('.webm') || thumb.endsWith('.ogg') || thumb.endsWith('.mov'));
                                    if (isVideo) {
                                        if (thumb && (thumb.includes('youtube.com') || thumb.includes('youtu.be'))) {
                                            const match = thumb.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
                                            const id = match ? match[1] : thumb;
                                            return <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`} title={String(id)} loading="lazy" className="w-full h-full bg-black rounded-xl" allow="autoplay; encrypted-media" />
                                        }
                                        return <video autoPlay muted loop playsInline src={thumb || ''} className="w-full h-full object-cover rounded-xl" />
                                    }

                                    return <img src={blog.mediaUrl || ""} alt={blog.title} className="w-full h-full object-cover rounded-xl" />
                                })()}
                                { (blog.mediaUrl || blog.videoUrl || (blog.embeddedVideos && blog.embeddedVideos[0])) && (blog.mediaUrl?.includes('youtube.com') || blog.videoUrl?.includes('youtube.com') || (blog.embeddedVideos && blog.embeddedVideos[0] && (String(blog.embeddedVideos[0]).includes('youtube.com')) ) || (blog.mediaUrl?.endsWith('.mp4') || blog.videoUrl?.endsWith('.mp4'))) && (
                                    <VideoOverlayButton to={`/article/${blog.slug || blog.repo}`} isMuted={true} />
                                )}
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
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${theme === "dark" ? "bg-zinc-800/80 text-zinc-300" : "bg-slate-100 text-slate-700"}`}>
                                        {normalizeArticleCategory(blog.category)}
                                    </div>
                                    {blog.author && (
                                        <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${theme === "dark" ? "bg-zinc-900/90 text-zinc-400" : "bg-white text-slate-600 border border-slate-200"}`}>
                                            by {blog.author}
                                        </div>
                                    )}
                                </div>

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

            <div className="mt-6 gs_reveal rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl space-y-2">
                            <h2 className={`text-2xl sm:text-3xl font-semibold shimmer-text ${headingStyles}`}>Pshh App (Article)</h2>
                            <p className={`text-sm leading-6 ${descriptionStyles}`}>
                                Articles in this experience are divided into two access types. User content is available to browse freely, while Exclusive content unlocks deeper stories and the ability to create your own article.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300/80 dark:border-zinc-800">
                        <table className="min-w-full text-left text-sm border-separate border-spacing-0">
                            <thead className={`${theme === "dark" ? "bg-zinc-950/70 text-zinc-200" : "bg-slate-100 text-slate-700"}`}>
                                <tr>
                                    <th className="px-4 py-3 font-semibold border-b border-dashed border-slate-300 dark:border-zinc-700">Access</th>
                                    <th className="px-4 py-3 font-semibold border-b border-dashed border-slate-300 dark:border-zinc-700">What You Get</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dashed divide-slate-200 dark:divide-zinc-800">
                                {accessRows.map((row, index) => (
                                    <tr key={row.title} className={`${index % 2 === 0 ? (theme === "dark" ? "bg-zinc-900/50" : "bg-white/70") : (theme === "dark" ? "bg-zinc-950/40" : "bg-slate-50/80")}`}>
                                        <td className="px-4 py-4 align-top">
                                            <div className="flex items-center gap-2 font-semibold">
                                                {row.icon}
                                                <span>{row.title}</span>
                                            </div>
                                            <p className={`mt-2 text-xs ${metaStyles}`}>{row.access}</p>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <p className={`text-sm leading-6 ${descriptionStyles}`}>{row.description}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div id="subscription-packages" className={`border p-5 sm:p-6 ${theme === "dark" ? "border-zinc-800 bg-transparent" : "border-slate-200 bg-transparent"}`}>
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <p className={`text-sm leading-6 ${descriptionStyles}`}>
                                    Subscription packages are divided into several days, months, and years. Payment is completed through <span className="font-semibold shimmer-text text-base transition-transform duration-200 hover:scale-105">QRIS</span> and <span className="font-semibold shimmer-text text-base transition-transform duration-200 hover:scale-105">Pshh App</span>.
                                </p>
                                <p className={`text-sm leading-6 ${descriptionStyles}`}>
                                    Subscription activation and article creation are only available through the app. The web is for browsing and article discovery, while the Pshh App provides the full subscription and authoring experience.
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-3 lg:items-end">
                                <Button
                                    text="Downloads"
                                    href="https://klungkung.my.canva.site/pshh"
                                    newTab={true}
                                    variant="primary"
                                    className="rounded-full px-5 py-2.5 text-sm"
                                />
                                <p className={`text-xs opacity-70 ${metaStyles}`}>Install the app for a smoother writing experience.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className={`text-2xl sm:text-3xl font-semibold shimmer-text ${headingStyles}`}>FAQ</h3>
                        <div className="space-y-2">
                            {faqs.map((item, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div key={item.question} className={`rounded-2xl border ${faqItemStyles}`}>
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : index)}
                                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                                        >
                                            <span className={`text-sm font-medium ${headingStyles}`}>{item.question}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className={`px-4 pb-4 text-sm leading-6 ${descriptionStyles}`}>{item.answer}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
