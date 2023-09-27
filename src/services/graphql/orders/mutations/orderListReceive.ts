const orderListReceive = `mutation($data: OrderListReceiveMutation!) {
  orderList_Receive(data: $data) {
      status 
      message 
  }
}`;

export default orderListReceive;
