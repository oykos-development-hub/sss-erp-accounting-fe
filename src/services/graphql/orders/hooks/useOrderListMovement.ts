import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListMovementParams} from '../../../../types/graphql/orderListTypes';

const useOrderListMovement = () => {
  const [loading, setLoading] = useState(false);

  const orderListMovement = async (data: OrderListMovementParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    try {
      const response = await GraphQL.orderListMovement(data);
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

  return {loading, mutate: orderListMovement};
};

export default useOrderListMovement;
