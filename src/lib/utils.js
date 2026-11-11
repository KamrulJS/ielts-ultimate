/**
 * Round raw IELTS band average to nearest 0.5 according to official IELTS rules.
 * .25 rounds up to .5, .75 rounds up to next whole band.
 */
export function roundIeltsBand(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return 0;
  const clamped = Math.max(0, Math.min(9, score));
  return Math.round(clamped * 2) / 2;
}

/**
 * Convert raw Reading/Listening score out of 40 into IELTS band (Academic).
 */
export function rawScoreToBand(correct, total = 40) {
  if (!total) return 0;
  const normalized = (correct / total) * 40;
  if (normalized >= 39) return 9.0;
  if (normalized >= 37) return 8.5;
  if (normalized >= 35) return 8.0;
  if (normalized >= 33) return 7.5;
  if (normalized >= 30) return 7.0;
  if (normalized >= 27) return 6.5;
  if (normalized >= 23) return 6.0;
  if (normalized >= 19) return 5.5;
  if (normalized >= 15) return 5.0;
  if (normalized >= 13) return 4.5;
  if (normalized >= 10) return 4.0;
  if (normalized >= 6) return 3.5;
  return 3.0;
}

export function formatDurationSeconds(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const pad = (n) => String(n).padStart(2, '0');
  if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatReadableDate(isoString) {
  if (!isoString) return 'Not scheduled';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDaysRemaining(targetDateStr) {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function countWords(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getInitials(name) {
  if (!name) return 'ST';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

