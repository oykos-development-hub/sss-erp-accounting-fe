import {EditIconTwo, PrinterIcon, Table, TableHead, Theme, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {SectionBox} from '../../shared/styles';
import {MicroserviceProps} from '../../types/micro-service-props';
import {parseDate} from '../../utils/dateUtils';
import {ReceiveItemsModal} from './receiveItemsModal';

interface ReceiveItemsTableProps {
  data: any;
  context: MicroserviceProps;
  fetch: () => any;
}

const tableHeads: TableHead[] = [
  {
    title: 'ID',
    accessor: 'id',
    type: 'text',
  },
  {
    title: 'Datum prijema robe',
    accessor: 'date_system',
    type: 'custom',
    renderContents: (date_system: string) => {
      return <Typography variant="bodySmall" content={date_system ? parseDate(date_system, true) : ''} />;
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
      return <Typography variant="bodySmall" content={invoice_date ? parseDate(invoice_date, true) : ''} />;
    },
  },
  {
    title: 'Ukupna vrijednost',
    accessor: 'total_price',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const ReceiveItemsTable: React.FC<ReceiveItemsTableProps> = ({data, context, fetch}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const selectedItem = useMemo(() => {
    return [data]?.find((item: any) => item.id === selectedItemId);
  }, [data?.articles, selectedItemId]);

  const handleEdit = (id: number) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const handlePrintIconClick = (id: number) => {
    setSelectedItemId(id);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <SectionBox>
      <Table
        tableHeads={tableHeads}
        data={[data] || []}
        tableActions={[
          {
            name: 'Izmijeni',
            onClick: item => handleEdit(item.id),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'Štampaj',
            onClick: item => handlePrintIconClick(item.id),
            icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      {showModal && (
        <ReceiveItemsModal
          open={showModal}
          onClose={closeModal}
          fetch={fetch}
          data={[selectedItem]}
          alert={context?.alert}
        />
      )}
    </SectionBox>
  );
};
