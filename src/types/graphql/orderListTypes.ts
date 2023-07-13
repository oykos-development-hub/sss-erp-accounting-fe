import {DropdownDataString} from '../dropdownData';
import {OrderListArticleInsert, OrderListArticleType} from './articleTypes';
export interface OrderListItem {
  id?: number;
  date_order?: string;
  total_price?: string;
  public_procurement?: DropdownDataString;
  supplier?: DropdownDataString;
  status?: string;
  articles?: OrderListArticleType[];
  invoice_date?: string;
  invoice_number?: string;
  date_system?: string;
  description_receive?: string;
  recipient_user?: DropdownDataString;
  office?: DropdownDataString;
}

export interface GetOrderListParams {
  page?: number;
  size?: number;
  id?: number;
  supplier_id?: number;
  status?: string;
  search?: string;
}
export interface OrderListReceiveParams {
  order_id: number;
  date_system: string;
  invoice_date: string;
  invoice_number: string;
  description_receive: string;
}

export interface OrderListInsertParams {
  id: number;
  date_order: string;
  public_procurement_id: number;
  supplier_id: number;
  articles: OrderListArticleInsert[];
}

export interface OrderListMovementParams {
  order_id: number;
  organization_unit_id: number;
  user_profile_id: number;
}

export interface OrderListResponse {
  data: {
    orderList_Overview: {
      status?: string;
      message?: string;
      total?: number;
      items?: OrderListItem[];
    };
  };
}

export interface OrderProcurementAvailableArticlesResponse {
  data: {
    orderProcurementAvailableList_Overview: {
      status?: string;
      message?: string;
      items?: OrderListArticleType[];
    };
  };
}

export interface OrderListReceiveResponse {
  data: {
    orderList_Receive: {
      status?: string;
      message?: string;
    };
  };
}

export interface OrderListInsertResponse {
  data: {
    orderList_Insert: {
      status?: string;
      message?: string;
      item: OrderListItem;
    };
  };
}

export interface OrderListMovementResponse {
  data: {
    orderList_Movement: {
      status?: string;
      message?: string;
    };
  };
}

export interface OrderListDeleteResponse {
  data: {
    orderList_Delete: {
      status?: string;
      message?: string;
    };
  };
}

export interface OrderListReceiveDeleteResponse {
  data: {
    orderListReceiveDelete_Delete: {
      status?: string;
      message?: string;
    };
  };
}
