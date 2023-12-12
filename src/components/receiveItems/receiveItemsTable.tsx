import {EditIconTwo, Table, TableHead, Theme, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import useAppContext from '../../context/useAppContext';
import {SectionBox} from '../../shared/styles';
import {parseDate} from '../../utils/dateUtils';
import {ReceiveItemsModal} from './receiveItemsModal';

interface ReceiveItemsTableProps {
  data: any;
  fetch: () => any;
  loading: boolean;
}

export const ReceiveItemsTable: React.FC<ReceiveItemsTableProps> = ({data, fetch, loading}) => {
  const {alert} = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const tableHeads: TableHead[] = [
    {
      title: 'Datum prijema robe',
      accessor: 'date_system',
      type: 'custom',
      renderContents: (date_system: string) => {
        return <Typography variant="bodySmall" content={date_system ? parseDate(date_system) : ''} />;
      },
    },
    {
      title: 'Broj fakture',
      accessor: 'invoice_number',
      type: 'text',
    },
    {
      title: 'Datum fakture',
      accessor: 'invoice_date',
      type: 'custom',
      renderContents: (invoice_date: string) => {
        return <Typography variant="bodySmall" content={invoice_date ? parseDate(invoice_date) : ''} />;
      },
    },
    {
      title: 'Ukupna vrijednost (sa PDV-OM):',
      accessor: 'total_bruto',
      type: 'custom',
      renderContents: (total_bruto: number) => {
        return (
          <Typography
            variant="bodyMedium"
            content={
              total_bruto
                ? total_bruto.toLocaleString('sr-RS', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ''
            }
          />
        );
      },
      shouldRender: Number(data?.public_procurement?.id) !== 0,
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const selectedItem = useMemo(() => {
    return [data]?.find((item: any) => item.id === selectedItemId);
  }, [data?.articles, selectedItemId]);

  const handleEdit = (id: number) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <SectionBox>
      <Table
        tableHeads={tableHeads}
        data={[data] || []}
        isLoading={loading}
        tableActions={[
          {
            name: 'Izmijeni',
            onClick: item => handleEdit(item.id),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      {showModal && (
        <ReceiveItemsModal open={showModal} onClose={closeModal} fetch={fetch} data={[selectedItem]} alert={alert} />
      )}
    </SectionBox>
  );
};
