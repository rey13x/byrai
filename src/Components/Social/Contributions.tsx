import { ArrowUpRight, ChevronRight, Globe } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

type Contribution = {
    repo: string;
    company: string;
    companyUrl: string;
    companyGithub: string;
    prUrl: string;
    prState: "open" | "closed";
    description: string;
    contribution: string;
    tags?: string[];
    period?: string;
    icon: { src: string; alt: string };
};

const contributions: Contribution[] = [
    {
        repo: "unipi",
        company: "Universitas Insan Pembangunan Indonesia",
        companyUrl: "https://s.id/enriquee",
        companyGithub: "https://s.id/enriquee",
        prUrl: "https://s.id/enriquee",
        prState: "closed",
        description: "Digital UMKM - Programming Olympiad 2026. Successfully completed the Programming Olympiad 2026 competition as part of a team consisting of 4 members. Throughout the competition, we developed a website centered on the UMKM (Small and Medium Enterprises) theme, specifically focusing on Arts and Talent sector.",
        contribution: "Website, Visual Studio Code",
        tags: ["Website", "Visual Studio Code"],
        period: "February 2026",
        icon: {
            src: "/images/Work/UNIPI.png",
            alt: "UNIPI",
        },
    },
    {
        repo: "kabtour",
        company: "Kabtour",
        companyUrl: "https://www.kabtour.com/",
        companyGithub: "https://www.kabtour.com/",
        prUrl: "",
        prState: "closed",
        description: "Completed a 6 month internship at PT Implementasi Teknologi Indonesia, contributing to the planning and development of the kabtour.com website as part of the web development team.",
        contribution: "Figma, Visual Studio Code",
        tags: ["Figma", "Visual Studio Code"],
        period: "January - July 2025",
        icon: {
            src: "/images/Work/kabtour.webp",
            alt: "Kabtour",
        },
    },
];

type ContributionsProps = {
    limit?: number;
    showViewAll?: boolean;
};

// Helper function to group contributions
const groupAndSortContributions = (items: Contribution[]) => {
    const groups: Record<string, Contribution[]> = {};

    items.forEach(item => {
        if (!groups[item.company]) {
            groups[item.company] = [];
        }
        groups[item.company].push(item);
    });

    // Convert to array and sort by latest contribution date
    return Object.entries(groups)
        .map(([company, items]) => {
            // Sort items within company by period (assuming month year string format) logic or index if period is same
            // For now, simpler approach: use the original order or period string comparison if simple
            // Let's assume the input list has some chronological order or we just keep as is
            return {
                company,
                items,
                // Get the period of the first item (assuming latest) for sorting groups
                latestPeriod: items[0]?.period || ""
            };
        })
        .sort((a, b) => {
            // Custom sort for "Month Year" strings if needed, or just rely on list order for now
            // Since the input has November 2025 and October 2025, string comparison works reversely or we parse date
            const dateA = new Date(a.latestPeriod);
            const dateB = new Date(b.latestPeriod);
            return dateB.getTime() - dateA.getTime();
        });
};

const SimpleTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-zinc-800 rounded-md shadow-lg border border-slate-700/50 dark:border-zinc-700 whitespace-nowrap z-50 pointer-events-none"
                    >
                        {content}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-zinc-800 border-r border-b border-slate-700/50 dark:border-zinc-700 transform rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Contributions = ({ limit, showViewAll = true }: ContributionsProps) => {
    const { theme } = useTheme();
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const allItems = useMemo(() => {
        return groupAndSortContributions(contributions);
    }, []);

    // Apply limit to groups NOT items, or maybe items?
    // User request implies showing orgs. If limit is 2, maybe show 2 orgs?
    // Or if limit is strictly for home page items list.
    // Given the refactor, let's limit by Groups for the main view if limit is present.
    const displayedGroups = typeof limit === "number" ? allItems.slice(0, limit) : allItems;


    const toggleGroup = (company: string) => {
        setExpandedGroups(prev => ({ ...prev, [company]: !prev[company] }));
    };

    const sectionText = theme === "dark" ? "text-white" : "text-slate-800";
    const borderColor = theme === "dark" ? "border-zinc-800" : "border-slate-400";
    const metaText = theme === "dark" ? "text-neutral-400" : "text-slate-500";
    const descriptionText = theme === "dark" ? "text-neutral-400" : "text-slate-600";
    const cardBorder = theme === "dark" ? "border-zinc-800" : "border-slate-400";

    const actionButton =
        theme === "dark"
            ? "bg-white text-black border border-neutral-200 hover:bg-neutral-100"
            : "bg-slate-900 text-white border border-slate-900 hover:bg-slate-800";


    return (
        <section className={`${sectionText} px-6 py-10 w-full mb-15 max-w-6xl mx-auto`}>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 shimmer-text">Contributions</h2>

            <div className={`relative ml-4 border-l ${borderColor} space-y-2`}>
                {displayedGroups.map((group) => {
                    const isExpanded = !!expandedGroups[group.company];
                    // The main item to display as the "Header" of the group (just for company info)
                    const headerItem = group.items[0];

                    return (
                        <div
                            key={group.company}
                            className="relative ml-10 group/card"
                            onMouseEnter={() => setExpandedGroups(prev => ({ ...prev, [group.company]: true }))}
                            onMouseLeave={() => setExpandedGroups(prev => ({ ...prev, [group.company]: false }))}
                        >
                            {/* Circle Icon */}
                            <div className="absolute -left-16 top-6 flex items-center justify-center">
                                <span className={`relative flex shrink-0 overflow-hidden rounded-full border bg-white h-12 w-12 ${cardBorder} z-10`}>
                                    <img
                                        src={headerItem.icon.src}
                                        alt={headerItem.icon.alt}
                                        className="h-full w-full object-contain"
                                    />
                                </span>
                            </div>

                            {/* Card Container */}
                            <div className={`py-6 pl-6 pr-4 relative ${cardBorder} border-b border-dashed mb-4`}>
                                {/* Group Header */}
                                <div className="flex flex-col gap-2">
                                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer group/header select-none"
                                            onClick={() => toggleGroup(group.company)}
                                        >
                                            <h3 className="text-base font-semibold leading-none group-hover/header:opacity-80 transition-opacity">
                                                {group.company}
                                            </h3>
                                            <div
                                                className={`p-1 rounded-full transition-all duration-200 opacity-70 group-hover/header:opacity-100 group-hover/header:bg-black/5 dark:group-hover/header:bg-white/10 ${isExpanded ? 'rotate-90' : ''}`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 sm:justify-self-end">
                                            <SimpleTooltip content="View Website">
                                                <a
                                                    href={headerItem.companyUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md shadow transition-colors ${actionButton}`}
                                                >
                                                    <Globe className="size-3" />
                                                    <span>Website</span>
                                                </a>
                                            </SimpleTooltip>
                                            {headerItem.period && (
                                                <time className={`text-xs font-medium ${metaText}`}>{headerItem.period}</time>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        href={headerItem.companyUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`relative inline-flex items-center gap-1 w-fit text-xs font-medium underline-offset-4 ${metaText} ${theme === "dark" ? "text-neutral-200" : "text-slate-700"}`}
                                    >
                                        {headerItem.company}
                                        <span className={`absolute -bottom-0.5 left-0 h-[1px] w-0 bg-current transition-all duration-500 ease-out group-hover/card:w-full`}></span>
                                    </a>
                                    <p className={`text-sm ${descriptionText}`}>{headerItem.description}</p>
                                </div>

                                {/* Collapsible Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`mt-4 pt-4 border-t border-dashed ${theme === "dark" ? "border-zinc-800" : "border-slate-300"} space-y-6`}>
                                                {group.items.map((item, idx) => (
                                                    <div key={idx} className="flex flex-col gap-3">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {item.tags?.map((tag) => (
                                                                <span key={tag} className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        {item.period && (
                                                            <span className={`text-[10px] ${metaText}`}>{item.period}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )
                })}
            </div>

            {showViewAll && (
                <div className="mt-8 flex justify-end">
                    <Button
                        text="View more contributions"
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        to="/contributions"
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
};

export default Contributions;
