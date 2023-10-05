const receiveOrderList = `mutation($data: OrderListReceiveMutation!) {
  orderList_Receive(data: $data) {
      status 
      message 
  }
}`;

export default receiveOrderList;
