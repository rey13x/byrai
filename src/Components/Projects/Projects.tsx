import { Globe, Github, ArrowUpRight, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectModal from "./ProjectModal";

export type ProjectCategory = "Web2" | "Android";
export type CertificateItem = {
    id: number;
    title: string;
    image: string;
};

type ProjectCategoryTab = ProjectCategory | "All" | "Certificate";

type ProjectOrCertificate = Project | CertificateItem;

export const certificateItems: CertificateItem[] = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    title: `Certificate ${index + 1}`,
    image: `/images/Work/sertif${index + 1}.webp`,
}));

export type Project = {
    title: string;
    period: string;
    description: string;
    video: {
        src: string;
        autoPlay?: boolean;
        loop?: boolean;
        muted?: boolean;
        playsInline?: boolean;
        className?: string;
    };
    imageLink: string;
    tags: string[];
    website: { label: string; url: string };
    github?: { label: string; url: string };
    category: ProjectCategory;
    details?: {
        overview?: string[];
        links?: { label: string; url: string }[];
        gallery?: { label: string; url: string }[];
        sections?: {
            title: string;
            items: { title: string; description: string }[];
        }[];
        stack?: { label: string; value: string }[];
        snippet?: { title: string; code: string };
    };
};

const projects: Project[] = [
    {
        title: "OSIS Election at SMKN 2 Kota Bekasi",
        period: "January 2026",
        description:
            "A dedicated web-based student election platform for managing voting for OSIS candidates across 2,000 students, with real-time voting results and secure access flow.",
        video: {
            src: "/videos/pilos.mp4",
            autoPlay: true,
            loop: true,
            muted: false,
            playsInline: true,
            className: "h-40 w-full object-cover object-top rounded-t-lg",
        },
        imageLink: "/images/Work/pilos1.webp",
        tags: ["React", "HTML", "CSS", "JavaScript", "JWT", "MFA", "PowerShell", "Firestore", "Session & Cookies"],
        website: { label: "Visit Site", url: "https://pemilihan-osis-two.vercel.app/" },
        category: "Web2",
        details: {
            overview: [
                "This platform was built specifically for the student council election process at SMKN 2 Kota Bekasi. It is designed to support a large-scale voting event involving around 2,000 students and provide a secure and organized experience from candidate information to final voting.",
                "The workflow starts with reviewing candidate vision, mission, and profile information. After that, users enter a voting session using their NIS code, select their candidate, and complete the vote. Once the vote is submitted, the system records it and clears the access history so the next participant can continue smoothly.",
                "The site also includes a real-time voting dashboard so the result can be monitored immediately during the election process.",
            ],
            links: [
                { label: "Live Website", url: "https://pemilihan-osis-two.vercel.app/" },
            ],
            gallery: [
                { label: "Preview 1", url: "/images/Work/pilos1.webp" },
                { label: "Preview 2", url: "/images/Work/pilos2.webp" },
                { label: "Preview 3", url: "/images/Work/pilos3.webp" },
                { label: "Preview 4", url: "/images/Work/pilos4.webp" },
                { label: "Preview 5", url: "/images/Work/pilos5.webp" },
                { label: "Preview 6", url: "/images/Work/pilos6.webp" },
                { label: "Preview 7", url: "/images/Work/pilos7.webp" },
                { label: "Preview 8", url: "/images/Work/pilos8.webp" },
                { label: "Preview 9", url: "/images/Work/pilos9.webp" },
                { label: "Preview 10", url: "/images/Work/pilos10.webp" },
            ],
            sections: [
                {
                    title: "How it works",
                    items: [
                        { title: "Candidate Overview", description: "Students can read each candidate's vision, mission, and information before entering the voting session." },
                        { title: "Secure Voting Session", description: "Voting is accessed using the NIS code, which helps keep the process controlled and verified." },
                        { title: "One-Time Vote Flow", description: "After selecting a candidate, the vote is successfully recorded and the session access is reset for the next user." },
                        { title: "Real-Time Results", description: "The dashboard updates voting results instantly so organizers can monitor progress continuously." },
                    ],
                },
            ],
            stack: [
                { label: "Frontend", value: "React, HTML, CSS, and JavaScript for the interactive voting experience" },
                { label: "Authentication", value: "JWT-based authentication with MFA support for secure access" },
                { label: "Automation", value: "PowerShell for system-level automation and operational support" },
                { label: "Database", value: "Firestore for storing voting data and result updates" },
                { label: "Session Management", value: "Session and cookie-based handling for controlled access flow" },
            ],
        },
    },
    {
        title: "Enriquee",
        period: "February 2026",
        description:
            "A team that completed the 2026 UMKM Programmer Olympiad with the theme of advancing talented students in the arts by building a website in just 6 hours through live coding and monitoring.",
        video: {
            src: "/videos/enrique.mov",
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            className: "h-40 w-full object-cover object-top rounded-t-lg",
        },
        imageLink: "/images/Work/pilos1.webp",
        tags: ["Next.js", "TypeScript", "CSS", "JavaScript"],
        website: { label: "Visit Site", url: "https://enriquee-smkn-2-kota-bekasi-en7i.vercel.app/" },
        category: "Web2",
        details: {
            overview: [
                "Enriquee was created by a team that participated in the 2026 UMKM Programmer Olympiad with the goal of promoting talented students in the arts.",
                "We developed the website in a very short span of just 6 hours, with live coding and continuous monitoring throughout the process.",
                "The project focused on delivering a polished and engaging presentation while keeping the experience fast, clear, and accessible.",
            ],
            links: [
                { label: "Live Website", url: "https://enriquee-smkn-2-kota-bekasi-en7i.vercel.app/" },
            ],
            sections: [
                {
                    title: "Project Focus",
                    items: [
                        { title: "Fast Delivery", description: "The website was built within a very short timeline while still maintaining a strong visual and functional result." },
                        { title: "Live Coding", description: "The development process included real-time monitoring and live coding to ensure the experience stayed smooth and adaptive." },
                        { title: "Artistic Theme", description: "The project was centered around supporting and showcasing talented students with a creative and inspiring concept." },
                    ],
                },
            ],
            stack: [
                { label: "Framework", value: "Next.js" },
                { label: "Languages", value: "TypeScript and JavaScript" },
                { label: "Styling", value: "CSS" },
            ],
        },
    },
    {
        title: "Obrol+",
        period: "January 2026",
        description:
            "An innovative peer-to-peer messaging app designed to enable communication in areas without internet access by using Wi-Fi Direct technology.",
        video: {
            src: "",
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            className: "h-40 w-full object-cover object-top rounded-t-lg",
        },
        imageLink: "/images/Work/obrol.jpg",
        tags: ["P2P", "Offline", "Sockets", "Local Database", "Kotlin", "Kotlin DSL", "XML", "Markdown"],
        website: { label: "Visit Site", url: "https://obrol.my.canva.site/" },
        category: "Android",
        details: {
            overview: [
                "Obrol+ is a peer-to-peer messaging application built to provide reliable communication when conventional internet connectivity is unavailable.",
                "It creates a local network between nearby devices through Wi-Fi Direct, allowing users to send messages, share files, and make voice calls within close range.",
                "The app is especially useful for emergency communication, community events, outdoor activities, and digital inclusion in areas with weak or no internet coverage.",
            ],
            links: [
                { label: "Live Website", url: "https://obrol.my.canva.site/" },
            ],
            gallery: [
                { label: "Preview 1", url: "/images/Work/obrol1.jpg" },
                { label: "Preview 2", url: "/images/Work/obrol2.jpg" },
                { label: "Preview 3", url: "/images/Work/obrol3.jpg" },
                { label: "Preview 4", url: "/images/Work/obrol4.jpg" },
                { label: "Preview 5", url: "/images/Work/obrol5.jpg" },
                { label: "Preview 6", url: "/images/Work/obrol6.jpg" },
                { label: "Preview 7", url: "/images/Work/obrol7.jpg" },
                { label: "Preview 8", url: "/images/Work/obrol8.jpg" },
                { label: "Preview 9", url: "/images/Work/obrol9.jpg" },
                { label: "Preview 10", url: "/images/Work/obrol10.jpg" },
                { label: "Preview 11", url: "/images/Work/obrol11.jpg" },
                { label: "Preview 12", url: "/images/Work/obrol12.jpg" },
            ],
            sections: [
                {
                    title: "Purpose & Solution",
                    items: [
                        { title: "Emergency Communication", description: "Helps rescue teams or affected people stay coordinated when internet infrastructure goes down." },
                        { title: "Social Activities", description: "Supports community gatherings, outdoor events, and rural connectivity without depending on mobile signal or public Wi-Fi." },
                        { title: "Digital Inclusion", description: "Provides a basic and free communication tool for communities with limited internet access." },
                    ],
                },
                {
                    title: "Main Features",
                    items: [
                        { title: "Text Messaging", description: "Enables fast and reliable text communication between nearby devices." },
                        { title: "Media Sharing", description: "Allows users to send images and documents directly over the local network." },
                        { title: "Voice Calls", description: "Supports direct voice communication between connected devices." },
                        { title: "Local Message History", description: "Stores conversation history securely on the device for offline access." },
                    ],
                },
                {
                    title: "Application Limitations",
                    items: [
                        { title: "Limited Range", description: "The app is effective only within a short range of about 10-20 meters." },
                        { title: "Direct Connection Required", description: "Messages can only be sent when both devices are actively connected through Wi-Fi Direct." },
                        { title: "Not a Replacement", description: "It is designed as a complement to internet-based messaging, not a substitute for long-distance communication apps." },
                    ],
                },
            ],
            stack: [
                { label: "Communication", value: "P2P and offline-first messaging with sockets" },
                { label: "Storage", value: "Local database for message history and device-side persistence" },
                { label: "Language", value: "Kotlin with Kotlin DSL" },
                { label: "UI", value: "XML-based layout design" },
                { label: "Documentation", value: "Markdown-based project documentation" },
            ],
        },
    },
    {
        title: "Auto-Timetable",
        period: "December 2025",
        description:
            "A full-stack academic scheduling system that uses Google OR-Tools to generate conflict-free timetables across faculty availability, rooms, labs, batches, and curriculum constraints.",
        video: {
            src: "",
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            className: "h-40 w-full object-cover object-top rounded-t-lg",
        },
        imageLink: "/images/ProjectImage/auto-timetable.webp",
        tags: ["React 19", "Vite", "Tailwind CSS", "Node.js", "Express 5", "MongoDB", "FastAPI", "Google OR-Tools", "JWT"],
        website: { label: "Website", url: "" },
        github: { label: "GitHub", url: "https://github.com/SAYOUNCDR/auto-timetable" },
        category: "Web2",
        details: {
            overview: [
                "The TimeTable Management & Generation System automates academic scheduling for institutions that need to coordinate faculty, rooms, labs, subjects, and batches without manual conflict checking.",
                "Its scheduler service uses Google OR-Tools to solve constraint-heavy timetable generation, while the React dashboard gives admins, faculty, and students role-specific views of the final schedules.",
            ],
            links: [
                { label: "GitHub Repository", url: "https://github.com/SAYOUNCDR/auto-timetable" },
                { label: "Visual Guide", url: "https://mapmyrepo.vasudev.live/?user=SAYOUNCDR&repo=auto-timetable" },
                { label: "API Documentation", url: "https://github.com/SAYOUNCDR/auto-timetable/blob/main/docs/API-Documentation.md" },
            ],
            gallery: [
                { label: "Landing Page", url: "https://github.com/user-attachments/assets/7231f9c7-e979-4566-8b92-a16065fe8de9" },
                { label: "Admin Login", url: "https://github.com/user-attachments/assets/7ba7dbeb-8138-4d05-a571-cc5708345326" },
                { label: "Admin Dashboard", url: "https://github.com/user-attachments/assets/ea3338da-5f4d-43e4-ba4e-53e1ea632562" },
                { label: "Data Management", url: "https://github.com/user-attachments/assets/74470195-b2e5-4151-b995-0fa861b028e7" },
                { label: "Generator", url: "https://github.com/user-attachments/assets/154c7208-eb45-4945-8624-37ac56f4bc0a" },
                { label: "Generated Timetable", url: "https://github.com/user-attachments/assets/f140e2a5-a150-41ad-8b57-05ad7266c1ae" },
                { label: "Faculty View", url: "https://github.com/user-attachments/assets/9743a986-db22-4e8c-bf4a-cdc294d9ece5" },
                { label: "Student View", url: "https://github.com/user-attachments/assets/04fdc96c-5b62-4906-a3c5-483121ad0c5e" },
            ],
            sections: [
                {
                    title: "Key Features",
                    items: [
                        { title: "Automated Scheduling", description: "Generates conflict-free timetables with AI-assisted constraint programming instead of manual slot allocation." },
                        { title: "Role-Based Access", description: "Provides separate portals for admins, faculty, and students so each role gets the right operational view." },
                        { title: "Resource Management", description: "Manages classrooms, labs, subjects, batches, faculty, and other timetable inputs from one dashboard." },
                    ],
                },
                {
                    title: "Constraint Handling",
                    items: [
                        { title: "Faculty Availability", description: "Respects unavailable slots, teaching load limits, and assignment boundaries while generating schedules." },
                        { title: "Room and Lab Fit", description: "Accounts for room capacity, lab requirements, and resource availability before assigning sessions." },
                        { title: "Curriculum Requirements", description: "Balances subjects, batches, and academic structure so generated timetables match institutional rules." },
                    ],
                },
                {
                    title: "User Views",
                    items: [
                        { title: "Admin View", description: "Central dashboard for managing data, running the generator, and reviewing generated timetables." },
                        { title: "Faculty View", description: "Faculty-facing timetable view focused on teaching assignments and schedule visibility." },
                        { title: "Student View", description: "Student-facing schedule view for quickly checking batch-wise timetable information." },
                    ],
                },
            ],
            stack: [
                { label: "Client Layer", value: "React 19 SPA built with Vite and Tailwind CSS" },
                { label: "API Layer", value: "Node.js and Express 5 REST API for auth, business logic, and persistence" },
                { label: "Scheduler", value: "Python FastAPI service using Google OR-Tools for constraint solving" },
                { label: "Data Layer", value: "MongoDB with Mongoose for institutional data and generated schedules" },
                { label: "Auth", value: "JWT and bcrypt for secure authentication and authorization" },
            ],
            snippet: {
                title: "Local Setup",
                code: `cd backend
npm install
npm start

cd scheduler_core
python -m venv venv
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

cd frontend
npm install
npm run dev`,
            },
        },
    },
    {
        title: "ShorterLinku",
        period: "May 2025",
        description:
            "A simple URL shortener built to turn long links into short, clean links for easier sharing and tracking.",
        video: {
            src: "",
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            className: "h-40 w-full object-cover object-top rounded-t-lg",
        },
        imageLink: "/images/Work/slinku.webp",
        tags: ["Next.js", "Turso", "Drizzle", "NextAuth.js", "Upstash", "Tailwind CSS", "Shadcn UI", "Vercel"],
        website: { label: "Website", url: "https://slinku.vercel.app/" },
        category: "Web2",
        details: {
            overview: [
                "ShorterLinku is a lightweight link-shortening app designed for fast sharing with a clean and minimal experience.",
                "It takes a long URL, stores it securely, and returns a short alias that can be opened quickly by anyone.",
            ],
            links: [
                { label: "Live Website", url: "https://slinku.vercel.app/" },
            ],
            sections: [
                {
                    title: "How it works",
                    items: [
                        { title: "Create a short link", description: "Users paste a long URL and the app generates a short public link." },
                        { title: "Store and redirect", description: "The original URL is saved and mapped to a short slug for fast redirection." },
                        { title: "Share easily", description: "The short link can be shared anywhere without exposing the long original address." },
                    ],
                },
            ],
            stack: [
                { label: "Frontend", value: "Next.js with Tailwind CSS and Shadcn UI" },
                { label: "Database", value: "Turso with Drizzle ORM" },
                { label: "Auth", value: "NextAuth.js for secure access" },
                { label: "Caching", value: "Upstash for fast and efficient workflows" },
                { label: "Deployment", value: "Vercel" },
            ],
        },
    },
    {
        title: "Happy Birthday",
        period: "April 2026",
        description:
            "A heartfelt birthday greeting website built with GSAP animations to make the experience feel more immersive, romantic, and memorable.",
        video: {
            src: "",
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            className: "h-40 w-full object-cover object-top rounded-t-lg",
        },
        imageLink: "/images/Work/hbd.webp",
        tags: ["HTML", "SCSS", "JavaScript", "GSAP", "Vercel"],
        website: { label: "Website", url: "https://mylove-alpha-ten.vercel.app/" },
        category: "Web2",
        details: {
            overview: [
                "Happy Birthday is a romantic birthday greeting website designed to deliver a warm and memorable experience through animated storytelling.",
                "It uses GSAP to create smooth, expressive motion that makes the greeting feel more alive and emotional.",
            ],
            links: [
                { label: "Live Website", url: "https://mylove-alpha-ten.vercel.app/" },
            ],
            sections: [
                {
                    title: "What it offers",
                    items: [
                        { title: "Animated greeting", description: "The page uses GSAP to create elegant transitions and motion effects that feel modern and romantic." },
                        { title: "Birthday theme", description: "The visuals are designed to feel personal, warm, and celebratory for a special birthday moment." },
                    ],
                },
            ],
            stack: [
                { label: "Structure", value: "HTML" },
                { label: "Styling", value: "SCSS" },
                { label: "Interaction", value: "JavaScript and GSAP" },
                { label: "Deployment", value: "Vercel" },
            ],
        },
    },
];

type ProjectsProps = {
    limit?: number;
    showViewAll?: boolean;
    defaultTab?: ProjectCategoryTab;
};

const Projects = ({ limit, showViewAll = true, defaultTab = "All" }: ProjectsProps) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<ProjectCategoryTab>(defaultTab);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [previewGalleryItems, setPreviewGalleryItems] = useState<{ label: string; url: string }[]>([]);
    const [previewGalleryIndex, setPreviewGalleryIndex] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");

    const categories: ProjectCategoryTab[] = ["All", "Web2", "Android", "Certificate"];

    const filteredItems: ProjectOrCertificate[] = activeTab === "All"
        ? projects
        : activeTab === "Certificate"
            ? certificateItems
            : projects.filter(project => project.category === activeTab);

    const items = typeof limit === "number" ? filteredItems.slice(0, limit) : filteredItems;

    const sectionText = theme === "dark" ? "text-white" : "text-slate-800";
    const headingColor = theme === "dark" ? "text-white" : "text-slate-900";
    const cardStyles =
        theme === "dark"
            ? "text-white border border-zinc-800 bg-gradient-to-r from-zinc-900/80 via-zinc-900/60 to-black/20 hover:border-zinc-700"
            : "text-slate-800 border border-slate-200 bg-gradient-to-b from-white to-gray-50/50 hover:border-slate-300";
    const timeColor = theme === "dark" ? "text-neutral-400" : "text-slate-500";
    const activePeriodColor = theme === "dark" ? "text-amber-400" : "text-orange-600";
    const descriptionColor = theme === "dark" ? "text-neutral-400" : "text-slate-600";
    const tagStyles = theme === "dark" ? "bg-neutral-800 text-white" : "bg-white/80 text-slate-800 border border-slate-200";
    const actionButton =
        theme === "dark"
            ? "bg-white text-black border border-neutral-200 hover:bg-neutral-100"
            : "bg-slate-900 text-white border border-slate-900 hover:bg-slate-800";

    const tabContainerStyles = theme === "dark"
        ? "bg-zinc-800/50 border border-white/5"
        : "bg-slate-100 border border-slate-200";

    const openProjectDetails = (project: Project) => {
        setSelectedProject(project);
        setIsPreviewOpen(false);

        requestAnimationFrame(() => {
            const videos = document.querySelectorAll<HTMLVideoElement>(`video[data-project-video="${project.title}"]`);

            videos.forEach((video) => {
                video.currentTime = 0;
                video.volume = 1;
                video.playbackRate = 1;
                video.muted = true;
                video.play().catch(() => undefined);
            });
        });
    };

    const openPreviewGallery = (items: { label: string; url: string }[], startIndex = 0, title = "") => {
        setPreviewGalleryItems(items);
        setPreviewGalleryIndex(startIndex);
        setPreviewTitle(title);
        setIsPreviewOpen(true);
    };

    const openCertificatePreview = (certificate: CertificateItem) => {
        openPreviewGallery([{ label: certificate.title, url: certificate.image }], 0, certificate.title);
    };

    const goToPreviousPreview = () => {
        setPreviewGalleryIndex((prev) => (prev > 0 ? prev - 1 : previewGalleryItems.length - 1));
    };

    const goToNextPreview = () => {
        setPreviewGalleryIndex((prev) => (prev < previewGalleryItems.length - 1 ? prev + 1 : 0));
    };

    return (
        <section className={`${sectionText} px-6 py-10`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <h2 className={`text-xl font-bold ${headingColor}`}>Projects & Certificate</h2>

                    <div className="overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 scrollbar-none">
                        <div className={`inline-flex items-center p-1 rounded-md ${tabContainerStyles}`}>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveTab(category)}
                                    className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors z-10 whitespace-nowrap cursor-pointer ${activeTab === category
                                        ? theme === "dark"
                                            ? "text-black"
                                            : "text-white"
                                        : theme === "dark"
                                            ? "text-neutral-400 hover:text-white"
                                            : "text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    {activeTab === category && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 rounded-md -z-10 ${theme === "dark" ? "bg-white" : "bg-slate-900"
                                                }`}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {category === "All" ? "All" : category === "Web2" ? "Web2" : category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {items.map((item) => {
                        const isCertificate = (value: ProjectOrCertificate): value is CertificateItem => 'image' in value && !('category' in value);

                        if (isCertificate(item)) {
                            return (
                                <div
                                    key={`cert-${item.id}`}
                                    onClick={() => openCertificatePreview(item)}
                                    onContextMenu={(e) => e.preventDefault()}
                                    className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:shadow-lg h-64 cursor-pointer ${cardStyles}`}
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/25 transition duration-300 group-hover:bg-black/35" />
                                    <div className="relative z-10 flex h-full flex-col justify-end p-4">
                                        <span className="text-sm font-semibold text-white drop-shadow-md">{item.title}</span>
                                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/80">Certificate</span>
                                    </div>
                                </div>
                            );
                        }

                        const project = item;

                        return (
                            <div
                                key={project.title}
                                onClick={() => openProjectDetails(project)}
                                className={`rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out hover:shadow-lg h-full cursor-pointer ${cardStyles}`}
                            >
                                {project.video.src ? (
                                    <video
                                        data-project-video={project.title}
                                        src={project.video.src}
                                        autoPlay={project.video.autoPlay}
                                        loop={project.video.loop}
                                        muted={project.video.muted ?? false}
                                        playsInline={project.video.playsInline}
                                        preload="metadata"
                                        className={project.video.className}
                                    />
                                ) : (
                                    <div className={`h-40 w-full flex items-center justify-center ${theme === 'dark' ? 'bg-neutral-900' : 'bg-slate-100'}`}>
                                        {project.imageLink ? (
                                            <img
                                                src={project.imageLink}
                                                alt={project.title}
                                                className="h-full w-full object-contain object-center bg-white/50"
                                            />
                                        ) : (
                                            <div className="text-sm opacity-50 font-semibold">{project.category}</div>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col px-3 py-2">
                                    <h3 className="font-semibold tracking-tight text-base mt-1 pb-2">{project.title}</h3>
                                    <time className={`text-xs pb-2 ${project.period === "In Progress" ? activePeriodColor : timeColor}`}>{project.period}</time>
                                    <p className={`text-xs mt-1 ${descriptionColor}`}>{project.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-1 px-3 pb-5 pt-8 mt-auto">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${tagStyles}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between px-3 pb-3">
                                    <div className="flex items-center gap-2">
                                        {project.github?.url && (
                                            <a
                                                href={project.github.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md shadow transition-colors ${actionButton}`}
                                            >
                                                <Github className="size-3" />
                                                <span>{project.github.label}</span>
                                            </a>
                                        )}

                                        {project.website.url ? (
                                            <a
                                                href={project.website.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md shadow transition-colors ${actionButton}`}
                                            >
                                                <Globe className="size-3" />
                                                <span>{project.website.label}</span>
                                            </a>
                                        ) : (
                                            <button
                                                disabled
                                                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md shadow transition-colors opacity-50 cursor-not-allowed ${theme === "dark" ? "bg-neutral-800 text-neutral-500 border border-neutral-700" : "bg-slate-100 text-slate-400 border border-slate-200"}`}
                                            >
                                                <Globe className="size-3" />
                                                <span>{project.website.label}</span>
                                            </button>
                                        )}
                                    </div>

                                    <Button
                                        text="Details"
                                        icon={<Eye className="size-3" />}
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openProjectDetails(project);
                                        }}
                                        className="rounded-md px-2 py-1 text-[10px] font-semibold"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <ProjectModal
                    project={selectedProject}
                    isOpen={!!selectedProject}
                    onClose={() => {
                        setSelectedProject(null);
                        setIsPreviewOpen(false);
                    }}
                    onOpenGallery={openPreviewGallery}
                />

                <AnimatePresence>
                    {isPreviewOpen && previewGalleryItems.length > 0 && (
                        <motion.div
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-black/60"
                                onClick={() => {
                                    setIsPreviewOpen(false);
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />

                            <motion.div
                                className="relative w-full max-w-[760px] max-h-[82vh] rounded-[32px] overflow-hidden bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <button
                                    onClick={() => {
                                        setIsPreviewOpen(false);
                                    }}
                                    className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                {previewGalleryItems.length > 1 && (
                                    <>
                                        <button
                                            onClick={goToPreviousPreview}
                                            className="absolute left-4 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={goToNextPreview}
                                            className="absolute right-12 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                )}

                                <div className="relative flex h-full w-full items-center justify-center bg-transparent p-4">
                                    <div className="flex max-h-[72vh] w-full max-w-[640px] items-center justify-center rounded-[24px] bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
                                        <img
                                            src={previewGalleryItems[previewGalleryIndex]?.url}
                                            alt={previewTitle || previewGalleryItems[previewGalleryIndex]?.label || "Preview"}
                                            className="max-h-[70vh] w-full object-contain rounded-[20px]"
                                            onDragStart={(e) => e.preventDefault()}
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                    </div>
                                </div>

                                {previewGalleryItems[previewGalleryIndex] && (
                                    <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1.5 text-sm font-medium text-white">
                                        {previewTitle || previewGalleryItems[previewGalleryIndex].label}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {showViewAll && (
                    <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                        <Button
                            text="View certificates"
                            icon={<ArrowUpRight className="h-4 w-4" />}
                            to="/certificates"
                            variant="outline"
                            className={`rounded-md px-5 py-2.5 text-sm font-medium transition-all ${theme === "dark"
                                ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                                : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                        />
                        <Button
                            text="View more projects"
                            icon={<ArrowUpRight className="h-4 w-4" />}
                            to="/projects"
                            variant="outline"
                            className={`rounded-md px-5 py-2.5 text-sm font-medium transition-all ${theme === "dark"
                                ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                                : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
