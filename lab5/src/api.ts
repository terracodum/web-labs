import axios, { type AxiosInstance } from "axios";
import { LaureatesResponseCodec, PrizesResponseCodec, decodeOrThrow } from "./codecs";

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export class ApiService {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  async get(url: string, params: Record<string, unknown> = {}): Promise<unknown> {
    const response = await this.client.get<unknown>(url, { params });
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

export class NobelPrizeService {
  private readonly api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async getPrizes({ offset, limit, category }: PrizeQuery): Promise<PagedResult<PrizeRow>> {
    const raw = await this.api.get("/nobelPrizes", {
      offset,
      limit,
      nobelPrizeCategory: category || undefined,
      format: "json",
    });
    const data = decodeOrThrow(PrizesResponseCodec, raw);

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

export class LaureateService {
  private readonly api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  async getLaureates({ offset, limit, name, category }: LaureateQuery): Promise<PagedResult<LaureateRow>> {
    const raw = await this.api.get("/laureates", {
      offset,
      limit,
      name: name || undefined,
      nobelPrizeCategory: category || undefined,
      format: "json",
    });
    const data = decodeOrThrow(LaureatesResponseCodec, raw);

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
