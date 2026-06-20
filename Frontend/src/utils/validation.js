// ─────────────────────────────────────────────────────────────────────
// validation.js  –  Reusable frontend validation system
//
// Convention: every function returns an error string on failure,
// or null / undefined when the value is valid.
// Form-level validators return a plain { field: errorString } object.
// ─────────────────────────────────────────────────────────────────────

import { FILE_LIMITS } from "./constants";

// ════════════════════════════════════════════════════════════════════
// ── Primitive validators (return error string | null) ────────────────
// ════════════════════════════════════════════════════════════════════

/**
 * Fails if the value is empty / whitespace / null / undefined.
 */
export const validateRequired = (value, fieldName = "This field") => {
  if (value === null || value === undefined) return `${fieldName} is required.`;
  if (typeof value === "string" && !value.trim())
    return `${fieldName} is required.`;
  if (Array.isArray(value) && value.length === 0)
    return `${fieldName} is required.`;
  return null;
};

/**
 * Standard email format check.
 */
export const validateEmail = (email) => {
  if (!email?.trim()) return "Email address is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!re.test(email.trim())) return "Please enter a valid email address.";
  return null;
};

/**
 * Password: min 8 chars, at least one letter and one number.
 */
export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password))
    return "Password must contain at least one letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  return null;
};

/**
 * International phone number (7–15 digits, optional country code).
 */
export const validatePhone = (phone) => {
  if (!phone?.trim()) return null; // optional field
  const re = /^\+?[1-9]\d{6,14}$/;
  if (!re.test(phone.replace(/[\s\-().]/g, "")))
    return "Please enter a valid phone number.";
  return null;
};

/**
 * URL validation (http / https).
 */
export const validateUrl = (url, fieldName = "URL") => {
  if (!url?.trim()) return null; // treat as optional unless combined with validateRequired
  try {
    const parsed = new URL(url.trim());
    if (!["http:", "https:"].includes(parsed.protocol))
      return `${fieldName} must start with http:// or https://.`;
    return null;
  } catch {
    return `${fieldName} is not a valid URL.`;
  }
};

/**
 * Min/max character length for a string field.
 */
export const validateLength = (
  value,
  { min = 0, max = Infinity, fieldName = "This field" } = {},
) => {
  if (!value) return null;
  const len = value.trim().length;
  if (min && len < min)
    return `${fieldName} must be at least ${min} characters.`;
  if (max < Infinity && len > max)
    return `${fieldName} must be at most ${max} characters.`;
  return null;
};

// ════════════════════════════════════════════════════════════════════
// ── File validators ──────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════

/**
 * Validate an image file (type + size).
 * @param {File} file
 * @returns {string|null}
 */
export const validateImage = (file) => {
  if (!file) return null; // optional — caller adds validateRequired if needed
  if (!FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type))
    return "Only JPEG, PNG, WebP, or GIF images are allowed.";
  const maxBytes = FILE_LIMITS.IMAGE_MAX_MB * 1024 * 1024;
  if (file.size > maxBytes)
    return `Image must be smaller than ${FILE_LIMITS.IMAGE_MAX_MB} MB.`;
  return null;
};

/**
 * Validate a PDF resume file (type + size).
 * @param {File} file
 * @returns {string|null}
 */
export const validateResumePdf = (file) => {
  if (!file) return "Please select a PDF file to upload.";
  if (!FILE_LIMITS.ALLOWED_RESUME_TYPES.includes(file.type))
    return "Only PDF files are accepted for the resume.";
  const maxBytes = FILE_LIMITS.RESUME_MAX_MB * 1024 * 1024;
  if (file.size > maxBytes)
    return `Resume must be smaller than ${FILE_LIMITS.RESUME_MAX_MB} MB.`;
  return null;
};

// ════════════════════════════════════════════════════════════════════
// ── Form-level validators (return { field: errorString } objects) ────
// ════════════════════════════════════════════════════════════════════

/**
 * Admin login form.
 * @param {{ email: string, password: string }} data
 * @returns {object}  errors — empty object means valid
 */
export const validateLoginForm = ({ email, password } = {}) => {
  const errors = {};
  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return errors;
};

/**
 * Public contact form.
 * @param {{ name, email, subject, message }} data
 * @returns {object}  errors
 */
export const validateContactForm = ({ name, email, subject, message } = {}) => {
  const errors = {};

  const nameErr =
    validateRequired(name, "Name") ||
    validateLength(name, { min: 2, max: 60, fieldName: "Name" });
  const emailErr = validateEmail(email);
  const subjectErr =
    validateRequired(subject, "Subject") ||
    validateLength(subject, { min: 3, max: 120, fieldName: "Subject" });
  const msgErr =
    validateRequired(message, "Message") ||
    validateLength(message, { min: 10, max: 2000, fieldName: "Message" });

  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (subjectErr) errors.subject = subjectErr;
  if (msgErr) errors.message = msgErr;

  return errors;
};

/**
 * Project form (admin).
 * @param {{ title, description, techStack, liveUrl, githubUrl, thumbnail }} data
 * @returns {object}  errors
 */
export const validateProjectForm = ({
  title,
  description,
  techStack,
  liveUrl,
  githubUrl,
  thumbnail,
} = {}) => {
  const errors = {};

  const titleErr =
    validateRequired(title, "Title") ||
    validateLength(title, { min: 3, max: 100, fieldName: "Title" });
  const descErr =
    validateRequired(description, "Description") ||
    validateLength(description, {
      min: 20,
      max: 2000,
      fieldName: "Description",
    });
  const stackErr = validateRequired(techStack, "Tech stack");
  const liveErr = liveUrl ? validateUrl(liveUrl, "Live URL") : null;
  const ghErr = githubUrl ? validateUrl(githubUrl, "GitHub URL") : null;
  const thumbErr = thumbnail instanceof File ? validateImage(thumbnail) : null;

  if (titleErr) errors.title = titleErr;
  if (descErr) errors.description = descErr;
  if (stackErr) errors.techStack = stackErr;
  if (liveErr) errors.liveUrl = liveErr;
  if (ghErr) errors.githubUrl = ghErr;
  if (thumbErr) errors.thumbnail = thumbErr;

  return errors;
};

/**
 * Skill form (admin).
 * @param {{ name, category, proficiency }} data
 * @returns {object}  errors
 */
export const validateSkillForm = ({ name, category, proficiency } = {}) => {
  const errors = {};

  const nameErr =
    validateRequired(name, "Skill name") ||
    validateLength(name, { min: 1, max: 50, fieldName: "Skill name" });
  const catErr = validateRequired(category, "Category");
  const profErr =
    proficiency === undefined || proficiency === null || proficiency === ""
      ? "Proficiency level is required."
      : proficiency < 0 || proficiency > 100
        ? "Proficiency must be between 0 and 100."
        : null;

  if (nameErr) errors.name = nameErr;
  if (catErr) errors.category = catErr;
  if (profErr) errors.proficiency = profErr;

  return errors;
};

/**
 * Certificate form (admin).
 * @param {{ title, issuer, issueDate, credentialUrl, image }} data
 * @returns {object}  errors
 */
export const validateCertificateForm = ({
  title,
  issuer,
  issueDate,
  credentialUrl,
  image,
} = {}) => {
  const errors = {};

  const titleErr =
    validateRequired(title, "Certificate title") ||
    validateLength(title, { min: 3, max: 120, fieldName: "Certificate title" });
  const issuerErr =
    validateRequired(issuer, "Issuing organisation") ||
    validateLength(issuer, {
      min: 2,
      max: 80,
      fieldName: "Issuing organisation",
    });
  const dateErr = validateRequired(issueDate, "Issue date");
  const urlErr = credentialUrl
    ? validateUrl(credentialUrl, "Credential URL")
    : null;
  const imgErr = image instanceof File ? validateImage(image) : null;

  if (titleErr) errors.title = titleErr;
  if (issuerErr) errors.issuer = issuerErr;
  if (dateErr) errors.issueDate = dateErr;
  if (urlErr) errors.credentialUrl = urlErr;
  if (imgErr) errors.image = imgErr;

  return errors;
};

/**
 * Experience form (admin).
 * @param {{ company, role, startDate, description, type }} data
 * @returns {object}  errors
 */
export const validateExperienceForm = ({
  company,
  role,
  startDate,
  description,
  type,
} = {}) => {
  const errors = {};

  const compErr =
    validateRequired(company, "Company name") ||
    validateLength(company, { min: 2, max: 80, fieldName: "Company name" });
  const roleErr =
    validateRequired(role, "Job role") ||
    validateLength(role, { min: 2, max: 80, fieldName: "Job role" });
  const dateErr = validateRequired(startDate, "Start date");
  const descErr =
    validateRequired(description, "Description") ||
    validateLength(description, {
      min: 20,
      max: 1500,
      fieldName: "Description",
    });
  const typeErr = validateRequired(type, "Employment type");

  if (compErr) errors.company = compErr;
  if (roleErr) errors.role = roleErr;
  if (dateErr) errors.startDate = dateErr;
  if (descErr) errors.description = descErr;
  if (typeErr) errors.type = typeErr;

  return errors;
};

// ════════════════════════════════════════════════════════════════════
// ── Helpers ──────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════

/**
 * Returns true when a form errors object has no keys (i.e. form is valid).
 * @param {object} errors
 * @returns {boolean}
 */
export const isFormValid = (errors) => Object.keys(errors).length === 0;
