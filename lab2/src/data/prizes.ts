import type { Column } from "../types";

export interface Prize {
  category: string;
  date: string;
  grant: string;
}

export const prizesColumns: Column<Prize>[] = [
  { key: "category", label: "Категория" },
  { key: "date", label: "Дата вручения" },
  { key: "grant", label: "Стоимость гранта" },
];

export const prizesData: Prize[] = [
  { category: "Физика", date: "2023-12-10", grant: "11 000 000 SEK" },
  { category: "Химия", date: "2023-12-10", grant: "11 000 000 SEK" },
  { category: "Медицина", date: "2023-12-10", grant: "11 000 000 SEK" },
  { category: "Литература", date: "2023-12-10", grant: "11 000 000 SEK" },
  { category: "Премия мира", date: "2023-12-10", grant: "11 000 000 SEK" },
  { category: "Экономика", date: "2023-12-10", grant: "11 000 000 SEK" },
];
