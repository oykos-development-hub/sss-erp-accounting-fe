const procurementDetailsQuery = `query ProcurementDetails($id: Int!) {
    publicProcurementPlanItem_Details(id: $id) {
        message
        status 
        message
        items {
            id
            budget_indent {
                id
                title
            }
            plan {
                id
                title
            }
            is_open_procurement
            title
            article_type
            status
            serial_number
            date_of_publishing
            date_of_awarding
            created_at
            updated_at
            file_id
            articles {
                id
                public_procurement {
                    id
                    title
                }
                title
                description
                net_price
                vat_percentage
                total_amount
                manufacturer
            }
        }
    }
}`;

export default procurementDetailsQuery;
