import {
  Button,
  MicroserviceProps,
  Table,
  TableHead,
  Typography,
  Accordion,
  ChevronDownIcon,
  MoreVerticalIcon,
} from 'client-library';
import React, {useMemo, useState} from 'react';
import useGetOrderList from '../../services/graphql/orders/hooks/useGetOrderList';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox, SubTitle} from '../../shared/styles';
import {
  AccordionHeader,
  AccordionIconsWrapper,
  AccordionWrapper,
  FormControls,
  FormFooter,
  Menu,
  MenuItem,
  MovementTableContainer,
  OrderInfo,
  TableTitle,
  Totals,
} from './styles';
import {ReceiveItemsModal} from '../../components/receiveItems/receiveItemsModal';
import {ReceiveItemsTable} from '../../components/receiveItems/receiveItemsTable';
import {AssetMovementTable} from '../../components/assetMovement/assetMovementTable';
import {AssetMovementModal} from '../../components/assetMovement/assetMovementModal';
import {parseDate} from '../../utils/dateUtils';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import useDeleteOrderListReceive from '../../services/graphql/orders/hooks/useDeleteOrderListReceive';

interface FormOrderDetailsPageProps {
  context: MicroserviceProps;
}

export const FormOrderDetailsPreview: React.FC<FormOrderDetailsPageProps> = ({context}) => {
  //fixed for now, will be dynamic
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpen, setIsOpen] = useState<number>(0);
  const [showModalMovement, setShowModalMovement] = useState(false);

  let date = '';
  const url = context?.navigation.location.pathname;
  const orderId = Number(url?.split('/').at(-2));
  const procurementID = Number(url?.split('/').at(-4));

  const {orders, fetch} = useGetOrderList(1, 10, orderId, 0, '', '');
  const {mutate: deleteOrderListReceive} = useDeleteOrderListReceive();

  const supplier = orders[0]?.supplier;
  const dateOrder = orders[0]?.date_order || '';

  if (dateOrder) {
    const convertDate = new Date(dateOrder);
    date = parseDate(convertDate, true);
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

  const handleAddMovement = () => {
    setShowModalMovement(true);
  };

  const closeModalMovement = () => {
    setShowModalMovement(false);
  };

  const tableHeads: TableHead[] = [
    {
      title: 'Naziv',
      accessor: 'title',
      type: 'text',
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'description',
      type: 'text',
    },
    {
      title: 'Proizvođač',
      accessor: 'manufacturer',
      type: 'text',
    },
    {
      title: 'Jedinica mjere',
      accessor: 'unit',
      type: 'text',
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'text',
    },

    {
      title: 'Narudžbenica',
      accessor: 'order_id',
      type: 'text',
    },
    {
      title: 'Ukupna vrijednost (sa PDV-OM):',
      accessor: 'total_price',
      type: 'text',
    },
  ];

  const openAccordion = (id: number) => {
    setIsOpen(prevState => (prevState === id ? 0 : id));
  };

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const showMenuHandler = () => {
    setShowMenu(prevState => !prevState);
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
          context.alert.success('Uspješno obrisano');
        },
        () => {
          setShowDeleteModal(false);
          context.alert.success('Došlo je do greške pri brisanju');
        },
      );
    }
  };

  return (
    <ScreenWrapper context={context}>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`NARUDŽBENICA - BROJ. N${orderId}`} />
        <CustomDivider />
        <OrderInfo>
          <div>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'JAVNA NABAVKA:'} />
              <Typography variant="bodySmall" content={`${procurementID}`} />
            </Row>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'DOBAVLJAČ:'} />
              <Typography variant="bodySmall" content={`${supplier?.title || ''} `} />
            </Row>
            <>
              <Row>
                <Typography variant="bodySmall" style={{fontWeight: 600}} content={'DATUM KREIRANJA:'} />
                <Typography variant="bodySmall" content={`${date || ''}`} />
              </Row>
            </>
          </div>
          <div>
            <Button
              content="Kreiraj prijemnicu"
              size="sm"
              variant="secondary"
              // disabled={orders[0]?.invoice_date !== '' || false}
              onClick={handleAddReceiveItems}
            />
          </div>
        </OrderInfo>

        <Table tableHeads={tableHeads} data={mappedOrder || []} />
        <Totals>
          <Row>
            <SubTitle variant="bodySmall" content="UKUPNA NETO VRIJEDNOST:" />
            <Typography variant="bodySmall" content={`${orders[0]?.total_price || '0'}`} />
          </Row>
          <Row>
            <SubTitle variant="bodySmall" content="UKUPNA BRUTO VRIJEDNOST:" />
            <Typography variant="bodySmall" content={`${orders[0]?.total_price || '0'}`} />
          </Row>
        </Totals>

        {orders[0]?.invoice_date && orders[0]?.date_system && (
          <AccordionWrapper>
            <Accordion
              style={{border: 0, padding: 0, marginBottom: 20, display: 'block'}}
              isOpen={isOpen === orders[0]?.id ? true : false}
              customHeader={
                <AccordionHeader>
                  <Typography variant="bodyMedium" content={`Prijemnica - ${orders[0].id}`} style={{fontWeight: 600}} />
                  <AccordionIconsWrapper isOpen={false}>
                    <ChevronDownIcon
                      width="15px"
                      height="8px"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        openAccordion(orders[0]?.id || 0);
                      }}
                    />
                    <MoreVerticalIcon
                      width="5px"
                      height="16px"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        showMenuHandler();
                      }}
                      style={{padding: '10px'}}
                    />
                  </AccordionIconsWrapper>
                  <Menu open={showMenu}>
                    <MenuItem>
                      <Typography
                        content="Kreiraj otpremnicu"
                        variant="bodyMedium"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleAddMovement();
                          setShowMenu(prevState => !prevState);
                        }}
                      />
                    </MenuItem>
                    <MenuItem>
                      <Typography
                        content="Obriši"
                        variant="bodyMedium"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleDeleteIconClick();
                          setShowMenu(prevState => !prevState);
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </AccordionHeader>
              }
              content={
                <>
                  <ReceiveItemsTable data={orders[0]} context={context} fetch={fetch} />
                  {orders[0]?.recipient_user?.id && orders[0]?.office?.id && (
                    <MovementTableContainer>
                      <TableTitle variant="bodyMedium" content="OTPREMNICA" />
                      <AssetMovementTable data={orders[0]} context={context} fetch={fetch} />
                    </MovementTableContainer>
                  )}
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
                context.navigation.navigate('/accounting');
                context.breadcrumbs.remove();
              }}
            />
          </FormControls>
        </FormFooter>
        {showModal && (
          <ReceiveItemsModal open={showModal} onClose={closeModal} fetch={fetch} data={orders} alert={context?.alert} />
        )}
        {showModalMovement && (
          <AssetMovementModal
            open={showModalMovement}
            onClose={closeModalMovement}
            context={context}
            selectedItem={orderId}
            fetch={fetch}
          />
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
