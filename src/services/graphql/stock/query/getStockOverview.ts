const getStockOverview = `query StockOverview($page: Int, $size: Int, $title: String, $date: String, $sort_by_amount: String, $sort_by_year: String) {
    stock_Overview(page: $page, size: $size,title: $title, date: $date, sort_by_amount: $sort_by_amount, sort_by_year: $sort_by_year) {
        status 
        message
        total
        items {
            id
            year
            title
            description
            amount
        }
    }
}`;

export default getStockOverview;
