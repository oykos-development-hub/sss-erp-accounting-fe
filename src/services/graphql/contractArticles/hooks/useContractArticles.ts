import {useEffect, useState} from 'react';
import {ContractArticleGet, ContractArticlesGetResponse} from '../../../../types/graphql/contractsArticlesTypes';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getContractArticles';

const useContractArticles = (id: number, organization_unit_id?: number) => {
  const [contractArticles, setContractArticles] = useState<ContractArticleGet[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchContractArticles = async () => {
    const response: ContractArticlesGetResponse = await fetch(query, {contract_id: id, organization_unit_id});
    setContractArticles(response?.publicProcurementContractArticles_Overview.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchContractArticles();
  }, [id, organization_unit_id]);

  return {data: contractArticles, loading, refetchData: fetchContractArticles};
};

export default useContractArticles;
