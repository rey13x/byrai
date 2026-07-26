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
} from "react-icons/si";
import { FaCode } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";


type Skill = {
    name: string;
    icon: JSX.Element;
};

const skills: Skill[] = [
    { name: "C++", icon: <SiCplusplus size={14} /> },
    { name: "C#", icon: <FaCode size={14} /> },
    { name: "HTML", icon: <SiHtml5 size={14} /> },
    { name: "CSS", icon: <SiCss3 size={14} /> },
    { name: "JavaScript", icon: <SiJavascript size={14} /> },
    { name: "Python", icon: <SiPython size={14} /> },
    { name: "Node.js", icon: <SiNodedotjs size={14} /> },
    { name: "Docker", icon: <SiDocker size={14} /> },
    { name: "Nginx", icon: <SiNginx size={14} /> },
    { name: "Linux", icon: <SiLinux size={14} /> },
    { name: "GitHub Actions", icon: <SiGithubactions size={14} /> },
    { name: "React.js", icon: <SiReact size={14} /> },
    { name: "TailwindCSS", icon: <SiTailwindcss size={14} /> },
    { name: "Framer Motion", icon: <SiFramer size={14} /> },
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
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-default ${chipBg}`}
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

    return (
        <section className={`w-full max-w-4xl mx-auto p-6 ${sectionText} overflow-hidden`}>
            <h2 className={`text-2xl font-bold mb-8 ${headingColor}`}>Skills</h2>

            <div className="flex flex-col gap-6">
                <SkillRow skills={skills} />
            </div>
        </section>
    );
}
