import {Accordion, Button, ChevronDownIcon, Table, TableHead, Typography, FileUpload} from 'client-library';
import React, {useMemo, useState} from 'react';
import FileList from '../../components/fileList/fileList';
import {ReceiveItemsModal} from '../../components/receiveItems/receiveItemsModal';
import {ReceiveItemsTable} from '../../components/receiveItems/receiveItemsTable';
import useAppContext from '../../context/useAppContext';
import useDeleteOrderListReceive from '../../services/graphql/orders/hooks/useDeleteOrderListReceive';
import useGetOrderList from '../../services/graphql/orders/hooks/useGetOrderList';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox} from '../../shared/styles';
import {OrderArticleType} from '../../types/graphql/articleTypes';
import {parseDate} from '../../utils/dateUtils';
import {
  AccordionHeader,
  AccordionIconsWrapper,
  AccordionWrapper,
  ButtonContainer,
  FileUploadWrapper,
  FormControls,
  FormFooter,
  OrderInfo,
} from './styles';
import {FileResponseItem} from '../../types/fileUploadType';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import {useForm} from 'react-hook-form';
import {convertToCurrency} from '../../utils/stringUtils';

export const FormOrderDetailsPreview: React.FC = () => {
  const {
    alert,
    breadcrumbs,
    navigation: {location, navigate},
    reportService: {generatePdf},
    fileService: {uploadFile},
  } = useAppContext();

  const {handleSubmit} = useForm();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isOpen, setIsOpen] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

  let date = '';
  const url = location.pathname;
  const orderId = Number(url?.split('/').at(-2));

  const [form, setForm] = useState({
    page: 1,
    size: 10,
    id: orderId,
    status: '',
    search: '',
  });

  const {orders, loading, fetch} = useGetOrderList(form);
  const {mutate: deleteOrderListReceive} = useDeleteOrderListReceive();
  const {mutate: orderListInsert} = useOrderListInsert();

  const supplier = orders[0]?.supplier;
  const dateOrder = orders[0]?.date_order || '';

  if (dateOrder) {
    const convertDate = new Date(dateOrder);
    date = parseDate(convertDate);
  }

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
      title: 'Jedinica mjere',
      accessor: 'unit',
      type: 'text',
      shouldRender: Number(orders[0]?.public_procurement?.id) !== 0,
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (amount: number) => {
        return <Typography variant="bodyMedium" content={amount ? parseFloat(amount?.toFixed(2)) : 0} />;
      },
    },
    {
      title: 'Jedinična cijena',
      accessor: 'net_price',
      type: 'custom',
      renderContents: (net_price: number) => {
        return <Typography variant="bodyMedium" content={convertToCurrency(net_price)} />;
      },
      shouldRender: orders[0]?.is_pro_forma_invoice,
    },
    {
      title: 'PDV',
      accessor: 'vat_percentage',
      type: 'custom',
      renderContents: (vat_percentage: string) => {
        return <Typography variant="bodyMedium" content={`${vat_percentage} %` || ''} />;
      },
      shouldRender: orders[0]?.is_pro_forma_invoice,
    },
    {
      title: 'Ukupna vrijednost (bez PDV-a)',
      accessor: 'total',
      type: 'custom',
      renderContents: (_, row, index) => {
        const total = calculateTotalPrice(row, index);
        return <Typography variant="bodyMedium" content={total ? convertToCurrency(total) : ''} />;
      },
      shouldRender: orders[0]?.is_pro_forma_invoice,
    },
    {
      title: 'Ukupna vrijednost (sa PDV-om)',
      accessor: 'total_price',
      type: 'custom',
      renderContents: (_, row, index) => {
        const total = calculateTotalPriceWithVat(row, index);
        return <Typography variant="bodyMedium" content={total ? convertToCurrency(total) : ''} />;
      },
      shouldRender: orders[0]?.is_pro_forma_invoice,
    },
  ];

  const calculateTotalPrice = (item: OrderArticleType, index: number) => {
    const net_price = item.net_price;
    return net_price * item.amount;
  };

  const calculateTotalPriceWithVat = (item: OrderArticleType, index: number) => {
    const net_price = item.net_price;
    const vat_percentage = item.vat_percentage;
    const totalArticlePrice = net_price * (1 + vat_percentage / 100);
    const totalPrice = totalArticlePrice * item.amount;
    return totalPrice;
  };

  const mappedOrder = useMemo(() => {
    if (orders) {
      return orders[0]?.articles
        ?.filter((article: OrderArticleType) => article.amount !== 0)
        .map(article => {
          return {
            ...article,
            order_id: orderId,
            unit: 'Kom',
          };
        });
    } else {
      return [];
    }
  }, [orders, orderId]);

  const handleAddReceiveItems = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openAccordion = (id: number) => {
    setIsOpen(prevState => (prevState === id ? 0 : id));
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
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
          alert.error('Došlo je do greške pri brisanju');
        },
      );
    }
  };

  const printOrder = () => {
    if (orders.length) {
      generatePdf('ACCOUNTING_ORDER', orders[0]);
    }
  };

  const onSubmit = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        const payload = {
          id: orderId,
          order_file: files[0].id || null,
          date_order: orders[0].date_order,
          public_procurement_id: orders[0].public_procurement?.id,
          supplier_id: orders[0]?.supplier?.id,
          group_of_articles_id: orders[0]?.group_of_articles?.id,
          is_pro_forma_invoice: orders[0]?.is_pro_forma_invoice,
        };

        orderListInsert(
          payload as any,
          () => {
            fetch();
            alert.success('Uspješno sačuvano.');
          },
          () => {
            alert.error('Greška. Promjene nisu sačuvane.');
          },
        );
      });

      return;
    }
  };

  const orderFile = orders[0]?.order_file;
  const receiveFile = orders[0]?.receive_file;

  const sendToFinance = async () => {
    const payload = {
      id: orderId,
      passed_to_finance: true,
    };

    orderListInsert(
      payload as any,
      () => {
        fetch();
        alert.success('Uspješno proslijedjeno finansijama.');
      },
      () => {
        alert.error('Greška. Nije moguće proslijediti finansijama.');
      },
    );

    return;
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={
            orders[0]?.invoice_date && orders[0]?.date_system
              ? `RAČUN - BROJ. N${orderId}`
              : orders[0]?.is_pro_forma_invoice
              ? `PREDRAČUN - BROJ. N${orderId}`
              : `NARUDŽBENICA - BROJ. N${orderId}`
          }
        />
        <CustomDivider />
        <OrderInfo>
          <div>
            {Number(orders[0]?.public_procurement?.id) !== 0 && (
              <Row>
                <Typography variant="bodySmall" style={{fontWeight: 600}} content={'JAVNA NABAVKA:'} />
                <Typography variant="bodySmall" content={`${orders && orders[0]?.public_procurement?.title}`} />
              </Row>
            )}
            {Number(orders[0]?.public_procurement?.id) === 0 && (
              <Row>
                <Typography variant="bodySmall" style={{fontWeight: 600}} content={'GRUPA ARTIKALA:'} />
                <Typography variant="bodySmall" content={`${orders && orders[0]?.group_of_articles?.title}`} />
              </Row>
            )}

            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'DOBAVLJAČ:'} />
              <Typography variant="bodySmall" content={`${supplier?.title || ''} `} />
            </Row>
            <>
              {!orders[0]?.is_pro_forma_invoice && (
                <Row>
                  <Typography variant="bodySmall" style={{fontWeight: 600}} content={'DATUM:'} />
                  <Typography variant="bodySmall" content={`${date || ''}`} />
                </Row>
              )}
              {orders[0]?.is_pro_forma_invoice && (
                <>
                  <Row>
                    <Typography variant="bodySmall" style={{fontWeight: 600}} content={'BROJ PREDRAČUNA:'} />
                    <Typography variant="bodySmall" content={`${orders[0].pro_forma_invoice_number || ''} `} />

                    {orders[0]?.invoice_date && orders[0]?.date_system && (
                      <>
                        <Typography
                          variant="bodySmall"
                          style={{fontWeight: 600, marginLeft: 30}}
                          content={'BROJ RAČUNA:'}
                        />
                        <Typography variant="bodySmall" content={`${orders[0].invoice_number || ''} `} />
                      </>
                    )}
                  </Row>
                  <Row>
                    <Typography variant="bodySmall" style={{fontWeight: 600}} content={'DATUM PREDRAČUNA:'} />
                    <Typography variant="bodySmall" content={`${parseDate(orders[0].pro_forma_invoice_date) || ''} `} />

                    {orders[0]?.invoice_date && orders[0]?.date_system && (
                      <>
                        <Typography
                          variant="bodySmall"
                          style={{fontWeight: 600, marginLeft: 30}}
                          content={'DATUM RAČUNA:'}
                        />
                        <Typography variant="bodySmall" content={`${parseDate(orders[0].invoice_date) || ''} `} />
                      </>
                    )}
                  </Row>
                </>
              )}
              {!orders[0]?.invoice_date && !orders[0]?.date_system && (
                <Row>
                  <FileUploadWrapper>
                    <FileUpload
                      icon={null}
                      files={uploadedFile}
                      variant="secondary"
                      onUpload={handleUpload}
                      note={
                        <Typography
                          variant="bodySmall"
                          content={orders[0]?.is_pro_forma_invoice ? 'Predračun' : 'Narudžbenica'}
                        />
                      }
                      hint={`Fajlovi neće biti učitani dok ne sačuvate ${
                        orders[0]?.is_pro_forma_invoice ? 'predračun' : 'narudžbenicu.'
                      }`}
                      buttonText="Učitaj"
                    />
                  </FileUploadWrapper>
                </Row>
              )}
              {orderFile?.id !== 0 && (
                <Row>
                  <Typography
                    variant="bodySmall"
                    style={{fontWeight: 600}}
                    content={orders[0]?.is_pro_forma_invoice ? 'PREDRAČUN:' : 'NARUDŽBENICA:'}
                  />
                  <FileList files={(orderFile && [orderFile]) ?? []} />
                </Row>
              )}
              {receiveFile && receiveFile.length !== 0 && (
                <div>
                  <Typography variant="bodySmall" style={{fontWeight: 600}} content={'PRIJEMNICA/FAKTURA:'} />
                  <FileList files={(receiveFile && receiveFile) ?? []} />
                </div>
              )}
            </>
          </div>
          <ButtonContainer>
            {orders[0]?.invoice_date && orders[0]?.date_system && !orders[0]?.is_pro_forma_invoice && (
              <Button
                content="Proslijedi finansijama"
                variant="secondary"
                size="sm"
                onClick={handleSubmit(sendToFinance)}
                disabled={orders[0]?.passed_to_finance}
              />
            )}
            <Button
              content={orders[0]?.is_pro_forma_invoice ? 'Štampaj predračun' : 'Štampaj narudžbenicu'}
              size="sm"
              variant="secondary"
              onClick={printOrder}
            />
            <Button
              content="Kreiraj prijemnicu"
              size="sm"
              variant="secondary"
              disabled={!!orders[0]?.invoice_date}
              onClick={handleAddReceiveItems}
            />
          </ButtonContainer>
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
                  <AccordionIconsWrapper isOpen={isOpen === orders[0]?.id ? true : false}>
                    <ChevronDownIcon
                      width="15px"
                      height="8px"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        openAccordion(orders[0]?.id || 0);
                      }}
                    />
                  </AccordionIconsWrapper>
                </AccordionHeader>
              }
              content={
                <>
                  <ReceiveItemsTable
                    data={orders[0]}
                    fetch={fetch}
                    loading={loading}
                    isDisabled={orders[0]?.passed_to_finance}
                  />
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
                navigate('/accounting/order-form');
                breadcrumbs.remove();
              }}
            />
          </FormControls>
          {!orders[0]?.invoice_date && !orders[0]?.date_system && (
            <FormControls>
              <Button
                content="Sačuvaj"
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={uploadedFile === null}
              />
            </FormControls>
          )}
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
