import {Table, TableHead, Typography, TrashIcon, PrinterIcon, Theme} from 'client-library';
import React, {useState} from 'react';
import {SectionBox} from '../../shared/styles';
import {parseDate} from '../../utils/dateUtils';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import {MicroserviceProps} from '../../types/micro-service-props';
import useDeleteOrderListAssetMovement from '../../services/graphql/movement/hooks/useDeleteOrderListAssetMovement';

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

export const AssetMovementTable: React.FC<ReceiveItemsTableProps> = ({data, context, fetch}) => {
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
          context.alert.success('Uspješno obrisano');
        },
        () => {
          setShowDeleteModal(false);
          context.alert.success('Došlo je do greške pri brisanju');
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
        tableActions={[
          {
            name: 'Stampaj',
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
