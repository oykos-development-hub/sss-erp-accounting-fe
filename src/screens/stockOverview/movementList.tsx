import {Dropdown, EditIconTwo, Table, Theme, TrashIcon, PrinterIcon} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {EditMovementModal} from '../../components/editMovementModal/editMovementModal';
import useAppContext from '../../context/useAppContext';
import useDeleteMovement from '../../services/graphql/movement/hooks/useDeleteMovement';
import useGetMovementOverview from '../../services/graphql/movement/hooks/useGetMovementOverview';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useGetRecipientUsersOverview from '../../services/graphql/recipientUsersOverview/hooks/useGetRecipientUsers';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import {tableHeadsMovement} from './constants';
import {MovementListFilters} from './styles';
import {MovementDetailsItems} from '../../types/graphql/movementTypes';

export const MovementList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {
    contextMain,
    alert,
    navigation: {navigate},
    breadcrumbs,
    reportService: {generatePdf},
  } = useAppContext();
  const {control, watch} = useForm();
  const office = watch('office')?.id;
  const recipient = watch('recipient')?.id;
  const organisationUnitId = contextMain?.organization_unit?.id;

  const [form, setForm] = useState({
    office_id: office,
    recipient_user_id: recipient,
  });

  const {movementItems, fetch} = useGetMovementOverview({office_id: office, recipient_user_id: recipient});
  const {officesOfOrganizationUnits} = useGetOfficesOfOrganizationUnits(0, organisationUnitId, '');
  const {recipientUsers} = useGetRecipientUsersOverview();
  const {mutate} = useDeleteMovement();

  const officesDropdownData = useMemo(() => {
    if (officesOfOrganizationUnits) {
      const offices = officesOfOrganizationUnits?.map(office => ({id: office?.id, title: office?.title}));
      return [{id: null, title: 'Sve'}, ...offices];
    } else {
      return [];
    }
  }, [officesOfOrganizationUnits]);

  const usersDropdownData = useMemo(() => {
    if (recipientUsers && recipientUsers.length > 0) {
      const usersData = recipientUsers.map((user: any) => ({id: user?.id, title: user?.title}));
      return [{id: null, title: 'Sve'}, ...usersData];
    } else {
      return [];
    }
  }, [recipientUsers]);
  const selectedItem = useMemo(() => {
    return movementItems?.find(item => item.id === selectedItemId);
  }, [selectedItemId]);
  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleEditIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowEditModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const handleDelete = () => {
    if (showDeleteModal) {
      mutate(
        selectedItemId,
        () => {
          setShowDeleteModal(false);
          fetch();
          alert.success('Uspješno obrisano.');
        },
        () => {
          alert.success('Greška. Brisanje nije moguće.');
        },
      );
    }
    setSelectedItemId(0);
  };

  const generateMovementPdf = (item: MovementDetailsItems) => {
    generatePdf('MOVEMENT_RECEIPT', {
      office: item.office?.title,
      recipient: item.recipient_user?.title,
      date: item.date_order,
      articles: item.articles,
    });
  };

  const handleSort = (column: string, direction: string) => {
    const sorter = `sort_by_${column}`;
    setForm((prevState: any) => ({
      office_id: prevState.office_id,
      recipient_user_id: prevState.recipient_user_id,
      [sorter]: direction,
    }));
  };

  useEffect(() => {
    fetch();
  }, [form]);

  return (
    <>
      <MovementListFilters>
        <Controller
          name="office"
          control={control}
          render={({field: {onChange, name, value}}) => (
            <Dropdown
              onChange={onChange}
              value={value}
              name={name}
              label="KANCELARIJA:"
              options={officesDropdownData || []}
            />
          )}
        />
        <Controller
          name="recipient"
          control={control}
          render={({field: {onChange, name, value}}) => {
            return (
              <Dropdown
                onChange={onChange}
                value={value as any}
                name={name}
                label="PRIMALAC:"
                options={usersDropdownData || []}
              />
            );
          }}
        />
      </MovementListFilters>
      <Table
        tableHeads={tableHeadsMovement}
        data={movementItems}
        onSort={handleSort}
        onRowClick={row => {
          navigate(`/accounting/stock/${row.id.toString()}/movement`);
          breadcrumbs.add({
            name: 'Detalji otpremnice',
            to: `/accounting/stock/${row.id.toString()}/movement`,
          });
        }}
        tableActions={[
          {
            name: 'Izmijeni',
            onClick: item => handleEditIconClick(item.id),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'Obriši',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'Štampaj',
            onClick: item => generateMovementPdf(item),
            icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />

      <NotificationsModal
        open={!!showDeleteModal}
        onClose={handleCloseDeleteModal}
        handleLeftButtomClick={handleDelete}
        subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema.'}
      />
      {showEditModal && (
        <EditMovementModal
          open={showEditModal}
          onClose={refetch => {
            setShowEditModal(false);
            if (refetch) {
              fetch();
            }
          }}
          selectedItem={selectedItem}
          alert={alert}
          navigate={navigate}
          dropdownData={{
            offices: officesDropdownData,
            users: usersDropdownData,
          }}
        />
      )}
    </>
  );
};
