import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {OrderListArticleType} from '../../../../types/graphql/articleTypes';
import useAppContext from '../../../../context/useAppContext';
import {OrderProcurementAvailableArticlesType} from '../../../../types/graphql/orderListTypes';

const useGetOrderProcurementAvailableArticles = (
  public_procurement_id: number,
  visibility_type: number,
  organization_unit_id: number,
) => {
  const [articles, setArticles] = useState<OrderListArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();
  const fetchOrderProcurementArticles = async () => {
    const response: OrderProcurementAvailableArticlesType['get'] = await fetch(
      GraphQL.getOrderProcurementAvailableArticles,
      {
        public_procurement_id,
        visibility_type,
        organization_unit_id,
      },
    );

    const items = response?.orderProcurementAvailableList_Overview?.items;
    setArticles(items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderProcurementArticles();
  }, [public_procurement_id, organization_unit_id, visibility_type]);

  return {articles, loading, fetch: fetchOrderProcurementArticles};
};

export default useGetOrderProcurementAvailableArticles;
