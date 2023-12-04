import {GetResponse} from './response';

export interface StockItem {
  id: number;
  title: string;
  description: string;
  amount: number;
  year: string;
}

export interface StockListType {
  get: {
    stock_Overview: GetResponse<StockItem>;
  };
}

export type StockOverviewParams = {
  page?: number;
  size?: number;
  title?: string;
  date?: string;
};
