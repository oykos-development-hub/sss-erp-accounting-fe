import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListMovementParams, OrderListType} from '../../../../types/graphql/orderListTypes';
import useAppContext from '../../../../context/useAppContext';

const useOrderListMovement = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const orderListMovement = async (data: OrderListMovementParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: OrderListType['movement'] = await fetch(GraphQL.orderListMovement, {data});
    if (response?.orderList_Movement.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: orderListMovement};
};

export default useOrderListMovement;
