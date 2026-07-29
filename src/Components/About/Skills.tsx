// Skills.tsx
import type { JSX } from "react";
import {
    SiJavascript,
    SiCplusplus,
    SiHtml5,
    SiCss3,
    SiPython,
    SiNodedotjs,
    SiDocker,
    SiNginx,
    SiGithubactions,
    SiLinux,
    SiReact,
    SiTailwindcss,
    SiFramer,
    SiFigma,
    SiCanva,
    SiPhp,
    SiKotlin,
    SiFlutter,
    SiArduino,
    SiAdobeaftereffects,
} from "react-icons/si";
import {
    FaCode,
    FaMusic,
    FaPaintBrush,
    FaMicrophone,
    FaCamera,
    FaTruck,
    FaFilm,
    FaMicrochip,
    FaServer,
    FaRobot,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";


type Skill = {
    name: string;
    icon: JSX.Element;
};

const softSkills: Skill[] = [
    { name: "Public Speaking", icon: <FaMicrophone size={14} /> },
    { name: "Supplier", icon: <FaTruck size={14} /> },
    { name: "Photographer", icon: <FaCamera size={14} /> },
    { name: "Design Graphics", icon: <FaPaintBrush size={14} /> },
    { name: "Videographer", icon: <FaFilm size={14} /> },
];

const designSkills: Skill[] = [
    { name: "Figma", icon: <SiFigma size={14} /> },
    { name: "Canva", icon: <SiCanva size={14} /> },
    { name: "After Effects", icon: <SiAdobeaftereffects size={14} /> },
    { name: "Alight Motion", icon: <FaFilm size={14} /> },
    { name: "Composer", icon: <FaMusic size={14} /> },
];

const technicalSkills: Skill[] = [
    { name: "C++", icon: <SiCplusplus size={14} /> },
    { name: "C#", icon: <FaCode size={14} /> },
    { name: "JavaScript", icon: <SiJavascript size={14} /> },
    { name: "Python", icon: <SiPython size={14} /> },
    { name: "PHP", icon: <SiPhp size={14} /> },
    { name: "Kotlin", icon: <SiKotlin size={14} /> },
    { name: "HTML", icon: <SiHtml5 size={14} /> },
    { name: "CSS", icon: <SiCss3 size={14} /> },
    { name: "Node.js", icon: <SiNodedotjs size={14} /> },
    { name: "React.js", icon: <SiReact size={14} /> },
    { name: "TailwindCSS", icon: <SiTailwindcss size={14} /> },
    { name: "Flutter", icon: <SiFlutter size={14} /> },
    { name: "Framer Motion", icon: <SiFramer size={14} /> },
    { name: "Docker", icon: <SiDocker size={14} /> },
    { name: "Nginx", icon: <SiNginx size={14} /> },
    { name: "Linux", icon: <SiLinux size={14} /> },
    { name: "GitHub Actions", icon: <SiGithubactions size={14} /> },
    { name: "Computer Vision", icon: <FaRobot size={14} /> },
    { name: "Baileys", icon: <FaCode size={14} /> },
];

const embeddedHardware: Skill[] = [
    { name: "Arduino", icon: <SiArduino size={14} /> },
    { name: "ESP32", icon: <FaMicrochip size={14} /> },
    { name: "VPS / Server", icon: <FaServer size={14} /> },
];

const languages: Skill[] = [
    {
        name: "Indonesian",
        icon: (
            <span
                aria-label="Indonesia flag"
                className="inline-flex"
                style={{ filter: "grayscale(1)" }}
            >
                🇮🇩
            </span>
        ),
    },
    {
        name: "English",
        icon: (
            <span
                aria-label="United Kingdom flag"
                className="inline-flex"
                style={{ filter: "grayscale(1)" }}
            >
                🇬🇧
            </span>
        ),
    },
    {
        name: "Philippines",
        icon: (
            <span
                aria-label="Philippines flag"
                className="inline-flex"
                style={{ filter: "grayscale(1)" }}
            >
                🇵🇭
            </span>
        ),
    },
];

const SkillRow = ({ skills }: { skills: Skill[] }) => {
    const { theme } = useTheme();
    const chipBg = theme === "dark"
        ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
        : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300";

    return (
        <div className="flex flex-wrap gap-4 py-2">
            {skills.map((skill) => (
                <div
                    key={skill.name}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-default whitespace-nowrap ${chipBg}`}
                >
                    <span className="flex items-center text-lg">
                        {skill.icon}
                    </span>
                    <span>{skill.name}</span>
                </div>
            ))}
        </div>
    );
};

export default function Skills() {
    const { theme } = useTheme();

    const headingColor = theme === "dark" ? "text-white" : "text-slate-900";
    const sectionText = theme === "dark" ? "" : "text-slate-700";
    const sectionLabelColor = theme === "dark" ? "text-slate-300" : "text-slate-500";

    return (
        <section className={`w-full max-w-4xl mx-auto p-6 ${sectionText} overflow-hidden`}>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-8 shimmer-text ${headingColor}`}>Skills</h2>

            <SkillRow skills={softSkills} />
            <SkillRow skills={designSkills} />

            <div className={`mt-6 mb-4 text-sm ${sectionLabelColor}`}>Programming Languages & Artificial Intelligence</div>
            <SkillRow skills={technicalSkills} />

            <div className={`mt-6 mb-4 text-sm ${sectionLabelColor}`}>Embedded & hardware</div>
            <SkillRow skills={embeddedHardware} />

            <div className={`mt-6 mb-4 text-sm ${sectionLabelColor}`}>Languages</div>
            <SkillRow skills={languages} />
        </section>
    );
}
