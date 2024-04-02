const getOrderList = `query OrderListOverview($page: Int, $size: Int, $id: Int, $supplier_id: Int, $status: String, $search: String, $active_plan: Boolean, $year: String, $sort_by_date_order: String, $sort_by_total_price: String) {
    orderList_Overview(page: $page, size: $size, id: $id, supplier_id: $supplier_id, status: $status, search: $search, active_plan: $active_plan, year:$year, sort_by_date_order: $sort_by_date_order, sort_by_total_price: $sort_by_total_price) {
        status 
        message
        total 
        items {
            id
            date_order
            total_bruto
                total_neto
            public_procurement {
                id
                title
            }
            supplier {
                id
                title
            }
            status
            articles {
                id
                title
                description
                net_price
                vat_percentage
                amount
                total_price
            }
            invoice_date
            invoice_number
            date_system
            passed_to_finance
            is_pro_forma_invoice
            pro_forma_invoice_date 
            pro_forma_invoice_number 
            recipient_user{
                id
                title
            }
            office {
                id
                title
            }
            group_of_articles{
                id
                title
            }
            order_file{
                id
                name
                type
            }
            receive_file{
                id
                name
                type
            }
            movement_file{
                id
                name
                type
            }
        }
    }
}`;

export default getOrderList;
