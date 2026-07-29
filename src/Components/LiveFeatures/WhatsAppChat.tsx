"use client";
import { useState, useEffect } from "react";

type WhatsAppChatProps = {
  message?: string;
  phoneNumber?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  showIcon?: boolean;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large" | "x-large";
  responsive?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeConfig = {
  small: { padding: "8px 16px", iconSize: 16, gap: "6px", fontSize: "14px", iconOnlyPadding: "8px" },
  medium: { padding: "12px 20px", iconSize: 20, gap: "8px", fontSize: "16px", iconOnlyPadding: "12px" },
  large: { padding: "16px 24px", iconSize: 24, gap: "10px", fontSize: "18px", iconOnlyPadding: "16px" },
  "x-large": { padding: "20px 32px", iconSize: 28, gap: "12px", fontSize: "20px", iconOnlyPadding: "20px" },
};

type ChatSize = "small" | "medium" | "large" | "x-large";

const responsiveMapping: Record<"mobile" | "tablet" | "desktop", Record<ChatSize, ChatSize>> = {
  mobile: { small: "small", medium: "small", large: "medium", "x-large": "medium" },
  tablet: { small: "small", medium: "medium", large: "medium", "x-large": "large" },
  desktop: { small: "small", medium: "medium", large: "large", "x-large": "x-large" },
};

const normalizePhoneNumber = (phoneNumber: string) => phoneNumber.replace(/[^\d+]/g, "");

export default function WhatsAppChat({
  message = "Hello! I'm interested in your work.",
  phoneNumber = "+6285121579597",
  buttonText = "Chat on WhatsApp",
  backgroundColor = "#25d366",
  textColor = "#ffffff",
  borderRadius = 12,
  showIcon = true,
  iconOnly = false,
  size = "medium",
  responsive = true,
  style,
  ...buttonProps
}: WhatsAppChatProps) {
  const [screenSize, setScreenSize] = useState("desktop");

  useEffect(() => {
    if (!responsive || typeof window === "undefined") return;
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, [responsive]);

  const currentSize = sizeConfig[responsive ? responsiveMapping[screenSize as keyof typeof responsiveMapping][size] : size];

  const handleClick = () => {
    if (typeof window === "undefined") return;
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = normalizePhoneNumber(phoneNumber);
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const isFixedWidth = style?.width === "100%";

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        ...style,
        ...(isFixedWidth ? { ...style } : { minWidth: "max-content" }),
        backgroundColor,
        color: textColor,
        borderRadius,
        border: "none",
        padding: iconOnly ? currentSize.iconOnlyPadding : currentSize.padding,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: iconOnly ? "center" : "flex-start",
        gap: showIcon && !iconOnly ? currentSize.gap : "0px",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontSize: currentSize.fontSize,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0px)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      {...buttonProps}
    >
      {(showIcon || iconOnly) && (
        <svg
          width={currentSize.iconSize}
          height={currentSize.iconSize}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ flexShrink: 0 }}
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
        </svg>
      )}
      {!iconOnly && <span>{buttonText}</span>}
    </button>
  );
}
