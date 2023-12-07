import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import getCounts from '../queries/getCounts';
import {Count, CountResponse} from '../../../../types/graphql/countType';

interface ICountParams {
  level?: number; // starts from 0
  tree?: boolean;
  page?: number;
  size?: number;
  search?: string;
}

const useGetCounts = ({level, page, search, size, tree}: ICountParams) => {
  const [counts, setCounts] = useState<Count[]>([]);
  const [total, setTotal] = useState<number>(0);

  const {fetch} = useAppContext();
  const fetchCounts = async () => {
    const response: CountResponse = await fetch(getCounts, {level, page, search, size, tree});
    const countList = response?.account_Overview.items;
    const totalCounts = response?.account_Overview.total;

    if (countList) setCounts(countList);
    if (totalCounts) setTotal(totalCounts);
  };

  useEffect(() => {
    fetchCounts();
  }, [level, page, search, size, tree]);
  return {counts, total};
};

export default useGetCounts;
