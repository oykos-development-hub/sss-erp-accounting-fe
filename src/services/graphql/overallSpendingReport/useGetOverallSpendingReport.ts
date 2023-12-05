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

  const fetchSpendingReport = async (params: GetOverallSpendingReportParams) => {
    const response: OverallSpendingReportResponse = await fetch(GraphQL.getOverallSpendingReport, {data: params});

    const spendingReport = response?.overallSpending_Report.items;

    setLoading(false);
    return spendingReport;
  };

  return {loading, lazyFetch: fetchSpendingReport};
};

export default useGetOverallSpendingReport;
