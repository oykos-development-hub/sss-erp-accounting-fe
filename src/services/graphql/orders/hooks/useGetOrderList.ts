import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {OrderListItem, OrderListType, GetOrderListParams} from '../../../../types/graphql/orderListTypes';
import useAppContext from '../../../../context/useAppContext';

const useGetOrderList = ({
  page,
  size,
  id,
  supplier_id,
  status,
  search,
  year,
  sort_by_date_order,
  sort_by_total_price,
}: GetOrderListParams) => {
  const [totalNumOfOrders, setTotalNumOfOrders] = useState<number>(0);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchOrders = async () => {
    const response: OrderListType['get'] = await fetch(GraphQL.getOrderList, {
      page,
      size,
      id,
      supplier_id,
      status,
      search,
      year,
      sort_by_date_order,
      sort_by_total_price,
    });
    const numOfOrders = response?.orderList_Overview?.total;
    setTotalNumOfOrders(numOfOrders as number);
    const items = response?.orderList_Overview?.items;
    setOrders(items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, size, id, supplier_id, status, search, year, sort_by_date_order, sort_by_total_price]);

  return {orders, loading, total: totalNumOfOrders, fetch: fetchOrders};
};

export default useGetOrderList;
