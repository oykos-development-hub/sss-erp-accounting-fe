const getOverallSpendingReport = `query overallSpendingReport($start_date: String, $end_date:String $search: String, $office_id: Int, $organization_unit_id: Int, $exception: Boolean) {
    overallSpending_Report(start_date: $start_date, end_date: $end_date, search: $search, office_id: $office_id, organization_unit_id: $organization_unit_id, exception: $exception) {
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
