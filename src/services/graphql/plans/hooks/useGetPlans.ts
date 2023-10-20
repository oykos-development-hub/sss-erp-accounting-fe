import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {GetPlansOverviewParams, PlanItem, PlanResponseType} from '../../../../types/graphql/getPlansTypes';
import useAppContext from '../../../../context/useAppContext';

const useGetPlans = ({status, year, page, size, is_pre_budget, contract}: GetPlansOverviewParams) => {
  const [getPlans, setgetPlans] = useState<PlanItem[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();
  const GetPlans = async () => {
    const response: PlanResponseType['get'] = await fetch(GraphQL.getPlans, {
      status,
      year,
      page,
      size,
      is_pre_budget,
      contract,
    });
    const plans = response?.publicProcurementPlans_Overview.items;

    setgetPlans(plans);
    setLoading(false);
  };

  useEffect(() => {
    GetPlans();
  }, [status, year, page, size, is_pre_budget, contract]);

  return {data: getPlans, loading, refetchData: GetPlans};
};

export default useGetPlans;
