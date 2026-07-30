import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../Components/ui/Button";
import { useTheme } from "../contexts/ThemeContext";
import { normalizeSlug } from "../lib/articleUtils";
import { certificateItems, type CertificateItem } from "../Components/Projects/Projects";

const CertificateDetailPage = () => {
  const { slug } = useParams();
  const { theme } = useTheme();

  const certificate = useMemo<CertificateItem | undefined>(() => {
    if (!slug) return undefined;
    return certificateItems.find((item) => normalizeSlug(item.title) === slug);
  }, [slug]);

  const mainStyles = theme === "dark" ? "bg-black text-white" : "bg-white text-slate-800";
  const cardStyles = theme === "dark" ? "bg-zinc-950 border border-zinc-800" : "bg-white border border-slate-200";
  const textColor = theme === "dark" ? "text-white" : "text-slate-900";
  const subTextColor = theme === "dark" ? "text-zinc-400" : "text-slate-600";

  if (!certificate) {
    return (
      <main className={`min-h-screen max-w-5xl mx-auto py-10 px-6 ${mainStyles}`}>
        <div className="mb-6">
          <Button text="Back to certificates" icon={<ArrowLeft className="w-4 h-4" />} to="/certificates" variant="outline" className="rounded-lg px-3 py-2 text-xs font-semibold" />
        </div>
        <div className="rounded-3xl border border-dashed border-slate-300/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Certificate not found</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">We couldn't find a certificate matching that URL. Please return to the certificate list.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen max-w-5xl mx-auto py-10 px-6 ${mainStyles}`}>
      <div className="mb-6">
        <Button text="Back to certificates" icon={<ArrowLeft className="w-4 h-4" />} to="/certificates" variant="outline" className="rounded-lg px-3 py-2 text-xs font-semibold" />
      </div>

      <section className="space-y-8">
        <div className={`rounded-3xl border p-6 ${cardStyles}`}>
          <div className="space-y-5">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor}`}>{certificate.title}</h1>
            <p className={`text-sm leading-7 ${subTextColor}`}>This certificate is available as proof of participation or achievement. View it in full resolution below.</p>
          </div>
        </div>

        <div className={`rounded-3xl overflow-hidden shadow-xl ${cardStyles}`}>
          <img src={certificate.image} alt={certificate.title} className="w-full h-auto object-contain" />
        </div>
      </section>
    </main>
  );
};

export default CertificateDetailPage;
