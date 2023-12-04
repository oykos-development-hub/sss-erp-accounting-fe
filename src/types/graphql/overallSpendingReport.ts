import {GetResponse} from './response';

export type OverallSpendingReport = {
  year: string;
  title: string;
  description: string;
  amount: number;
};

export type OverallSpendingReportResponse = {overallSpending_Report: GetResponse<OverallSpendingReport>};

export type GetOverallSpendingReportParams = {
  start_date: string | null;
  end_date: string | null;
  search: string | null;
  office_id: number | null;
  exception: boolean | null;
  organization_unit_id?: number | null;
};
