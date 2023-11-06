const getOrderProcurementAvailableArticles = `query OrderProcurementAvailableListOverview($public_procurement_id: Int!) {
  orderProcurementAvailableList_Overview(public_procurement_id: $public_procurement_id) {
      status 
      message
      total 
      items {        
          id
          title
          description
          manufacturer
          unit
          available
          price
          vat_percentage
      }
  }
}`;

export default getOrderProcurementAvailableArticles;
