/**
 * IELTS Academic Reading Validation and Scoring Engine
 * Adheres strictly to official Cambridge Assessment IELTS Academic criteria.
 */

// Official IELTS Academic Reading raw score (out of 40) to Band Score conversion
export function rawScoreToAcademicReadingBand(correctCount) {
  const c = Math.max(0, Math.min(40, Number(correctCount) || 0));
  if (c >= 39) return 9.0;
  if (c >= 37) return 8.5;
  if (c >= 35) return 8.0;
  if (c >= 33) return 7.5;
  if (c >= 30) return 7.0;
  if (c >= 27) return 6.5;
  if (c >= 23) return 6.0;
  if (c >= 19) return 5.5;
  if (c >= 15) return 5.0;
  if (c >= 13) return 4.5;
  if (c >= 10) return 4.0;
  if (c >= 8) return 3.5;
  if (c >= 6) return 3.0;
  if (c >= 4) return 2.5;
  return 2.0;
}

// Normalize strings for resilient text comparisons
function cleanText(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/[.,;:]+$/, ''); // Strip trailing punctuation
}

// Normalize TFNG abbreviations
function normalizeTfng(str) {
  const s = cleanText(str);
  if (s === 't' || s === 'true') return 'true';
  if (s === 'f' || s === 'false') return 'false';
  if (s === 'ng' || s === 'not given' || s === 'notgiven') return 'not given';
  return s;
}

// Normalize YNNG abbreviations
function normalizeYnng(str) {
  const s = cleanText(str);
  if (s === 'y' || s === 'yes') return 'yes';
  if (s === 'n' || s === 'no') return 'no';
  if (s === 'ng' || s === 'not given' || s === 'notgiven') return 'not given';
  return s;
}

// Roman numeral normalizer (e.g., 'iv' vs '4' or 'IV')
function normalizeRoman(str) {
  const s = cleanText(str);
  const romanMap = {
    '1': 'i', '2': 'ii', '3': 'iii', '4': 'iv', '5': 'v',
    '6': 'vi', '7': 'vii', '8': 'viii', '9': 'ix', '10': 'x'
  };
  return romanMap[s] || s;
}

/**
 * Validate a user's answer against the question's answer rules
 * @param {string} rawUserAnswer - The input provided by the candidate
 * @param {object} question - The question object from the question bank
 * @returns {object} { isCorrect: boolean, isUnanswered: boolean, status: 'correct'|'incorrect'|'unanswered' }
 */
export function validateReadingAnswer(rawUserAnswer, question) {
  const userStr = String(rawUserAnswer ?? '').trim();

  if (!userStr) {
    return {
      isCorrect: false,
      isUnanswered: true,
      status: 'unanswered',
      userAnswer: '',
      correctAnswer: String(question?.answer || ''),
      explanation: question?.explanation || '',
    };
  }

  const qType = (question?.type || '').toUpperCase();
  const rawCorrect = String(question?.answer || '').trim();
  const acceptedList = Array.isArray(question?.acceptedAnswers)
    ? question.acceptedAnswers.map((a) => cleanText(a))
    : [];

  let isMatch = false;

  // 1. True / False / Not Given
  if (qType === 'TFNG' || qType.includes('TRUE')) {
    const userNorm = normalizeTfng(userStr);
    const corrNorm = normalizeTfng(rawCorrect);
    isMatch = userNorm === corrNorm;
  }
  // 2. Yes / No / Not Given
  else if (qType === 'YNNG' || qType.includes('YES')) {
    const userNorm = normalizeYnng(userStr);
    const corrNorm = normalizeYnng(rawCorrect);
    isMatch = userNorm === corrNorm;
  }
  // 3. Matching Headings
  else if (qType.includes('HEADING')) {
    const userNorm = normalizeRoman(userStr);
    const corrNorm = normalizeRoman(rawCorrect);
    isMatch = userNorm === corrNorm || cleanText(userStr) === cleanText(rawCorrect);
  }
  // 4. Multiple Choice & Single-Letter Matching
  else if (
    qType === 'MULTIPLE_CHOICE' ||
    qType === 'MC' ||
    qType.includes('MATCHING')
  ) {
    const uClean = cleanText(userStr);
    const cClean = cleanText(rawCorrect);
    // Check direct letter match ('A', 'B', etc.) or full text match
    isMatch = uClean === cClean;
    if (!isMatch && acceptedList.length > 0) {
      isMatch = acceptedList.includes(uClean);
    }
  }
  // 5. Text Completions (Sentence, Summary, Note, Table, Short Answer, Diagram)
  else {
    const uClean = cleanText(userStr);
    const cClean = cleanText(rawCorrect);

    // Direct match
    if (uClean === cClean) {
      isMatch = true;
    } else if (acceptedList.includes(uClean)) {
      isMatch = true;
    } else {
      // Check without leading articles ('a ', 'an ', 'the ')
      const stripArticle = (s) => s.replace(/^(a|an|the)\s+/, '');
      if (stripArticle(uClean) === stripArticle(cClean)) {
        isMatch = true;
      } else if (acceptedList.some((acc) => stripArticle(acc) === stripArticle(uClean))) {
        isMatch = true;
      }
    }
  }

  return {
    isCorrect: isMatch,
    isUnanswered: false,
    status: isMatch ? 'correct' : 'incorrect',
    userAnswer: userStr,
    correctAnswer: rawCorrect,
    explanation: question?.explanation || '',
  };
}
