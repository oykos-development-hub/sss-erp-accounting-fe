const getRecipientUsers = `query RecipientUsersOverview {
    recipientUsers_Overview {
        status 
        message
        total 
        items {
            id
            title
        }
    }
}`;

export default getRecipientUsers;
