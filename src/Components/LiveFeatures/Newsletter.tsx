"use client";
import { useTheme } from "../../contexts/ThemeContext";
import WhatsAppChat from "./WhatsAppChat";

export default function Newsletter() {
  const { theme } = useTheme();

  const sectionText = theme === "dark" ? "text-white" : "text-slate-800";

  return (
    <div className={`w-full max-w-5xl mx-auto p-6 mt-20 rounded-lg ${sectionText}`}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold shimmer-text">Let's Chat</h2>

          <div className="mt-1 flex flex-col items-start gap-4">
            <WhatsAppChat
              message="Hi Byrai, i need help..%0A%3E%20s.id/byrai"
              buttonText="Chat on WhatsApp"
              phoneNumber="+6285121579597"
              backgroundColor="#25d366"
              textColor="#ffffff"
              borderRadius={16}
              showIcon={true}
              iconOnly={false}
              size="medium"
              responsive={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
