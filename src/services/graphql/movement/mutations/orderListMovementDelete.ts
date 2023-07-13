import {GraphQL} from '../..';
import {OrderListAssetMovementDeleteResponse} from '../../../../types/graphql/OrderListAssetMovementTypes';

const deleteOrderListAssetMovement = async (
  id: number,
): Promise<OrderListAssetMovementDeleteResponse['data']['orderListAssetMovementDelete_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    orderListAssetMovementDelete_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.orderListAssetMovementDelete_Delete || {};
};

export default deleteOrderListAssetMovement;
