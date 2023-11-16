import {useEffect, useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import {PublicProcurement} from '../../../../types/graphql/publicProcurementTypes';
import useAppContext from '../../../../context/useAppContext';
import {ProcurementPlanItemDetailsGetResponse} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';
import query from '../queries/procurementGetDetails';

const usePublicProcurementGetDetails = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const [publicProcurement, setPublicProcurement] = useState<PublicProcurement>();

  const getProcurementDetails = async (onSuccess?: () => void, onError?: () => void) => {
    if (!id) {
      return;
    }
    setLoading(true);
    const response: ProcurementPlanItemDetailsGetResponse = await fetch(query, {id});
    if (response?.publicProcurementPlanItem_Details.status === REQUEST_STATUSES.success) {
      response?.publicProcurementPlanItem_Details.items &&
        setPublicProcurement(response.publicProcurementPlanItem_Details?.items[0]);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  useEffect(() => {
    getProcurementDetails();
  }, [id]);

  return {loading, publicProcurement, refetch: getProcurementDetails};
};

export default usePublicProcurementGetDetails;
