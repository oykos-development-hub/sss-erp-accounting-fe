const deleteMovement = `mutation($id: Int!) {
  movement_Delete(id: $id) {
      message
      status
  }
}`;

export default deleteMovement;
