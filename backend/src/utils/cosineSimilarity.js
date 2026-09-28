/**
 * Tokenizes text into a lowercase word-frequency map, stripping punctuation
 * and common stopwords.
 */
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
  "is", "are", "was", "were", "be", "been", "as", "at", "by", "this",
  "that", "it", "from", "has", "have", "had", "will", "would", "can",
  "we", "you", "your", "our", "i", "their", "they",
]);

const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
};

const buildVector = (tokens) => {
  const freq = {};
  for (const token of tokens) {
    freq[token] = (freq[token] || 0) + 1;
  }
  return freq;
};

/**
 * Computes cosine similarity between two text strings.
 * Returns a value between 0 and 1.
 */
const cosineSimilarity = (textA, textB) => {
  const vecA = buildVector(tokenize(textA));
  const vecB = buildVector(tokenize(textB));

  const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const word of allWords) {
    const a = vecA[word] || 0;
    const b = vecB[word] || 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (magA === 0 || magB === 0) return 0;

  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
};

/**
 * Computes a match percentage (0-100) between resume text and job description
 */
const matchPercentage = (resumeText, jobDescription) => {
  const similarity = cosineSimilarity(resumeText, jobDescription);
  return Math.round(similarity * 100);
};

export { cosineSimilarity, matchPercentage, tokenize };