import {GraphQL} from '../..';
import {OrderListReceiveDeleteResponse} from '../../../../types/graphql/orderListTypes';

const deleteOrderListReceive = async (
  id: number,
): Promise<OrderListReceiveDeleteResponse['data']['orderListReceive_Delete']> => {
  const mutation = `mutation($id: Int!) {
    orderListReceive_Delete(id: $id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.orderListReceive_Delete || {};
};

export default deleteOrderListReceive;
