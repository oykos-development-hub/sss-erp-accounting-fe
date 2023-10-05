const deleteOrderList = `mutation($id: Int!) {
  orderList_Delete(id: $id) {
      message
      status
  }
}`;

export default deleteOrderList;
