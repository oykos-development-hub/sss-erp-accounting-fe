import {Table, TableHead, Typography, TrashIcon, PrinterIcon, Theme} from 'client-library';
import React, {useState} from 'react';
import {SectionBox} from '../../shared/styles';
import {parseDate} from '../../utils/dateUtils';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import {MicroserviceProps} from '../../types/micro-service-props';
import useDeleteOrderListAssetMovement from '../../services/graphql/movement/hooks/useDeleteOrderListAssetMovement';
import useAppContext from '../../context/useAppContext';

interface ReceiveItemsTableProps {
  data: any;
  fetch: () => any;
  loading: boolean;
}

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
    title: 'Lokacija',
    accessor: 'office',
    type: 'custom',
    renderContents: (office: any) => {
      return <Typography variant="bodySmall" content={office?.title} />;
    },
  },
  {
    title: 'Primalac',
    accessor: 'recipient_user',
    type: 'custom',
    renderContents: (recipient_user: any) => {
      return <Typography variant="bodySmall" content={recipient_user?.title} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const AssetMovementTable: React.FC<ReceiveItemsTableProps> = ({data, fetch, loading}) => {
  const {alert} = useAppContext();
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {mutate: deleteAssetMovement} = useDeleteOrderListAssetMovement();

  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const handleDelete = () => {
    if (showDeleteModal) {
      deleteAssetMovement(
        selectedItemId,
        () => {
          setShowDeleteModal(false);
          fetch();
          alert.success('Uspješno obrisano.');
        },
        () => {
          setShowDeleteModal(false);
          alert.success('Greška. Brisanje nije moguće.');
        },
      );
    }
    setShowDeleteModal(false);
  };

  const handlePrintIconClick = (id: number) => {
    setSelectedItemId(id);
  };

  return (
    <SectionBox>
      <Table
        tableHeads={tableHeads}
        data={[data] || []}
        isLoading={loading}
        tableActions={[
          {
            name: 'Štampaj',
            onClick: item => handlePrintIconClick(item.id),
            icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'Obriši',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      <NotificationsModal
        open={!!showDeleteModal}
        onClose={handleCloseDeleteModal}
        handleLeftButtomClick={handleDelete}
        subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
      />
    </SectionBox>
  );
};
