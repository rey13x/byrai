"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { SendHorizonal } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabaseClient";
import WhatsAppChat from "./WhatsAppChat";
import StickyNote from "./StickyNote";

type NoteItem = {
  id: string;
  text: string;
  theme: "yellow" | "green" | "blue";
  createdAt: number;
  position: { x: number; y: number };
  deviceId?: string;
};

const NOTE_THEMES: NoteItem["theme"][] = ["yellow", "green", "blue"];
const EXPIRY_MS = 24 * 60 * 60 * 1000;
const NOTE_TEXT_MAX_LENGTH = 10;
const NOTE_DEVICE_ID_KEY = "give-me-word-device-id";
const NOTE_MAX_PER_DEVICE = 3;

function getDeviceId() {
  if (typeof window === "undefined") return null;
  let deviceId = window.localStorage.getItem(NOTE_DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(NOTE_DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

function getJakartaNow() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    }),
  );
}

function getNoteSize(text: string) {
  const length = Math.max(10, text.length);
  const width = Math.min(260, Math.max(180, length * 10 + 70));
  const height = Math.min(260, Math.max(160, 100 + Math.ceil(length / 16) * 22));
  return { width, height };
}

async function fetchSharedNotes() {
  if (!supabase) {
    console.warn("Supabase client not available; shared notes disabled.");
    return [];
  }

  const { data, error } = await supabase
    .from("notes")
    .select("id, text, theme, created_at, position_x, position_y, device_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error fetching notes:", error);
    return [];
  }

  const nowJakarta = getJakartaNow().getTime();
  return (data || [])
    .map((row: any) => ({
      id: String(row.id),
      text: row.text,
      theme: row.theme,
      createdAt: new Date(row.created_at).getTime(),
      position: {
        x: row.position_x ?? 24,
        y: row.position_y ?? 24,
      },
      deviceId: row.device_id || undefined,
    }))
    .filter((note) => note.createdAt + EXPIRY_MS > nowJakarta);
}

export default function Newsletter() {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sectionText = theme === "dark" ? "text-white" : "text-slate-800";

  useEffect(() => {
    const loadNotes = async () => {
      const sharedNotes = await fetchSharedNotes();
      setNotes(sharedNotes);
    };

    loadNotes();
  }, []);

  const orderedNotes = useMemo(() => notes, [notes]);

  const shellStyles = theme === "dark"
    ? "bg-zinc-900/75 border border-zinc-700 text-zinc-100 shadow-[inset_4px_4px_12px_rgba(0,0,0,0.6),inset_-4px_-4px_12px_rgba(160,160,170,0.18)]"
    : "bg-white/85 border border-slate-200 text-slate-700 shadow-[inset_6px_6px_16px_rgba(148,163,184,0.25),inset_-6px_-6px_16px_rgba(255,255,255,0.85)]";

  const inputStyles = theme === "dark"
    ? "placeholder:text-zinc-500 text-zinc-100"
    : "placeholder:text-slate-400 text-slate-700";

  const buttonStyles = theme === "dark"
    ? "text-zinc-200 hover:text-emerald-400"
    : "text-slate-600 hover:text-emerald-500";

  const addNote = async (value: string) => {
    const text = value.trim();
    if (!text) {
      setErrorMessage("Please enter a word to create a note.");
      return;
    }

    if (text.length > NOTE_TEXT_MAX_LENGTH) {
      setErrorMessage(`Teks maksimal ${NOTE_TEXT_MAX_LENGTH} karakter.`);
      return;
    }

    setErrorMessage(null);
    const deviceId = getDeviceId();
    if (!deviceId) {
      setErrorMessage("Unable to create note: device identifier unavailable.");
      return;
    }

    const ownNotesCount = notes.filter((note) => note.deviceId === deviceId).length;
    if (ownNotesCount >= NOTE_MAX_PER_DEVICE) {
      setErrorMessage("You already have 3 notes. Remove one to add another.");
      return;
    }

    const nextTheme = NOTE_THEMES[Math.floor(Math.random() * NOTE_THEMES.length)];
    const baseOffset = notes.length * 12;

    if (!supabase) {
      const createdAt = Date.now();
      const newNote: NoteItem = {
        id: `note-${createdAt}`,
        text,
        theme: nextTheme,
        createdAt,
        position: { x: 24 + baseOffset, y: 24 + baseOffset },
        deviceId,
      };
      setNotes((prev) => [newNote, ...prev]);
      setInputValue("");
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          text,
          theme: nextTheme,
          position_x: 24 + baseOffset,
          position_y: 24 + baseOffset,
          device_id: deviceId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      const errorText = error.message || "Unknown Supabase error.";
      const hint = errorText.includes("row-level security")
        ? "Enable public insert policy for notes in Supabase."
        : errorText;
      setErrorMessage(`Unable to save note. ${hint}`);
      return;
    }

    if (data) {
      const savedNote: NoteItem = {
        id: data.id,
        text: data.text,
        theme: data.theme,
        createdAt: new Date(data.created_at).getTime(),
        position: { x: data.position_x ?? 24, y: data.position_y ?? 24 },
        deviceId,
      };
      setNotes((prev) => [savedNote, ...prev]);
      setInputValue("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addNote(inputValue);
  };

  const handleDragEnd = async (id: string, info: { offset: { x: number; y: number } }) => {
    const currentNote = notes.find((note) => note.id === id);
    if (!currentNote) return;

    const targetX = currentNote.position.x + info.offset.x;
    const targetY = currentNote.position.y + info.offset.y;
    const leftThreshold = -160;
    const rightThreshold = window.innerWidth + 160;
    const deviceId = getDeviceId();

    if (targetX < leftThreshold || targetX > rightThreshold) {
      if (currentNote.deviceId !== deviceId) {
        setErrorMessage("You can only delete your own notes.");
        return;
      }

      setNotes((current) => current.filter((note) => note.id !== id));

      if (supabase) {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete error:", error);
          setErrorMessage("Unable to delete note. Please try again.");
        }
      }

      return;
    }

    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              position: {
                x: targetX,
                y: targetY,
              },
            }
          : note,
      ),
    );

    if (!supabase) return;
    const { error } = await supabase
      .from("notes")
      .update({ position_x: targetX, position_y: targetY })
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      setErrorMessage(
        `Unable to save note position: ${error.message || "check your notes table and Supabase env vars."}`,
      );
    }
  };

  return (
    <div className={`relative overflow-visible w-full max-w-5xl mx-auto p-6 mt-20 ${sectionText}`}>
      <div className="absolute inset-0 pointer-events-none">
        {orderedNotes.length === 0 ? null : null}

        {orderedNotes.map((note, index) => {
          const stackScale = Math.max(0.85, 1 - index * 0.04);
          const stackZ = orderedNotes.length - index;
          return (
            <motion.div
              key={note.id}
              drag
              dragElastic={0.45}
              dragMomentum={true}
              whileDrag={{ scale: 1.02, rotate: 2 }}
              onDragEnd={(_, info) => handleDragEnd(note.id, info)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, x: note.position.x, y: note.position.y, scale: stackScale }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              style={{
                position: "absolute",
                width: getNoteSize(note.text).width,
                height: getNoteSize(note.text).height,
                zIndex: stackZ,
                cursor: "grab",
                touchAction: "none",
                pointerEvents: "auto",
              }}
            >
              <StickyNote
                text={note.text}
                theme={note.theme}
                textColor="#050505"
                textAlign="left"
                verticalAlign="flex-start"
                font={{ fontSize: 14, lineHeight: 1.5, fontFamily: "Permanent Marker, sans-serif" }}
              />
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-col gap-8 relative">
        <div className="flex flex-col gap-4 -mt-24">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Give me a Word</h2>
            <span className="text-[3rem] leading-none" style={{ transform: "rotate(16deg)" }}>
              ✌️
            </span>
          </div>
          <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Type a word or idea and watch colorful notes appear. Notes expire after 24 hours.
          </p>
          <form onSubmit={handleSubmit} className="max-w-[260px] w-full">
            <label className="sr-only" htmlFor="word-input">
              Add a new sticky note
            </label>
            <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs backdrop-blur-md ${shellStyles}`}>
              <input
                id="word-input"
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addNote(inputValue);
                  }
                }}
                placeholder="Type a word or idea..."
                className={`w-full bg-transparent outline-none ${inputStyles}`}
              />
              <button
                type="submit"
                className={`flex h-7 w-7 items-center justify-center transition ${buttonStyles}`}
                aria-label="Create note"
              >
                <SendHorizonal className="h-3.5 w-3.5 -rotate-40 transition-transform" />
              </button>
            </div>
            {errorMessage ? (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            ) : null}
          </form>
        </div>

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
    </div>
  );
}
