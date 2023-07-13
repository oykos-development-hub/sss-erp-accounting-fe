import {GraphQL} from '../..';
import {
  OrderListAssetMovementParams,
  OrderListAssetMovementResponse,
} from '../../../../types/graphql/OrderListAssetMovementTypes';

const OrderListAssetMovementMutation = async (
  data: OrderListAssetMovementParams,
): Promise<OrderListAssetMovementResponse['data']['orderList_Movement']> => {
  const response = await GraphQL.fetch(`mutation {
    orderList_Movement(data:  {
      order_id: ${data?.order_id},
      office_id: ${data?.office_id},
      recipient_user_id: ${data?.recipient_user_id}
    }
      ) {
        message
        status
      }
    }`);
  return response?.data?.orderList_Movement || {};
};

export default OrderListAssetMovementMutation;
