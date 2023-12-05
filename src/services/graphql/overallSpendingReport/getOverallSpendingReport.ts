const getOverallSpendingReport = `query overallSpendingReport($data: OverallSpendingMutation!) {
    overallSpending_Report(data: $data) {
        status 
        message
        items {
            year
            title
            description
            amount
        }
    }
}`;

export default getOverallSpendingReport;
