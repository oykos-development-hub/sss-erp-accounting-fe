const getOrderProcurementAvailableArticles = `query OrderProcurementAvailableListOverview($public_procurement_id: Int!, $visibility_type: Int!) {
  orderProcurementAvailableList_Overview(public_procurement_id: $public_procurement_id, visibility_type: $visibility_type) {
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
