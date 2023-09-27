import {GraphQL} from '../..';
import {
  OrderListAssetMovementParams,
  OrderListAssetMovementResponse,
} from '../../../../types/graphql/OrderListAssetMovementTypes';

const OrderListAssetMovementMutation = async (
  data: OrderListAssetMovementParams,
): Promise<OrderListAssetMovementResponse['data']['orderList_Movement']> => {
  const mutation = `mutation($data: OrderListAssetMovementMutation!) {
    orderList_Movement(data: $data) {
        status 
        message 
    }
}`;

  const response = await GraphQL.fetch(mutation, {data});
  return response?.data?.orderList_Movement || {};
};

export default OrderListAssetMovementMutation;
