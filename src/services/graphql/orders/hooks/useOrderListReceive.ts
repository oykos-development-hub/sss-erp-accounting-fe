import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListReceiveParams} from '../../../../types/graphql/orderListTypes';

const useOrderListReceive = () => {
  const [loading, setLoading] = useState(false);

  const orderListReceive = async (data: OrderListReceiveParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    try {
      const response = await GraphQL.orderListReceive(data);
      if (response.status === REQUEST_STATUSES.success) {
        onSuccess && onSuccess();
      } else {
        onError && onError();
      }
    } catch (error) {
      onError && onError();
    } finally {
      setLoading(false);
    }
  };

  return {loading, mutate: orderListReceive};
};

export default useOrderListReceive;
