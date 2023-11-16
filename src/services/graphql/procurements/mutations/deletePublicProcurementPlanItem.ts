const procurementPlanItemDeleteMutation = `mutation($id: Int!) {
    publicProcurementPlanItem_Delete(id: $id) {
        message
        status
    }
}`;

export default procurementPlanItemDeleteMutation;
