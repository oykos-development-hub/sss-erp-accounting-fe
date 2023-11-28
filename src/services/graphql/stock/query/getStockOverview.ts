const getStockOverview = `query StockOverview($page: Int, $size: Int, $title: String) {
    stock_Overview(page: $page, size: $size,title: $title) {
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
