const deleteOrderListReceive = `mutation($id: Int!) {
  orderListReceive_Delete(id: $id) {
      message
      status
  }
}`;

export default deleteOrderListReceive;
