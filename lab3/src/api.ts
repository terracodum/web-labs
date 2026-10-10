import axios, { type AxiosInstance } from "axios";

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export class ApiService {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  async get<T>(url: string, params: Record<string, unknown> = {}): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }
}

const nobelApi = new ApiService("https://api.nobelprize.org/2.1");

export interface PrizeRow {
  category: string;
  date: string;
  grant: string;
}

export interface PrizeQuery {
  offset: number;
  limit: number;
  category?: string;
}

interface PrizesResponse {
  nobelPrizes: { categoryFullName: { en: string }; dateAwarded: string; prizeAmount: number }[];
  meta: { count: number };
}

export class NobelPrizeService {
  private readonly api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async getPrizes({ offset, limit, category }: PrizeQuery): Promise<PagedResult<PrizeRow>> {
    const data = await this.api.get<PrizesResponse>("/nobelPrizes", {
      offset,
      limit,
      nobelPrizeCategory: category || undefined,
      format: "json",
    });

    return {
      total: data.meta.count,
      items: data.nobelPrizes.map((p) => ({
        category: p.categoryFullName.en,
        date: p.dateAwarded,
        grant: `${p.prizeAmount.toLocaleString("ru-RU")} SEK`,
      })),
    };
  }
}

export interface LaureateRow {
  name: string;
  born: string;
  prizes: number;
}

export interface LaureateQuery {
  offset: number;
  limit: number;
  name?: string;
  category?: string;
}

interface LaureatesResponse {
  laureates: {
    knownName?: { en: string };
    orgName?: { en: string };
    birth?: { date: string };
    founded?: { date: string };
    nobelPrizes?: unknown[];
  }[];
  meta: { count: number };
}

export class LaureateService {
  private readonly api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async getLaureates({ offset, limit, name, category }: LaureateQuery): Promise<PagedResult<LaureateRow>> {
    const data = await this.api.get<LaureatesResponse>("/laureates", {
      offset,
      limit,
      name: name || undefined,
      nobelPrizeCategory: category || undefined,
      format: "json",
    });

    return {
      total: data.meta.count,
      items: data.laureates.map((l) => ({
        name: l.knownName?.en ?? l.orgName?.en ?? "—",
        born: l.birth?.date ?? l.founded?.date ?? "—",
        prizes: l.nobelPrizes?.length ?? 0,
      })),
    };
  }
}

export const nobelPrizeService = new NobelPrizeService(nobelApi);
export const laureateService = new LaureateService(nobelApi);
