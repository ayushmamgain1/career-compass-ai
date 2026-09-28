import dayjs from "dayjs";

export const formatDate = (date, pattern = "MMM D, YYYY") => (date ? dayjs(date).format(pattern) : "—");

export const formatDateTime = (date) => (date ? dayjs(date).format("MMM D, YYYY · h:mm A") : "—");

export const timeAgo = (date) => {
  if (!date) return "—";
  const diffMinutes = dayjs().diff(dayjs(date), "minute");
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = dayjs().diff(dayjs(date), "hour");
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = dayjs().diff(dayjs(date), "day");
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(date);
};

// Score-to-color mapping used across ATS scores, match %, and interview
// scores, so the same three-tier read (needs work / on course / strong)
// applies everywhere in the app.
export const scoreTier = (score, max = 100) => {
  const pct = (score / max) * 100;
  if (pct >= 75) return { label: "Strong", color: "var(--color-verdigris)" };
  if (pct >= 45) return { label: "On course", color: "var(--color-brass)" };
  return { label: "Needs work", color: "var(--color-signal)" };
};

export const truncate = (text, length = 120) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
};

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");