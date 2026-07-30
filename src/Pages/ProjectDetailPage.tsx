import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Globe, Github } from "lucide-react";
import { Button } from "../Components/ui/Button";
import { useTheme } from "../contexts/ThemeContext";
import { normalizeSlug } from "../lib/articleUtils";
import { projects, type Project } from "../Components/Projects/Projects";

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { theme } = useTheme();

  const project = useMemo<Project | undefined>(() => {
    if (!slug) return undefined;
    return projects.find((item) => normalizeSlug(item.title) === slug);
  }, [slug]);

  const mainStyles = theme === "dark" ? "bg-black text-white" : "bg-white text-slate-800";
  const cardStyles = theme === "dark" ? "bg-zinc-950 border border-zinc-800" : "bg-white border border-slate-200";
  const textColor = theme === "dark" ? "text-white" : "text-slate-900";
  const subTextColor = theme === "dark" ? "text-zinc-400" : "text-slate-600";
  const badgeBg = theme === "dark" ? "bg-zinc-800 text-zinc-200" : "bg-slate-100 text-slate-700";

  if (!project) {
    return (
      <main className={`min-h-screen max-w-5xl mx-auto py-10 px-6 ${mainStyles}`}>
        <div className="mb-6">
          <Button text="Back to projects" icon={<ArrowLeft className="w-4 h-4" />} to="/projects" variant="outline" className="rounded-lg px-3 py-2 text-xs font-semibold" />
        </div>
        <div className="rounded-3xl border border-dashed border-slate-300/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Project not found</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">We couldn't find a project matching that URL. Please return to the project list.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen max-w-6xl mx-auto py-10 px-6 ${mainStyles}`}>
      <div className="mb-6">
        <Button text="Back to projects" icon={<ArrowLeft className="w-4 h-4" />} to="/projects" variant="outline" className="rounded-lg px-3 py-2 text-xs font-semibold" />
      </div>

      <section className="space-y-8">
        <div className="space-y-5">
          <p className={`text-sm font-medium uppercase tracking-[0.28em] ${subTextColor}`}>{project.category}</p>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor}`}>{project.title}</h1>
          <p className={`max-w-3xl text-sm leading-7 ${subTextColor}`}>{project.description}</p>
          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeBg}`}>{project.period}</span>
            {project.tags.map((tag) => (
              <span key={tag} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${theme === "dark" ? "bg-zinc-800 text-zinc-200" : "bg-slate-100 text-slate-700"}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={`rounded-3xl overflow-hidden shadow-xl ${cardStyles}`}>
          {project.video.src ? (
            <div className="relative bg-black aspect-[16/9]">
              <video className="w-full h-full object-cover" src={project.video.src} autoPlay loop muted playsInline />
            </div>
          ) : (
            <img src={project.imageLink} alt={project.title} className="w-full object-cover" />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className={`rounded-3xl border p-6 ${cardStyles}`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Project overview</h2>
              <p className={`${subTextColor} leading-relaxed`}>{project.description}</p>
            </div>

            {project.details?.overview && (
              <div className={`rounded-3xl border p-6 ${cardStyles}`}>
                <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Highlights</h2>
                <div className="space-y-3">
                  {project.details.overview.map((item) => (
                    <p key={item} className={`${subTextColor} leading-relaxed`}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {project.details?.links && (
              <div className={`rounded-3xl border p-6 ${cardStyles}`}>
                <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Links</h2>
                <div className="grid gap-3">
                  {project.details.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
                    >
                      <span>{link.label}</span>
                      <Globe className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className={`space-y-6 rounded-3xl border p-6 ${cardStyles}`}>
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Tech stack</h2>
              <div className="grid gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${theme === "dark" ? "bg-zinc-800 text-zinc-200" : "bg-slate-100 text-slate-700"}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {project.github?.url && (
              <a href={project.github.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900">
                <Github className="w-4 h-4" />
                {project.github.label}
              </a>
            )}

            {project.website.url && (
              <a href={project.website.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900">
                <Globe className="w-4 h-4" />
                {project.website.label}
              </a>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ProjectDetailPage;
