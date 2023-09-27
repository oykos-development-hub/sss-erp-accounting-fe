const deleteOrderListAssetMovement = `mutation($id: Int!) {
  orderListAssetMovement_Delete(id: $id) {
      message
      status
  }
}`;

export default deleteOrderListAssetMovement;
