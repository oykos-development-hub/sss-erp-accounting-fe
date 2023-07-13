export interface OrderListAssetMovementParams {
  order_id: number;
  office_id: number;
  recipient_user_id: number;
}

export interface OrderListAssetMovementResponse {
  data: {
    orderList_Movement: {
      status?: string;
      message?: string;
    };
  };
}

export interface OrderListAssetMovementDeleteResponse {
  data: {
    orderListAssetMovementDelete_Delete: {
      status?: string;
      message?: string;
    };
  };
}
