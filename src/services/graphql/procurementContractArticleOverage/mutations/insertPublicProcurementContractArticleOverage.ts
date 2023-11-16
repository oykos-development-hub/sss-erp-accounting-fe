const PublicProcurementContractArticleOverageInsertMutation = `mutation($data: PublicProcurementContractArticleOverageInsertMutation!) {
    publicProcurementContractArticleOverage_Insert(data: $data) {
        status 
        data
        message 
        item {
            id
            article_id
            amount
            created_at
            updated_at
        }
    }
}`;

export default PublicProcurementContractArticleOverageInsertMutation;
