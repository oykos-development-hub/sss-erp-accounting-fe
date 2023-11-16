const getContractPDFUrl = `query PlanItemPDF($id: Int!, $organization_unit_id: Int) {
    publicProcurementPlanItem_PDF(id: $id, organization_unit_id: $organization_unit_id) {
        status 
        message
        item
    }
}`;

export default getContractPDFUrl;
