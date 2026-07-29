"use client";
import { useTheme } from "../../contexts/ThemeContext";
import WhatsAppChat from "./WhatsAppChat";

export default function Newsletter() {
  const { theme } = useTheme();

  return (
    <div className={`relative overflow-visible w-full max-w-5xl mx-auto p-6 mt-20 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
      <div className="flex flex-col gap-8 relative">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="inline-flex text-3xl sm:text-4xl md:text-5xl font-bold shimmer-text max-w-max">Let's Chat</h2>
            <div className="mt-1 flex flex-col items-start gap-4">
              <WhatsAppChat message="Hi Byrai, i need help..%0A%3E%20s.id/byrai" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
