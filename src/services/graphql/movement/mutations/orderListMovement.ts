const OrderListAssetMovementMutation = `mutation($data: OrderListAssetMovementMutation!) {
  orderList_Movement(data: $data) {
      status 
      message 
  }
}`;

export default OrderListAssetMovementMutation;
