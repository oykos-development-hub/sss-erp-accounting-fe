import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import {OrderListAssetMovementTypeResponse} from '../../../../types/graphql/OrderListAssetMovementTypes';

const useDeleteOrderListAssetMovement = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const deleteAssetMovement = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: OrderListAssetMovementTypeResponse['delete'] = await fetch(GraphQL.deleteOrderListAssetMovement, {
      id,
    });

    if (response.orderListAssetMovement_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteAssetMovement};
};

export default useDeleteOrderListAssetMovement;
