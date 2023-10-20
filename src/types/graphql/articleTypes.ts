export interface OrderListArticleType {
  id: number;
  title: string;
  description: string;
  manufacturer: string;
  unit: string;
  amount: number;
  total_price: string;
  available?: number;
}

export type OrderListArticleInsert = {
  id: number;
  amount: number;
};
