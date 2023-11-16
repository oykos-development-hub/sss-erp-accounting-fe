const insertContractArticleMutation = `mutation($data: PublicProcurementContractArticleInsertMutation!) {
    publicProcurementContractArticle_Insert(data: $data) {
        status 
        message 
        data
        item {
            id
            public_procurement_article {
                id
                title
            }
            contract {
                id
                title
            }
            amount
            net_value
            gross_value
        }
    }
}`;

export default insertContractArticleMutation;
