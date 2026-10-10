export interface Column<T> {
  key: keyof T & string;
  label: string;
  align?: "left" | "right";
  render?: (row: T) => string | number;
}

export interface Category {
  code: string;
  match: string;
  full: string;
  short: string;
  color: string;
}

export const GOLD = "#b7892b";

export const CATEGORIES: Category[] = [
  { code: "phy", match: "Physics", full: "Физика", short: "Физика", color: "#2f6db5" },
  { code: "che", match: "Chemistry", full: "Химия", short: "Химия", color: "#3e8e5b" },
  { code: "med", match: "Physiology or Medicine", full: "Физиология или медицина", short: "Медицина", color: "#c0483a" },
  { code: "lit", match: "Literature", full: "Литература", short: "Литература", color: "#7a5bb0" },
  { code: "pea", match: "Peace", full: "Премия мира", short: "Мир", color: "#238e8c" },
  { code: "eco", match: "Economic Sciences", full: "Экономика", short: "Экономика", color: "#6f7b8b" },
];

export const findCategory = (fullName: string) => CATEGORIES.find((c) => fullName.includes(c.match));

export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;

  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (!month) return String(year);

  const options: Intl.DateTimeFormatOptions = day
    ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
    : { month: "long", year: "numeric", timeZone: "UTC" };

  return new Date(Date.UTC(year, month - 1, day || 1))
    .toLocaleDateString("ru-RU", options)
    .replace(/\s?г\.$/, "");
}

export function plural(n: number, forms: [string, string, string]): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 > 1 && mod10 < 5) return forms[1];
  return mod10 === 1 ? forms[0] : forms[2];
}

export const formatCount = (n: number) => n.toLocaleString("ru-RU");
