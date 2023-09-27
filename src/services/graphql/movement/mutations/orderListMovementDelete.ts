import {GraphQL} from '../..';
import {OrderListAssetMovementDeleteResponse} from '../../../../types/graphql/OrderListAssetMovementTypes';

const deleteOrderListAssetMovement = async (
  id: number,
): Promise<OrderListAssetMovementDeleteResponse['data']['orderListAssetMovement_Delete']> => {
  const mutation = `mutation($id: Int!) {
      orderListAssetMovement_Delete(id: $id) {
          message
          status
      }
  }`;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.orderListAssetMovement_Delete || {};
};

export default deleteOrderListAssetMovement;
