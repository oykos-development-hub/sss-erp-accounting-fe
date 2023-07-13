import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {OrderListArticleType} from '../../../../types/graphql/articleTypes';

const useGetOrderProcurementAvailableArticles = (public_procurement_id: number) => {
  const [articles, setArticles] = useState<OrderListArticleType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderProcurementArticles = async () => {
    const response = await GraphQL.getOrderProcurementAvailableArticles(public_procurement_id);
    const items = response?.items;
    setArticles(items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderProcurementArticles();
  }, [public_procurement_id]);

  return {articles, loading, fetch: fetchOrderProcurementArticles};
};

export default useGetOrderProcurementAvailableArticles;
