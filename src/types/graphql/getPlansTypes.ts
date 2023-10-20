import {GetResponse} from './response';

export interface PlanItem {
  id: number;
  pre_budget_plan: PreBudgetPlan[];
  is_pre_budget: boolean;
  active: boolean;
  year: number;
  title: string;
  serial_number: string;
  date_of_publishing: string;
  date_of_closing: string;
  created_at: string;
  updated_at: string;
  file_id: string;
  status: string;
  items: {
    id: string;
    plan: {
      id: string;
      title: string;
    };
    is_open_procurement: boolean;
    title: string;
    article_type: string;
    status: string;
    serial_number: string;
    date_of_publishing: string;
    date_of_awarding: string;
    created_at: string;
    updated_at: string;
    file_id: string;
    articles: Article[];
  }[];
}

export interface PlanResponseType {
  get: {
    publicProcurementPlans_Overview: GetResponse<PlanItem>;
  };
}

export interface PreBudgetPlan {
  id: string;
  title: string;
}

export interface Article {
  id: string;
  public_procurement: {
    id: string;
    title: string;
  };
  title: string;
  description: string;
  net_price: number;
  vat_percentage: number;
}

export interface GetPlansOverviewParams {
  status: string | undefined;
  year: string;
  page: number;
  size: number;
  is_pre_budget: boolean;
  contract: boolean;
}
