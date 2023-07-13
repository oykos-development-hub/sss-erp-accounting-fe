import {GraphQL} from '../..';
import {OrderListReceiveDeleteResponse} from '../../../../types/graphql/orderListTypes';

const deleteOrderListReceive = async (
  id: number,
): Promise<OrderListReceiveDeleteResponse['data']['orderListReceiveDelete_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    orderListReceiveDelete_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.orderListReceiveDelete_Delete || {};
};

export default deleteOrderListReceive;
