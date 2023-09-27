import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {OrderListItem} from '../../../../types/graphql/orderListTypes';

const useGetOrderList = (
  page: number,
  size: number,
  id: number,
  supplier_id: number,
  status: string,
  search: string,
) => {
  const [totalNumOfOrders, setTotalNumOfOrders] = useState<number>(0);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const response = await GraphQL.getOrderList(page, size, id, supplier_id, status, search);
    const numOfOrders = response?.total;
    setTotalNumOfOrders(numOfOrders as number);
    const items = response?.items;
    setOrders(items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  return {orders, loading, total: totalNumOfOrders, fetch: fetchOrders};
};

export default useGetOrderList;
