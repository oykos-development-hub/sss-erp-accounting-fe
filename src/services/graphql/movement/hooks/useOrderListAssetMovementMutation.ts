import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {
  OrderListAssetMovementParams,
  OrderListAssetMovementTypeResponse,
} from '../../../../types/graphql/OrderListAssetMovementTypes';
import useAppContext from '../../../../context/useAppContext';

const useOrderListAssetMovementMutation = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const OrderListAssetMovementMutation = async (
    data: OrderListAssetMovementParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: OrderListAssetMovementTypeResponse['insert'] = await fetch(GraphQL.OrderListAssetMovementMutation, {
      data,
    });
    if (response.orderList_Movement.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: OrderListAssetMovementMutation};
};

export default useOrderListAssetMovementMutation;
