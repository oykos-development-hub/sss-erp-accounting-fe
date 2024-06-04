const passOrderListToFinance = `query passOrderListToFinance($id:Int!) {
    passOrderListToFinance(id: $id) {
        status 
        message
		}
}`;

export default passOrderListToFinance;
