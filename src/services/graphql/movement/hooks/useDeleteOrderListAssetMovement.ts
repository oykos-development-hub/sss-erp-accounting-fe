import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteOrderListAssetMovement = () => {
  const [loading, setLoading] = useState(false);

  const deleteAssetMovement = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.deleteOrderListAssetMovement(id);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteAssetMovement};
};

export default useDeleteOrderListAssetMovement;
