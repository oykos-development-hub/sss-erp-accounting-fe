import {GraphQL} from '../..';
import {OrderListReceiveParams, OrderListReceiveResponse} from '../../../../types/graphql/orderListTypes';

const orderListReceive = async (
  data: OrderListReceiveParams,
): Promise<OrderListReceiveResponse['data']['orderList_Receive']> => {
  const mutation = `mutation($data: OrderListReceiveMutation!) {
    orderList_Receive(data: $data) {
        status 
        message 
    }
}`;

  const response = await GraphQL.fetch(mutation, {data});
  return response?.data?.orderList_Receive || {};
};

export default orderListReceive;
