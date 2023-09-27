import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import {OrderListType} from '../../../../types/graphql/orderListTypes';

const useDeleteOrderList = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const deleteOrder = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: OrderListType['delete'] = await fetch(GraphQL.deleteOrderList, {id});

    if (response.orderList_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteOrder};
};

export default useDeleteOrderList;
