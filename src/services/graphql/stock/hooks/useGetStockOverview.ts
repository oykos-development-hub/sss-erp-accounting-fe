import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import useAppContext from '../../../../context/useAppContext';
import {StockItem, StockListType} from '../../../../types/graphql/stockTypes';

const useGetStockOverview = (page: number, size: number, title: string) => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchStockOverview = async () => {
    const response: StockListType['get'] = await fetch(GraphQL.getStockOverview, {page, size, title});
    if (response) {
      const items = response.stock_Overview.items;
      const total = response.stock_Overview.total;

      setStockItems(items);
      setTotal(total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockOverview();
  }, []);

  return {total, stockItems, loading, fetch: fetchStockOverview};
};

export default useGetStockOverview;
