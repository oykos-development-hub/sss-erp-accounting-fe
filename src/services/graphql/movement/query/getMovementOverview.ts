const movementOverview = `query MovementOverview($page: Int, $size: Int, $office_id: Int, $recipient_user_id: Int, $sort_by_date_order: String) {
    movement_Overview(page: $page, size: $size,office_id: $office_id, recipient_user_id: $recipient_user_id, sort_by_date_order: $sort_by_date_order) {
        status 
        message
        total
        items {
            id
            description
            date_order
            office{
                id
                title
            }
            recipient_user{
                id
                title
            }
            articles {
                id
                title
                amount
                description
            }
        }
    }
}`;

export default movementOverview;
