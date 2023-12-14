import {GetResponse} from './response';

export interface StockItem {
  id: number;
  title: string;
  description: string;
  amount: number;
  year: string;
  net_price: number;
  vat_percentage: number;
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
  sort_by_amount?: string;
  sort_by_year?: string;
};
