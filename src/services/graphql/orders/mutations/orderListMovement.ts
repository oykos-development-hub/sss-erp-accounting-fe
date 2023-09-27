import {GraphQL} from '../..';
import {OrderListMovementParams, OrderListMovementResponse} from '../../../../types/graphql/orderListTypes';

const orderListMovement = async (
  data: OrderListMovementParams,
): Promise<OrderListMovementResponse['data']['orderList_Movement']> => {
  const mutation = `mutation($data: OrderListAssetMovementMutation!) {
    orderList_Movement(data: $data) {
        status 
        message 
    }
  }`;

  const response = await GraphQL.fetch(mutation, {data});
  return response?.data?.orderList_Movement || {};
};

export default orderListMovement;
