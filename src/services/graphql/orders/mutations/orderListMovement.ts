import {GraphQL} from '../..';
import {OrderListMovementParams, OrderListMovementResponse} from '../../../../types/graphql/orderListTypes';

const orderListMovement = async (
  data: OrderListMovementParams,
): Promise<OrderListMovementResponse['data']['orderList_Movement']> => {
  const response = await GraphQL.fetch(`mutation {
    orderList_Movement(data: {
        order_id: ${data.order_id},
        organization_unit_id: ${data.organization_unit_id},
        user_profile_id: ${data.user_profile_id},
      }
      ) {
        message
        status
      }
    }`);
  return response?.data?.orderList_Movement || {};
};

export default orderListMovement;
