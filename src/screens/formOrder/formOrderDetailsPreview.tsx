import {Accordion, Button, ChevronDownIcon, Table, TrashIcon, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import FileList from '../../components/fileList/fileList';
import {ReceiveItemsModal} from '../../components/receiveItems/receiveItemsModal';
import {ReceiveItemsTable} from '../../components/receiveItems/receiveItemsTable';
import useAppContext from '../../context/useAppContext';
import useDeleteOrderListReceive from '../../services/graphql/orders/hooks/useDeleteOrderListReceive';
import useGetOrderList from '../../services/graphql/orders/hooks/useGetOrderList';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox} from '../../shared/styles';
import {parseDate} from '../../utils/dateUtils';
import {tableHeads} from './constants';
import {AccordionHeader, AccordionIconsWrapper, AccordionWrapper, FormControls, FormFooter, OrderInfo} from './styles';

export const FormOrderDetailsPreview: React.FC = () => {
  //fixed for now, will be dynamic
  const {alert, breadcrumbs, navigation} = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpen, setIsOpen] = useState<number>(0);

  let date = '';
  const url = navigation.location.pathname;
  const orderId = Number(url?.split('/').at(-2));

  const {orders, loading, fetch} = useGetOrderList(1, 10, orderId, 0, '', '');
  const {mutate: deleteOrderListReceive} = useDeleteOrderListReceive();

  const supplier = orders[0]?.supplier;
  const dateOrder = orders[0]?.date_order || '';

  if (dateOrder) {
    const convertDate = new Date(dateOrder);
    date = parseDate(convertDate);
  }

  const mappedOrder = useMemo(() => {
    if (orders) {
      return orders[0]?.articles?.map((order: any) => {
        return {
          ...order,
          order_id: orderId,
        };
      });
    } else {
      return [];
    }
  }, [orders]);

  const handleAddReceiveItems = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openAccordion = (id: number) => {
    setIsOpen(prevState => (prevState === id ? 0 : id));
  };

  const handleDeleteIconClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    if (showDeleteModal) {
      deleteOrderListReceive(
        orderId,
        () => {
          setShowDeleteModal(false);
          fetch();
          alert.success('Uspješno obrisano');
        },
        () => {
          setShowDeleteModal(false);
          alert.success('Došlo je do greške pri brisanju');
        },
      );
    }
  };

  const orderFile = orders[0]?.order_file;
  const movementFile = orders[0]?.movement_file;
  const receiveFile = orders[0]?.receive_file;

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`NARUDŽBENICA - BROJ. N${orderId}`} />
        <CustomDivider />
        <OrderInfo>
          <div>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'JAVNA NABAVKA:'} />
              <Typography variant="bodySmall" content={`${orders && orders[0]?.public_procurement?.title}`} />
            </Row>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'DOBAVLJAČ:'} />
              <Typography variant="bodySmall" content={`${supplier?.title || ''} `} />
            </Row>
            <>
              <Row>
                <Typography variant="bodySmall" style={{fontWeight: 600}} content={'DATUM:'} />
                <Typography variant="bodySmall" content={`${date || ''}`} />
              </Row>
              {orderFile?.id !== 0 && (
                <Row>
                  <Typography variant="bodySmall" style={{fontWeight: 600}} content={'NARUDŽBENICA:'} />
                  <FileList files={(orderFile && [orderFile]) ?? []} />
                </Row>
              )}
              {receiveFile?.id !== 0 && (
                <Row>
                  <Typography variant="bodySmall" style={{fontWeight: 600}} content={'PRIJEMNICA:'} />
                  <FileList files={(receiveFile && [receiveFile]) ?? []} />
                </Row>
              )}
              {movementFile?.id !== 0 && (
                <Row>
                  <Typography variant="bodySmall" style={{fontWeight: 600}} content={'OTPREMNICA:'} />
                  <FileList files={(movementFile && [movementFile]) ?? []} />
                </Row>
              )}
            </>
          </div>
          <div>
            <Button
              content="Kreiraj prijemnicu"
              size="sm"
              variant="secondary"
              disabled={!!orders[0]?.invoice_date}
              onClick={handleAddReceiveItems}
            />
          </div>
        </OrderInfo>

        <Table tableHeads={tableHeads} data={mappedOrder || []} isLoading={loading} />

        {orders[0]?.invoice_date && orders[0]?.date_system && (
          <AccordionWrapper>
            <Accordion
              style={{border: 0, padding: 0, marginBottom: 20, display: 'block'}}
              isOpen={isOpen === orders[0]?.id ? true : false}
              customHeader={
                <AccordionHeader>
                  <Typography variant="bodyMedium" content={`Prijemnica - ${orders[0].id}`} style={{fontWeight: 600}} />
                  <AccordionIconsWrapper isOpen={isOpen === orders[0]?.id}>
                    <ChevronDownIcon
                      width="15px"
                      height="8px"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        openAccordion(orders[0]?.id || 0);
                      }}
                    />
                    <TrashIcon
                      onClick={() => {
                        handleDeleteIconClick();
                      }}
                      style={{padding: '10px'}}
                    />
                  </AccordionIconsWrapper>
                </AccordionHeader>
              }
              content={
                <>
                  <ReceiveItemsTable data={orders[0]} fetch={fetch} loading={loading} />
                </>
              }
            />
          </AccordionWrapper>
        )}

        <FormFooter>
          <FormControls>
            <Button
              content="Nazad"
              variant="secondary"
              onClick={() => {
                navigation.navigate('/accounting/order-form');
                breadcrumbs.remove();
              }}
            />
          </FormControls>
        </FormFooter>

        {showModal && (
          <ReceiveItemsModal open={showModal} onClose={closeModal} fetch={fetch} data={orders} alert={alert} />
        )}

        <NotificationsModal
          open={!!showDeleteModal}
          onClose={handleCloseDeleteModal}
          handleLeftButtomClick={handleDelete}
          subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};
