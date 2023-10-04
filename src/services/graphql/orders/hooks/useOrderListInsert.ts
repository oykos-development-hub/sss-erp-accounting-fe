import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListInsertParams, OrderListType} from '../../../../types/graphql/orderListTypes';
import useAppContext from '../../../../context/useAppContext';

const useOrderListInsert = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const orderListInsert = async (
    data: OrderListInsertParams,
    onSuccess?: (id?: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    try {
      const response: OrderListType['insert'] = await fetch(GraphQL.orderListInsert, {data});
      if (response?.orderList_Insert?.status === REQUEST_STATUSES.success) {
        onSuccess && onSuccess(response?.orderList_Insert?.item?.id);
      } else {
        onError && onError();
      }
    } catch (error) {
      onError && onError();
    } finally {
      setLoading(false);
    }
  };

  return {loading, mutate: orderListInsert};
};

export default useOrderListInsert;
