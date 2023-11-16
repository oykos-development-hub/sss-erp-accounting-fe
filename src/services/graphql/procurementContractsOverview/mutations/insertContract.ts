const contractInsertMutation = `mutation($data: PublicProcurementContractInsertMutation!) {
    publicProcurementContracts_Insert(data: $data) {
        status 
        message 
        data
        item {
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

export default contractInsertMutation;
