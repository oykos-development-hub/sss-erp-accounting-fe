import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {OrderListInsertParams} from '../../../../types/graphql/orderListTypes';

const useOrderListInsert = () => {
  const [loading, setLoading] = useState(false);

  const orderListInsert = async (
    data: OrderListInsertParams,
    onSuccess?: (id?: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response = await GraphQL.orderListInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response?.item?.id);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, mutate: orderListInsert};
};

export default useOrderListInsert;
