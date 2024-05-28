import {Button, Dropdown, Pagination, Table, Theme, TrashIcon, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {AccountingOrderModal} from '../../components/accountingOrderModal/accountingOrderModal';
import {ExceptionModal} from '../../components/exceptionModal/exceptionModal';
import useAppContext from '../../context/useAppContext';
import useDeleteOrderList from '../../services/graphql/orders/hooks/useDeleteOrderList';
import useGetOrderList from '../../services/graphql/orders/hooks/useGetOrderList';
import useGetSuppliers from '../../services/graphql/suppliers/hooks/useGetSuppliers';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../shared/screenWrapper';
import {Supplier} from '../../types/graphql/supplierTypes';
import {useDebounce} from '../../utils/useDebounce';
import {tableHeads} from './constants';
import {ButtonWrapper, Container, CustomDivider, FiltersWrapper, MainTitle, TableHeader} from './styles';

export const AccountingOrdersMainPage: React.FC = () => {
  const {alert, breadcrumbs, navigation} = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const {suppliers} = useGetSuppliers({id: 0, search: null, page: 1, size: 100});

  const [form, setForm] = useState<any>({
    page: 1,
    size: 10,
    order_id: 0,
    supplier: {id: 0, title: ''},
    status: '',
    search: '',
  });

  const debouncedForm = useDebounce(form, 500);

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
    options.unshift({id: null, title: 'Sve'});
    return options;
  }, [suppliers]);

  const {orders, total, fetch, loading} = useGetOrderList({...form, supplier_id: form?.supplier?.id || null});
  const {mutate: deleteOrder} = useDeleteOrderList();

  const selectedItem = useMemo(() => {
    return orders?.find((item: any) => item.id === selectedItemId);
  }, [orders, selectedItemId]);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleOpenModal = () => {
    setShowExceptionModal(true);
  };

  const closeExceptionModal = () => {
    setShowExceptionModal(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
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
          fetch();
          setShowDeleteModal(false);
          alert.success('Uspješno obrisano.');
        },
        () => {
          setShowDeleteModal(false);
          alert.error('Došlo je do greške pri brisanju.');
        },
      );
    }
    setSelectedItemId(0);
  };

  const onPageChange = (page: number) => {
    setForm((prevState: any) => ({
      ...prevState,
      page,
    }));
  };

  const handleSort = (column: string, direction: string) => {
    const sorter = column === 'total_bruto' ? 'sort_by_total_price' : `sort_by_${column}`;
    setForm((prevState: any) => ({
      page: prevState.page,
      size: prevState.size,
      order_id: prevState.order_id,
      supplier_id: prevState.supplier_id,
      status: prevState.status,
      search: prevState.search,
      [sorter]: direction,
    }));
  };

  useEffect(() => {
    fetch();
  }, [debouncedForm]);

  return (
    <ScreenWrapper>
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
          <ButtonWrapper>
            <Button
              variant="secondary"
              content={<Typography variant="bodyMedium" content="Nova narudžbenica" />}
              onClick={handleAdd}
              style={{marginRight: 10}}
            />
            <Button
              variant="secondary"
              content={<Typography variant="bodyMedium" content="Izuzeće od plana" />}
              onClick={handleOpenModal}
            />
          </ButtonWrapper>
        </TableHeader>

        <div>
          <Table
            tableHeads={tableHeads}
            data={(orders as any) || []}
            isLoading={loading}
            onSort={handleSort}
            onRowClick={row => {
              if (Number(row?.public_procurement?.id) !== 0) {
                navigation.navigate(`/accounting/${row?.public_procurement?.id}/order-form/${row?.id}/order-details`);
                breadcrumbs.add({
                  name: `Detalji narudžbenice - ${row?.public_procurement?.title} `,
                  to: `/accounting/${row?.public_procurement?.id}/order-form/${row?.id}/order-details`,
                });
              } else if (Number(row?.public_procurement?.id) === 0) {
                navigation.navigate(`/accounting/${row?.group_of_articles?.id}/order-form/${row?.id}/order-details`);
                breadcrumbs.add({
                  name: row.is_pro_forma_invoice
                    ? `Detalji predračuna - ${row?.group_of_articles?.title} `
                    : `Detalji narudžbenice - ${row?.group_of_articles?.title} `,
                  to: `/accounting/${row?.group_of_articles?.id}/order-form/${row?.id}/order-details`,
                });
              }
            }}
            tableActions={[
              {
                name: 'Obriši',
                onClick: item => handleDeleteIconClick(item.id),
                icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                shouldRender: item => item.status !== 'Receive',
              },
            ]}
          />
        </div>
        <Pagination
          pageCount={total / 10}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={2}
          pageRangeDisplayed={3}
        />

        {showAddModal && (
          <AccountingOrderModal alert={alert} open={showAddModal} onClose={closeModal} selectedItem={selectedItem} />
        )}

        {showExceptionModal && <ExceptionModal alert={alert} open={showExceptionModal} onClose={closeExceptionModal} />}

        <NotificationsModal
          open={!!showDeleteModal}
          onClose={handleCloseDeleteModal}
          handleLeftButtomClick={handleDelete}
          subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema.'}
        />
      </Container>
    </ScreenWrapper>
  );
};
