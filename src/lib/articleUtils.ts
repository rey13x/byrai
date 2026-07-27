import { db } from "./firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export type EmbeddedCode = {
  content: string;
  title?: string;
} | string;

export type Article = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  timestamp: number;
  mediaUrl: string;
  content: string;
  embeddedCodes?: EmbeddedCode[];
  embeddedImages?: string[];
  embeddedVideos?: string[];
  videoUrl?: string;
  isLocked?: boolean;
  category?: string;
};

export type ArticleCard = Pick<Article, "id" | "title" | "description" | "mediaUrl" | "timestamp"> & {
  formattedDate: string;
};

export type ParsedArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; code: string; id: string }
  | { type: "video"; src: string; id: string }
  | { type: "image"; src: string; alt: string; id: string };

const placeholderRegex = /\[(VIDEO|CODE|FOTO)_(\d+)\]/g;

const codeLibrary: Record<string, { language: string; code: string }> = {
  "1": {
    language: "javascript",
    code: `// Example code block for [CODE_1]
function sayHello() {
  console.log('Hello from Pshh article');
}
sayHello();`
  },
  "2": {
    language: "javascript",
    code: `// Example second code block for [CODE_2]
const user = {
  name: 'byrai',
  role: 'AI Developer'
};
console.table(user);`
  }
};

const videoLibrary: Record<string, string> = {
  "1": "dQw4w9WgXcQ",
  "2": "kJQP7kiw5Fk"
};

const imageLibrary: Record<string, string> = {
  "1": "https://via.placeholder.com/1200x675?text=FOTO+1",
  "2": "https://via.placeholder.com/1200x675?text=FOTO+2"
};

const getFormattedDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(date);
};

const detectCodeLanguage = (code: string, title?: string) => {
  const lowerTitle = title?.toLowerCase() ?? "";
  const lower = code.toLowerCase();
  if (lowerTitle.includes("html") || lower.includes("<!doctype html") || lower.includes("<html")) return "html";
  if (lowerTitle.includes("bash") || lowerTitle.includes("shell") || lower.includes("pkg") || lower.includes("apt") || lower.includes("ssh") || lower.includes("npm") || lower.includes("curl")) return "bash";
  if (lowerTitle.includes("python") || lower.includes("def ") || lower.includes("import ")) return "python";
  if (lower.includes("console.log") || lower.includes("function ") || lower.includes("const ") || lower.includes("let ") || lower.includes("=>")) return "javascript";
  return "bash";
};

export const parseArticleContent = (
  content: string,
  assets?: {
    embeddedCodes?: EmbeddedCode[];
    embeddedImages?: string[];
    embeddedVideos?: string[];
  }
) => {
  const result: ParsedArticleBlock[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const toCode = (index: number, placeholder: string) => {
    const entry = assets?.embeddedCodes?.[index];
    const code = typeof entry === "string" ? entry : entry?.content;
    const title = typeof entry === "object" && entry !== null ? entry.title : undefined;

    return {
      type: "code" as const,
      language: code ? detectCodeLanguage(code, title) : codeLibrary[index + 1]?.language ?? "javascript",
      code: code ?? codeLibrary[index + 1]?.code ?? `// Example placeholder code for ${placeholder}`,
      id: placeholder,
    };
  };

  const toVideo = (index: number, placeholder: string) => {
    const embedded = assets?.embeddedVideos?.[index];
    const videoUrl = embedded || videoLibrary[index + 1] || videoLibrary["1"];
    return {
      type: "video" as const,
      src: videoUrl,
      id: placeholder,
    };
  };

  const toImage = (index: number, placeholder: string) => {
    const embedded = assets?.embeddedImages?.[index];
    return {
      type: "image" as const,
      src: embedded ?? imageLibrary[index + 1] ?? `https://via.placeholder.com/1200x675?text=${encodeURIComponent(placeholder)}`,
      alt: `Foto ${index + 1}`,
      id: placeholder,
    };
  };

  while ((match = placeholderRegex.exec(content)) !== null) {
    const [placeholder, type, id] = match;
    const before = content.substring(lastIndex, match.index).trim();
    const assetIndex = Number(id) - 1;

    if (before) {
      before
        .split(/\n{2,}/g)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .forEach((paragraph) => result.push({ type: "paragraph", text: paragraph }));
    }

    if (type === "CODE") {
      result.push(toCode(assetIndex, placeholder));
    }

    if (type === "VIDEO") {
      result.push(toVideo(assetIndex, placeholder));
    }

    if (type === "FOTO") {
      result.push(toImage(assetIndex, placeholder));
    }

    lastIndex = match.index + placeholder.length;
  }

  const remainder = content.substring(lastIndex).trim();
  if (remainder) {
    remainder
      .split(/\n{2,}/g)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .forEach((paragraph) => result.push({ type: "paragraph", text: paragraph }));
  }

  return result;
};

export const formatTimestamp = (timestamp: number) => {
  try {
    return getFormattedDate(timestamp);
  } catch (error) {
    return "Unknown date";
  }
};

export const subscribeArticles = (callback: (articles: Article[]) => void) => {
  const articlesQuery = query(collection(db, "articles"), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(articlesQuery, (snapshot) => {
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Article, "id">),
    }));
    callback(articles as Article[]);
  });
  return unsubscribe;
};

export const articleToCard = (article: Article): ArticleCard => ({
  id: article.id,
  title: article.title,
  description: article.description,
  mediaUrl: article.mediaUrl,
  timestamp: article.timestamp,
  formattedDate: formatTimestamp(article.timestamp)
});
