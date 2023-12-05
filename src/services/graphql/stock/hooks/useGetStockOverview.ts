import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {StockItem, StockListType, StockOverviewParams} from '../../../../types/graphql/stockTypes';

const useGetStockOverview = (params?: StockOverviewParams, lazy?: boolean) => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchStockOverview = async (date?: string) => {
    const response: StockListType['get'] = await fetch(GraphQL.getStockOverview, lazy ? {date} : params);
    if (response) {
      const items = response.stock_Overview.items;
      const total = response.stock_Overview.total;

      setStockItems(items);
      setTotal(total);
      setLoading(false);

      if (lazy) {
        return items;
      }
    }
  };

  useEffect(() => {
    if (lazy) return;
    fetchStockOverview();
  }, [params?.page, params?.size, params?.title, lazy]);

  return {total, stockItems, loading, fetch: fetchStockOverview};
};

export default useGetStockOverview;
