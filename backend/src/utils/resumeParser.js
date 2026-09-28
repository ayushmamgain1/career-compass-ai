import fs from "fs";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extract raw text from a resume file (PDF or DOCX)
 */
const extractText = async (filePath, fileType) => {
  const buffer = fs.readFileSync(filePath);

  if (fileType === "pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    console.log(result.text);
    return result.text;
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type for parsing");
};

// Section headers commonly found in resumes
const SECTION_HEADERS = {
  education: /education|academic background|qualification/i,
  experience: /experience|employment history|work history/i,
  projects: /projects|personal projects|academic projects/i,
  certifications: /certifications?|licenses?/i,
  skills: /skills|technical skills|core competencies/i,
};

/**
 * Splits resume text into sections based on common headers
 */
const splitIntoSections = (text) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const sections = { education: [], experience: [], projects: [], certifications: [] };
  let currentSection = null;

  for (const line of lines) {
    if (!line) continue;

    const matchedHeader = Object.entries(SECTION_HEADERS).find(([key, regex]) =>
      regex.test(line) && line.length < 60
    );

    if (matchedHeader) {
      currentSection = matchedHeader[0] === "skills" ? null : matchedHeader[0];
      continue;
    }

    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(line);
    }
  }

  return sections;
};

/**
 * Extract name (heuristic: first non-empty line that looks like a name)
 */
const extractName = (text) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    // Skip lines that look like emails, phone numbers, or headers
    if (/@|\d{5,}|resume|curriculum vitae/i.test(line)) continue;
    if (line.split(" ").length <= 4 && /^[A-Za-z.\s]+$/.test(line)) {
      return line;
    }
  }
  return "";
};

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/);
  return match ? match[0].trim() : "";
};

/**
 * Full parse pipeline: returns structured resume data
 */
const parseResume = async (filePath, fileType) => {
  const rawText = await extractText(filePath, fileType);
  const sections = splitIntoSections(rawText);

  const parsedData = {
    name: extractName(rawText),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    education: sections.education.slice(0, 15),
    experience: sections.experience.slice(0, 30),
    projects: sections.projects.slice(0, 30),
    certifications: sections.certifications.slice(0, 15),
  };

  return { rawText, parsedData };
};

export {
  extractText,
  parseResume,
  splitIntoSections,
};