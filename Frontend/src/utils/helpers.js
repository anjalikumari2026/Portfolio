// ─────────────────────────────────────────────────────────────────────
// helpers.js  –  Reusable utility functions
// ─────────────────────────────────────────────────────────────────────

// ── Date & time ───────────────────────────────────────────────────────

/**
 * Format an ISO date string to a readable format.
 * @param {string|Date} date
 * @param {object} options  – Intl.DateTimeFormat options
 * @returns {string}  e.g. "January 2024"
 */
export const formatDate = (
  date,
  options = { month: "long", year: "numeric" },
) => {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  } catch {
    return String(date);
  }
};

/**
 * Returns the number of full years between a start date and today.
 * @param {string|Date} startDate
 * @returns {number}
 */
export const getYearsOfExperience = (startDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years));
};

// ── Text ──────────────────────────────────────────────────────────────

/**
 * Truncate a string to maxLength and append an ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text ?? "";
  return `${text.slice(0, maxLength).trimEnd()}…`;
};

/**
 * Capitalise the first letter of every word.
 * @param {string} str
 * @returns {string}
 */
export const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Collapse multiple spaces and trim a string.
 * @param {string} str
 * @returns {string}
 */
export const removeExtraSpaces = (str) =>
  typeof str === "string" ? str.replace(/\s+/g, " ").trim() : "";

/**
 * Convert a string to a URL-safe slug.
 * @param {string} text
 * @returns {string}  e.g. "My Project" → "my-project"
 */
export const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Estimate reading time in minutes.
 * @param {string} text
 * @param {number} wpm  – words per minute (default 200)
 * @returns {string}  e.g. "3 min read"
 */
export const calculateReadingTime = (text, wpm = 200) => {
  if (!text) return "0 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / wpm));
  return `${minutes} min read`;
};

/**
 * Normalise project tags: trim, deduplicate, sort.
 * @param {string[]|string} tags
 * @returns {string[]}
 */
export const formatProjectTags = (tags) => {
  if (!tags) return [];
  const arr = Array.isArray(tags)
    ? tags
    : tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
  return [...new Set(arr.map((t) => t.trim().toLowerCase()))].sort();
};

// ── DOM / scroll ──────────────────────────────────────────────────────

/**
 * Smooth-scroll to a section by its element id (without the #).
 * @param {string} sectionId
 * @param {number} offset  – px to subtract from top (e.g. sticky nav height)
 */
export const scrollToSection = (sectionId, offset = 80) => {
  const el = document.getElementById(sectionId.replace(/^#/, ""));
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
};

// ── Async utilities ───────────────────────────────────────────────────

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number}   delay  ms
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ── Clipboard & downloads ─────────────────────────────────────────────

/**
 * Copy text to the clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}  true on success
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Trigger a file download from a URL.
 * @param {string} url
 * @param {string} filename
 */
export const downloadFile = (url, filename) => {
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// ── File utilities ────────────────────────────────────────────────────

/**
 * Format a file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string}  e.g. "2.4 MB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

// ── Links ─────────────────────────────────────────────────────────────

/**
 * Returns true if the URL points to a different origin.
 * @param {string} url
 * @returns {boolean}
 */
export const isExternalLink = (url) => {
  if (!url) return false;
  try {
    return new URL(url).origin !== window.location.origin;
  } catch {
    return url.startsWith("http") || url.startsWith("//");
  }
};

// ── Tailwind / className ──────────────────────────────────────────────

/**
 * Join class names, filtering out falsy values.
 * Lightweight alternative to the `clsx` package.
 * @param  {...(string|undefined|null|false)} classes
 * @returns {string}
 */
export const classNames = (...classes) => classes.filter(Boolean).join(" ");

// ── Misc ──────────────────────────────────────────────────────────────

/**
 * Generate a lightweight random ID (not cryptographically secure).
 * @param {number} length
 * @returns {string}
 */
export const generateId = (length = 8) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

/**
 * Deep-clone a plain JSON-serialisable object.
 * @param {object} obj
 * @returns {object}
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
