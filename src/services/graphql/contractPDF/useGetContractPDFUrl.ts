import {useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import getContractPDFUrl from './getContractPDFUrl';
import {REQUEST_STATUSES} from '../../constants';

type GetContractPDFParams = {
  id: number;
  organization_unit_id?: number;
};

const useGetContractPDFUrl = (data: GetContractPDFParams) => {
  // const [url, setUrl] = useState([]);
  const [loading, setLoading] = useState(false);

  const {fetch, alert} = useAppContext();

  const fetchPDFUrl = async () => {
    if (loading) return;

    setLoading(true);
    const response: any = await fetch(getContractPDFUrl, data);
    if (response.publicProcurementPlanItem_PDF.status === REQUEST_STATUSES.success) {
      const binaryData = atob(response.publicProcurementPlanItem_PDF.item);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([byteArray], {type: 'application/octet-stream'});
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'izvještaj.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);

      link.click();

      URL.revokeObjectURL(blobUrl);
    } else {
      alert.error('Došlo je do greške prilikom preuzimanja izvještaja');
    }

    setLoading(false);
  };

  return {fetchPDFUrl, loading};
};

export default useGetContractPDFUrl;
