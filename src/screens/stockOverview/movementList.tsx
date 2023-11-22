import {Dropdown, EditIconTwo, Table, Theme, TrashIcon} from 'client-library';
import {useMemo, useState} from 'react';
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

export const MovementList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {
    contextMain,
    alert,
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  const {control, watch} = useForm();
  const office = watch('office')?.id;
  const recipient = watch('recipient')?.id;
  const organisationUnitId = contextMain?.organization_unit?.id;

  const {movementItems, fetch} = useGetMovementOverview(office, recipient);
  const {officesOfOrganizationUnits} = useGetOfficesOfOrganizationUnits(0, organisationUnitId, '');
  const {recipientUsers} = useGetRecipientUsersOverview();
  const {mutate} = useDeleteMovement();

  const officesDropdownData = useMemo(() => {
    if (officesOfOrganizationUnits) {
      return officesOfOrganizationUnits?.map(office => ({id: office?.id, title: office?.title}));
    }
  }, [officesOfOrganizationUnits]);

  const usersDropdownData = useMemo(() => {
    if (recipientUsers) {
      return recipientUsers?.map((user: any) => ({id: user?.id, title: user?.title}));
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
        onRowClick={row => {
          navigate(`/accounting/stock/${row.id.toString()}/movement`);
          breadcrumbs.add({
            name: `Detalji otpremnice`,
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
