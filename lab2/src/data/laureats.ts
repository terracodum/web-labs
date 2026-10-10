import type { Column } from "../types";

export interface Laureat {
  name: string;
  born: string;
  prizes: number;
}

export const laureatsColumns: Column<Laureat>[] = [
  { key: "name", label: "Имя / название" },
  { key: "born", label: "Дата рождения / основания" },
  { key: "prizes", label: "Число премий" },
];

export const laureatsData: Laureat[] = [
  { name: "Albert Einstein", born: "1879-03-14", prizes: 1 },
  { name: "Marie Curie", born: "1867-11-07", prizes: 2 },
  { name: "International Committee of the Red Cross", born: "1863-02-17", prizes: 3 },
  { name: "Linus Pauling", born: "1901-02-28", prizes: 2 },
  { name: "United Nations High Commissioner for Refugees", born: "1950-12-14", prizes: 2 },
];
