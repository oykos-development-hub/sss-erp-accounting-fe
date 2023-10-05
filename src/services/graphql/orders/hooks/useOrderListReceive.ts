import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListReceiveParams, OrderListType} from '../../../../types/graphql/orderListTypes';
import useAppContext from '../../../../context/useAppContext';

const useOrderListReceive = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const orderListReceive = async (data: OrderListReceiveParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: OrderListType['receive'] = await fetch(GraphQL.receiveOrderList, {data});
    if (response.orderList_Receive.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: orderListReceive};
};

export default useOrderListReceive;
