import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListAssetMovementParams} from '../../../../types/graphql/OrderListAssetMovementTypes';

const useOrderListAssetMovementMutation = () => {
  const [loading, setLoading] = useState(false);

  const OrderListAssetMovementMutation = async (
    data: OrderListAssetMovementParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response = await GraphQL.OrderListAssetMovementMutation(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: OrderListAssetMovementMutation};
};

export default useOrderListAssetMovementMutation;
