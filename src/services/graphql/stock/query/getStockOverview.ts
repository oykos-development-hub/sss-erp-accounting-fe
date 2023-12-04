const getStockOverview = `query StockOverview($page: Int, $size: Int, $title: String, $date: String) {
    stock_Overview(page: $page, size: $size,title: $title, date: $date) {
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
