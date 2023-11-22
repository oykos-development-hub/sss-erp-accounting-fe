import React, {useMemo, useState} from 'react';
import {Table, Theme, PlusIcon, Modal, Typography, Tooltip} from 'client-library';
import {tableHeads} from './constants';
import {Container, CustomDivider, MainTitle, TableHeader} from './styles';
import useProcurementContracts from '../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import {ProcurementContract} from '../../types/graphql/procurementContractsTypes';
import useGetSuppliers from '../../services/graphql/suppliers/hooks/useGetSuppliers';
import {ScreenWrapper} from '../../shared/screenWrapper';
import useAppContext from '../../context/useAppContext';
import {ContractsFilters} from './contractFilters/contractFilters';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import {parseDateForBackend} from '../../utils/dateUtils';

export const ContractsMainPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const {alert, breadcrumbs, navigation} = useAppContext();
  const [selectedSupplier, setSelectedSupplier] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const {mutate: orderListInsert} = useOrderListInsert();

  const {data: tableData, loading} = useProcurementContracts({
    id: 0,
    procurement_id: 0,
    supplier_id: selectedSupplier,
  });

  const filteredTableData = tableData?.filter(item => {
    const searchString = searchQuery.toLowerCase();
    const supplier = item?.supplier.title.toLowerCase();
    const serialNumber = item?.serial_number.toLowerCase();
    const procurementTitle = item?.public_procurement?.title?.toLowerCase();

    return (
      supplier.includes(searchString) || serialNumber.includes(searchString) || procurementTitle.includes(searchString)
    );
  });

  const {suppliers} = useGetSuppliers({id: 0, search: null, page: 1, size: 100});

  const [selectedItemId, setSelectedItemId] = useState(0);

  const selectedItem = useMemo(() => {
    return tableData?.find((item: ProcurementContract) => item.id === selectedItemId);
  }, [tableData, selectedItemId]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  const openModal = (item: any) => {
    setShowModal(true);
    setSelectedItemId(item.id);
  };

  const handleSubmit = async () => {
    try {
      const payload: any = {
        id: 0,
        public_procurement_id: selectedItem?.public_procurement?.id,
        date_order: parseDateForBackend(new Date()),
        order_file: null,
        articles: [],
        supplier_id: 0,
      };

      orderListInsert(payload, async orderID => {
        alert.success('Uspješno sačuvano.');
        closeModal();
        navigation.navigate(`/accounting/${selectedItem?.public_procurement?.id}/order-form/${orderID}`);
      });
    } catch (e) {
      alert.error('Greška. Promjene nisu sačuvane.');
    }
  };

  return (
    <ScreenWrapper>
      <Container>
        <MainTitle content="LISTA SVIH UGOVORA" variant="bodyMedium" />
        <CustomDivider />
        <TableHeader>
          <ContractsFilters
            suppliers={suppliers || []}
            setFilters={({year, supplier_id}) => {
              // setSelectedYear(year);
              setSelectedSupplier(supplier_id);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </TableHeader>

        <div>
          <Table
            tableHeads={tableHeads}
            data={filteredTableData || []}
            isLoading={loading}
            onRowClick={row => {
              navigation.navigate(`/accounting/contracts/${row.id.toString()}/contract-details`);
              breadcrumbs.add({
                name: `Detalji zaključenog ugovora ${row?.serial_number} `,
                to: `/accounting/contracts/${row.id.toString()}/contract-details`,
              });
            }}
            tableActions={[
              {
                name: 'addFormOrder',
                onClick: (item: any) => openModal(item),
                icon: (
                  <Tooltip content="Dodaj narudžbenicu" variant="standard" position="topLeft">
                    <PlusIcon stroke={Theme?.palette?.gray800} />
                  </Tooltip>
                ),
              },
            ]}
          />
        </div>
        {showModal && (
          <Modal
            open={showModal}
            onClose={closeModal}
            leftButtonText="Otkaži"
            rightButtonText="Nastavi"
            rightButtonOnClick={handleSubmit}
            content={
              <div>
                <Typography
                  variant="bodyMedium"
                  content="Da li želite da kreirate novu narudžbenicu od izabranog ugovora?"
                />
              </div>
            }
            title="KREIRANJE NOVE NARUDŽBENICE"
          />
        )}
      </Container>
    </ScreenWrapper>
  );
};
