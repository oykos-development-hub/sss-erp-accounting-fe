import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListInsertParams, OrderListType} from '../../../../types/graphql/orderListTypes';
import useAppContext from '../../../../context/useAppContext';

const useInsertOrderList = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const orderListInsert = async (
    data: OrderListInsertParams,
    onSuccess?: (id?: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: OrderListType['insert'] = await fetch(GraphQL.insertOrderList, {data});
    if (response?.orderList_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response?.orderList_Insert?.item?.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: orderListInsert};
};

export default useInsertOrderList;
