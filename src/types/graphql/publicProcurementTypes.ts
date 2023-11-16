import {DropdownDataNumber} from '../dropdownData';
import {PublicProcurementArticle} from './publicProcurementArticlesTypes';
import {Response} from './utils';

export interface PublicProcurement {
  id: number;
  budget_indent: DropdownDataNumber;
  plan: DropdownDataNumber;
  is_open_procurement: boolean;
  title: string;
  article_type: string;
  status: string;
  serial_number: string;
  date_of_publishing: string;
  date_of_awarding: string;
  created_at: string;
  updated_at: string;
  file_id: number;
  articles: PublicProcurementArticle[];
}

export interface PublicProcurementGetDetailsResponse {
  publicProcurementPlanItem_Details: Response<PublicProcurement>;
}
