const movementDetails = `query MovementDetails($id: Int!) {
    movement_Details(id: $id) {
        status 
        message
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
                year
                title
                description
                amount
            }
            file{
                id
                name
                type
            }
           
        }
    }
}`;

export default movementDetails;
