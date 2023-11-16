const contractsOverviewQuery = `query Contracts($id: Int, $procurement_id: Int, $supplier_id: Int) {
    publicProcurementContracts_Overview(id: $id, procurement_id: $procurement_id, supplier_id: $supplier_id) {
        status 
        message
        total
        items {
            id
            public_procurement {
                id
                title
            }
            supplier {
                id
                title
            }
            serial_number
            date_of_signing
            date_of_expiry
            net_value
            gross_value
            vat_value
            created_at
            updated_at
            file {
              id
              name
              type
            }
        }
    }
}`;
export default contractsOverviewQuery;
