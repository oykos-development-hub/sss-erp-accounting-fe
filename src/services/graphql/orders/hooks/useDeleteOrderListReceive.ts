import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import {OrderListType} from '../../../../types/graphql/orderListTypes';

const useDeleteOrderListReceive = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const deleteOrderListReceive = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: OrderListType['receive_delete'] = await fetch(GraphQL.deleteOrderListReceive, {id});

    if (response.orderListReceive_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteOrderListReceive};
};

export default useDeleteOrderListReceive;
