import {DeleteResponse, DetailsResponse} from './response';

export interface OrderListAssetMovementParams {
  order_id: number;
  office_id: number;
  recipient_user_id: number;
}
export interface OrderListAssetMovementTypeResponse {
  insert: {
    orderList_Movement: DetailsResponse<OrderListAssetMovementParams>;
  };
  delete: {
    orderListAssetMovement_Delete: DeleteResponse;
  };
}
