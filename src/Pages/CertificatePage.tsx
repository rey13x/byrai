import { ArrowLeft } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../Components/ui/Button";
import Projects from "../Components/Projects/Projects";

const CertificatePage = () => {
  const { theme } = useTheme();
  const mainStyles = theme === "dark" ? "bg-black text-white" : "bg-white text-slate-800";

  return (
    <main className={`min-h-screen mx-auto max-w-3xl ${mainStyles}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 gs_reveal">
        <div className="ml-4 self-start gs_reveal">
          <Button
            text="Back to home"
            icon={<ArrowLeft className="h-4 w-4" />}
            to="/"
            variant="outline"
            className="rounded-lg px-3 py-2 text-xs font-semibold"
          />
        </div>

        <div className="gs_reveal"><Projects showViewAll={false} defaultTab="Certificate" /></div>
      </div>
    </main>
  );
};

export default CertificatePage;
