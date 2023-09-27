import {Button, Dropdown, Pagination, PrinterIcon, Table, Theme, TrashIcon, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {AccountingOrderModal} from '../../components/accountingOrderModal/accountingOrderModal';
import useDeleteOrderList from '../../services/graphql/orders/hooks/useDeleteOrderList';
import useGetOrderList from '../../services/graphql/orders/hooks/useGetOrderList';
import useGetSuppliers from '../../services/graphql/suppliers/hooks/useGetSuppliers';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {Supplier} from '../../types/graphql/supplierTypes';
import {ScreenProps} from '../../types/screen-props';
import {tableHeads} from './constants';
import {ButtonWrapper, Container, CustomDivider, FiltersWrapper, MainTitle, TableHeader} from './styles';

export const AccountingOrdersMainPage: React.FC<ScreenProps> = ({context}) => {
  const [showModal, setShowModal] = useState(false);
  const isAdmin = context?.contextMain?.role_id === 123;
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [page, setPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {data: suppliers} = useGetSuppliers({id: 0, search: ''});

  const [form, setForm] = useState<any>({
    supplier: {id: 0, title: ''},
  });

  const handleChange = (value: any, name: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const suppliersOptions = useMemo(() => {
    const options = suppliers.map((supplier: Supplier) => ({
      id: supplier.id,
      title: supplier.title,
    }));
    options.unshift({id: 0, title: 'Sve'});
    return options;
  }, [suppliers]);

  const {orders, total, fetch} = useGetOrderList(page, 10, 0, form?.supplier?.id, '', '');
  const {mutate: deleteOrder} = useDeleteOrderList();

  const selectedItem = useMemo(() => {
    return orders?.find((item: any) => item.id === selectedItemId);
  }, [orders, selectedItemId]);

  const handleAdd = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

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
      deleteOrder(
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
    setSelectedItemId(0);
  };

  const handlePrintIconClick = (id: number) => {
    console.log('Handle print', id);
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  useEffect(() => {
    fetch();
  }, [form]);

  return (
    <ScreenWrapper context={context}>
      <Container>
        <MainTitle content="LISTA SVIH NARUDŽBENICA" variant="bodyMedium" />
        <CustomDivider />
        <TableHeader>
          <FiltersWrapper>
            <Dropdown
              label={<Typography variant="bodySmall" content="DOBAVLJAČ:" />}
              options={suppliersOptions as any}
              name="supplier"
              value={form?.supplier || null}
              onChange={handleChange}
              placeholder="DOBAVLJAČ:"
              isSearchable={true}
            />
          </FiltersWrapper>
          {isAdmin && (
            <ButtonWrapper>
              <Button
                variant="secondary"
                content={<Typography variant="bodyMedium" content="Nova narudžbenica" />}
                onClick={handleAdd}
              />
            </ButtonWrapper>
          )}
        </TableHeader>

        <div>
          <Table
            tableHeads={isAdmin ? tableHeads : tableHeads.filter(item => item.accessor !== 'TABLE_ACTIONS')}
            data={(orders as any) || []}
            onRowClick={row => {
              context.navigation.navigate(
                `/accounting/${row?.public_procurement?.id}/order-form/${row?.id}/order-details`,
              );
              context.breadcrumbs.add({
                name: `Detalji narudžbenice - ${row?.id} `,
                to: `/accounting/${row?.public_procurement?.id}/order-form/${row?.id}/order-details`,
              });
            }}
            tableActions={[
              {
                name: 'Obriši',
                onClick: item => handleDeleteIconClick(item.id),
                icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              },
              {
                name: 'Stampaj',
                onClick: item => handlePrintIconClick(item.id),
                icon: <PrinterIcon stroke={Theme?.palette?.gray800} />,
              },
            ]}
          />
        </div>
        <Pagination
          pageCount={total / 10}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={2}
          previousLabel="Prethodna"
          nextLabel="Sledeća"
          pageRangeDisplayed={3}
        />
        {showModal && (
          <AccountingOrderModal
            alert={context.alert}
            fetch={fetch}
            open={showModal}
            onClose={closeModal}
            selectedItem={selectedItem}
            navigate={context.navigation.navigate}
          />
        )}
        <NotificationsModal
          open={!!showDeleteModal}
          onClose={handleCloseDeleteModal}
          handleLeftButtomClick={handleDelete}
          subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
        />
      </Container>
    </ScreenWrapper>
  );
};
