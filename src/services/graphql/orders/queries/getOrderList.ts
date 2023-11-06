const getOrderList = `query OrderListOverview($page: Int, $size: Int, $id: Int, $supplier_id: Int, $status: String, $search: String) {
  orderList_Overview(page: $page, size: $size, id: $id, supplier_id: $supplier_id, status: $status, search: $search) {
      status 
      message
      total 
      items {
          id
          date_order
          total_bruto
          total_neto
          public_procurement {
              id
              title
          }
          supplier {
              id
              title
          }
          status
          articles {
              id
              title
              description
              manufacturer
              unit
              amount
              total_price
              price
          }
          invoice_date
          invoice_number
          date_system
          description
          recipient_user{
              id
              title
          }
          office {
              id
              title
          }
      }
  }
}`;

export default getOrderList;
