import {GraphQL} from '../..';
import {GetPlansOverviewParams, PlanOverviewResponse} from '../../../../types/graphql/getPlansTypes';

const getPlans = async ({
  status,
  year,
  page,
  size,
  is_pre_budget,
}: GetPlansOverviewParams): Promise<PlanOverviewResponse> => {
  let dataString = `status: "${status || ''}", year: "${year}", page: ${page}, size: ${size}`;

  if (is_pre_budget === true || is_pre_budget === false) {
    dataString += `, is_pre_budget: ${is_pre_budget}`;
  }

  const response = await GraphQL.fetch(
    `query {
    publicProcurementPlans_Overview(${dataString}) {
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
            status
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
}`,
  );

  return response?.data?.publicProcurementPlans_Overview || {};
};

export default getPlans;
