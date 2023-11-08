const insertOrderList = `mutation($data: OrderListInsertMutation!) {
    orderList_Insert(data: $data) {
        status 
        message
        data
        item {
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
                manufacturer
                unit
                available
                amount
                total_price
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

export default insertOrderList;
