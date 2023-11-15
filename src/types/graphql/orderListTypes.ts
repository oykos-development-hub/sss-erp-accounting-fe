import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {OrderListArticleInsert, OrderListArticleType} from './articleTypes';
import {DeleteResponse, DetailsResponse, GetResponse} from './response';
export interface OrderListItem {
  id?: number;
  date_order?: string;
  total_bruto?: number;
  total_neto: number;
  public_procurement?: DropdownDataString;
  supplier?: DropdownDataString;
  status?: string;
  articles?: OrderListArticleType[];
  invoice_date?: string;
  invoice_number?: string;
  date_system?: string;
  description?: string;
  recipient_user?: DropdownDataString;
  office?: DropdownDataString;
  price?: number;
  order_file?: {
    id: number;
    name: string;
    type: string;
  };
  receive_file?: {
    id: number;
    name: string;
    type: string;
  };
  movement_file?: {
    id: number;
    name: string;
    type: string;
  };
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
  date_system: string | null;
  invoice_date: string | null;
  invoice_number: string | null;
  description: string;
  receive_file?: number | null;
}

export interface OrderListInsertParams {
  id: number;
  date_order: string;
  public_procurement_id: number;
  supplier_id: number;
  articles: OrderListArticleInsert[];
  order_file?: number;
}

export interface OrderListMovementParams {
  order_id: number;
  organization_unit_id: number;
  user_profile_id: number;
  movement_file?: number;
}

export interface OrderListType {
  delete: {
    orderList_Delete: DeleteResponse;
  };
  get: {
    orderList_Overview: GetResponse<OrderListItem>;
  };
  insert: {
    orderList_Insert: DetailsResponse<OrderListItem>;
  };
  movement: {
    orderList_Movement: DeleteResponse;
  };
  receive: {
    orderList_Receive: DeleteResponse;
  };
  receive_delete: {
    orderListReceive_Delete: DeleteResponse;
  };
}

export interface OrderProcurementAvailableArticlesType {
  get: {
    orderProcurementAvailableList_Overview: GetResponse<OrderListArticleType>;
  };
}

export interface RecipientUsersType {
  get: {
    recipientUsers_Overview: GetResponse<DropdownDataNumber>;
  };
}
