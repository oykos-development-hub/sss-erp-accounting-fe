import {DropdownDataNumber} from '../dropdownData';
import {DeleteResponse, DetailsResponse, GetResponse} from './response';

export interface MovementItems {
  id: number;
  description: string;
  date_order: string;
  office: DropdownDataNumber;
  recipient_user: DropdownDataNumber;
}

export interface GetMovementOverviewParams {
  page?: number;
  size?: number;
  office_id?: number;
  recipient_user_id?: number;
  sort_by_date_order?: string;
}

export interface MovementDetailsItems {
  id: number;
  description: string;
  date_order: string;
  office: DropdownDataNumber;
  recipient_user: DropdownDataNumber;
  articles: ArticleType[];
  file: FileType;
}

export interface ArticleType {
  title: string;
  description: string;
  year: string;
  id: number;
  amount: number;
  net_price: number;
  vat_percentage: number;
}

export interface FileType {
  id: number;
  name: string;
  type: string;
}

export interface MovementParams {
  id: number;
  office_id: number;
  recipient_user_id: number;
  date_order: string | null;
  articles: InsertArticleType[];
  file_id: number | undefined;
}

interface InsertArticleType {
  quantity: number;
  id: number;
}
export interface MovementTypeResponse {
  get: {
    movement_Overview: GetResponse<MovementItems>;
  };
  get_details: {
    //movement_Details: GetResponse<MovementDetailsItems>;
    movement_Details: {
      status: string;
      message: string;
      items: MovementDetailsItems;
    };
  };
  insert: {
    movement_Insert: DetailsResponse<MovementParams>;
  };
  delete: {
    movement_Delete: DeleteResponse;
  };
}
