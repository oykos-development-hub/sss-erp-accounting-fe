const contractDeleteMutation = `mutation($id: Int!) {
  publicProcurementContracts_Delete(id: $id) {
      message
      status
  }
}`;

export default contractDeleteMutation;
