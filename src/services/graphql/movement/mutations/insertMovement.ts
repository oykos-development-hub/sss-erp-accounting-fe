const insertMovement = `mutation($data: OrderListAssetMovementMutation!) {
  movement_Insert(data: $data) {
      status 
      message 
  }
}`;

export default insertMovement;
