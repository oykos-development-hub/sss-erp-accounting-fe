const movementOverview = `query MovementOverview($page: Int, $size: Int, $office_id: Int, $recipient_user_id: Int) {
    movement_Overview(page: $page, size: $size,office_id: $office_id, recipient_user_id: $recipient_user_id) {
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
        }
    }
}`;

export default movementOverview;
