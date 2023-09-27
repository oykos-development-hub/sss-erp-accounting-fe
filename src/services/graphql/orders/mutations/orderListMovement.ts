const orderListMovement = `mutation($data: OrderListAssetMovementMutation!) {
  orderList_Movement(data: $data) {
      status 
      message 
  }
}`;

export default orderListMovement;
