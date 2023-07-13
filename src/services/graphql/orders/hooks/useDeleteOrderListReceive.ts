import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';

const useDeleteOrderListReceive = () => {
  const [loading, setLoading] = useState(false);

  const deleteOrderListReceive = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.deleteOrderList(id);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteOrderListReceive};
};

export default useDeleteOrderListReceive;
