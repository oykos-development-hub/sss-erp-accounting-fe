import {GetResponse} from './response';

export interface StockItem {
  id: number;
  title: string;
  description: string;
  amount: number;
  year: string;
  article_id: number;
}

export interface StockListType {
  get: {
    stock_Overview: GetResponse<StockItem>;
  };
}
