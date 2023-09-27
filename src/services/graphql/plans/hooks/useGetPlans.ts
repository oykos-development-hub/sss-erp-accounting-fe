import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {GetPlansOverviewParams, PlanItem} from '../../../../types/graphql/getPlansTypes';

const useGetPlans = ({status, year, page, size, is_pre_budget}: GetPlansOverviewParams) => {
  const [getPlans, setgetPlans] = useState<PlanItem[]>();
  const [loading, setLoading] = useState(false);

  const GetPlans = async () => {
    setLoading(true);

    const response = await GraphQL.getPlans({status, year, page, size, is_pre_budget});
    const plans = response?.items;

    setgetPlans(plans);
    setLoading(false);
  };

  useEffect(() => {
    GetPlans();
  }, [status, year, page, size, is_pre_budget]);

  return {data: getPlans, loading, refetchData: GetPlans};
};

export default useGetPlans;
