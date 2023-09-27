import {GraphQL} from '../..';
import {GetPlansOverviewParams, PlanOverviewResponse} from '../../../../types/graphql/getPlansTypes';

const getPlans = async ({
  status,
  year,
  page,
  size,
  is_pre_budget,
}: GetPlansOverviewParams): Promise<PlanOverviewResponse> => {
  const query = `query PlansOverview($status: String, $year: String, $page: Int!, $size: Int!, $is_pre_budget: Boolean) {
    publicProcurementPlans_Overview(status: $status, year: $year, page: $page, size: $size, is_pre_budget: $is_pre_budget) {
        status 
        message
        total 
        items {
            id
            pre_budget_plan {
                id
                title
            }
            is_pre_budget
            active
            year
            title
            status 
            serial_number
            date_of_publishing
            date_of_closing
            created_at
            updated_at
            file_id
            items {
                id
                budget_indent {
                    id
                    title
                }
                plan {
                    id
                    title
                }
                is_open_procurement
                title
                article_type
                status
                serial_number
                date_of_publishing
                date_of_awarding
                created_at
                updated_at
                file_id
                articles {
                    id
                    budget_indent {
                        id
                        title
                    }
                    public_procurement {
                        id
                        title
                    }
                    title
                    description
                    net_price
                    vat_percentage
                }
            }
        }
    }
}`;

  const response = await GraphQL.fetch(query, {status, year, page, size, is_pre_budget});
  return response?.data?.publicProcurementPlans_Overview || {};
};

export default getPlans;
