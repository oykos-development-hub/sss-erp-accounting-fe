export interface OrderListArticleType {
  id: number;
  title: string;
  description: string;
  manufacturer: string;
  unit: string;
  amount: number;
  total_price?: number;
  available?: number;
  price?: number;
}

export type OrderListArticleInsert = {
  id: number;
  amount: number;
};
