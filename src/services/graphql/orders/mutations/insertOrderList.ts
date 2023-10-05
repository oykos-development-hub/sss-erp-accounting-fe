const insertOrderList = `mutation($data: OrderListInsertMutation!) {
  orderList_Insert(data: $data) {
      status 
      message
      data
      item {
          id
          date_order
          total_price
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
              available
              amount
              total_price
          }
      }
  }
}`;

export default insertOrderList;
