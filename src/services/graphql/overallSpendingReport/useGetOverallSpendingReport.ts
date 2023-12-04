import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  GetOverallSpendingReportParams,
  OverallSpendingReportResponse,
} from '../../../types/graphql/overallSpendingReport';

const useGetOverallSpendingReport = () => {
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchSpendingReport = async ({
    start_date,
    end_date,
    office_id,
    organization_unit_id,
    exception,
    search,
  }: GetOverallSpendingReportParams) => {
    const response: OverallSpendingReportResponse = await fetch(GraphQL.getOverallSpendingReport, {
      start_date,
      end_date,
      office_id,
      organization_unit_id,
      exception,
      search,
    });

    const spendingReport = response?.overallSpending_Report.items;

    setLoading(false);
    return spendingReport;
  };

  return {loading, lazyFetch: fetchSpendingReport};
};

export default useGetOverallSpendingReport;
