import {DropdownDataBudgetIndent, DropdownDataNumber} from '../dropdownData';
import {PublicProcurementArticle, PublicProcurementArticleWithAmount} from './publicProcurementArticlesTypes';
import {PublicProcurement} from './publicProcurementTypes';
import {Response, SingularResponse} from './utils';

export enum ProcurementStatus {
  ProcurementStatusInProgress = 'U toku',
  PostProcurementStatusCompleted = 'Objavljen',
  PostProcurementStatusContracted = 'Ugovoren',
  PreProcurementStatusCompleted = 'Zaključen',
  ProcurementStatusProcessed = 'Obrađen',
}

export const isProcurementFinished = (status: ProcurementStatus) =>
  [
    ProcurementStatus.PostProcurementStatusCompleted,
    ProcurementStatus.PostProcurementStatusContracted,
    ProcurementStatus.PreProcurementStatusCompleted,
  ].includes(status);

export interface ProcurementItem {
  id: number;
  budget_indent?: DropdownDataBudgetIndent;
  plan: DropdownDataNumber;
  is_open_procurement: boolean;
  title: string;
  article_type: string;
  status: ProcurementStatus;
  serial_number?: string;
  date_of_publishing?: string;
  date_of_awarding?: string;
  created_at: string;
  updated_at: string;
  file_id: number;
  amount: number;
  total_amount: number;
  contract_id: number;
  articles: PublicProcurementArticle[];
}

export interface ProcurementItemForOrganizationUnit extends Omit<ProcurementItem, 'articles'> {
  articles: PublicProcurementArticleWithAmount[];
}
export interface ProcurementItemInsert
  extends Omit<
    ProcurementItem,
    | 'budget_indent'
    | 'plan'
    | 'articles'
    | 'created_at'
    | 'updated_at'
    | 'id'
    | 'total_amount'
    | 'amount'
    | 'contract_id'
  > {
  budget_indent_id: number | null;
  plan_id: number;
  id?: number;
}

export interface ProcurementPlanItemDetailsGetResponse {
  publicProcurementPlanItem_Details: Response<PublicProcurement>;
}

export interface ProcurementPlanItemInsertResponse {
  publicProcurementPlanItem_Insert: SingularResponse<ProcurementItem>;
}

export interface ProcurementPlanItemDetailsDeleteResponse {
  publicProcurementPlanItem_Delete: SingularResponse<null>;
}

export interface ProcurementPlanDetails {
  id: number;
  pre_budget_plan: DropdownDataNumber;
  is_pre_budget: boolean;
  active: boolean;
  year: string;
  title: string;
  status: string;
  serial_number: string;
  date_of_publishing: string;
  date_of_closing: string;
  created_at: string;
  updated_at: string;
  file_id: number;
  rejected_description: string;
  contract_id?: number;
  items: ProcurementItem[];
}

export interface ProcurementPlanDetailsGetResponse {
  publicProcurementPlan_Details: SingularResponse<ProcurementPlanDetails>;
}
