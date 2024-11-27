import {Datepicker, Dropdown, FileUpload, Input, Modal, Table, TableHead, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import FileList from '../../components/fileList/fileList';
import {pdvOptions} from '../../constants';
import useAppContext from '../../context/useAppContext';
import {FileUploadWrapper} from '../../screens/formOrder/styles';
import useOrderListReceive from '../../services/graphql/orders/hooks/useOrderListReceive';
import {FileItem, FileResponseItem} from '../../types/fileUploadType';
import {OrderArticleType} from '../../types/graphql/articleTypes';
import {ReceiveItemStatus} from '../../types/graphql/orderListTypes';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {convertToCurrency} from '../../utils/stringUtils';
import {DatepickersWrapper, FormWrapper, HeaderSection, StyledInput, TextareaWrapper, Title} from './styles';

type ReceiveItemForm = {
  invoice_date: string;
  date_system: string;
  invoice_number: string;
  delivery_number: string;
  delivery_date: string;
  description: string;
  receive_file: FileItem[] | null;
  delivery_file: FileItem[] | null;
  articles?: OrderArticleType[];
};

const initialValues: ReceiveItemForm = {
  invoice_date: '',
  date_system: '',
  invoice_number: '',
  description: '',
  receive_file: null,
  articles: [],
  delivery_number: '',
  delivery_date: '',
  delivery_file: null,
};

interface ReceiveItemsModalProps {
  data?: any;
  open: boolean;
  onClose: () => void;
  alert?: any;
  fetch: () => void;
}

export const ReceiveItemsModal: React.FC<ReceiveItemsModalProps> = ({data, open, onClose, alert, fetch}) => {
  const [uploadedFilesForReceive, setUploadedFilesForReceive] = useState<FileList | null>(null);
  const [uploadedFilesForDelivery, setUploadedFilesForDelivery] = useState<FileList | null>(null);
  const [receiveFileIds, setReceiveFileIds] = useState<number>();
  const [deliveryFileIds, setDeliveryFileIds] = useState<number>();

  const {mutate: orderListReceive, loading: isSaving} = useOrderListReceive();
  const [filesToDelete, setFilesToDelete] = useState<number[]>();
  const isException = data[0]?.public_procurement?.id === 0;
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    clearErrors,
    watch,
    setValue,
  } = useForm({defaultValues: initialValues});

  const {fields} = useFieldArray({
    control,
    name: 'articles',
    keyName: 'key',
  });

  const receiveFile = watch('receive_file');
  const deliveryFile = watch('delivery_file');

  const {
    fileService: {uploadFile, batchDeleteFiles},
  } = useAppContext();

  const tableHeads: TableHead[] = [
    {
      title: 'Naziv',
      accessor: 'title',
      type: 'text',
    },
    {
      title: 'Jedinica mjere:',
      accessor: 'unit',
      type: 'custom',
      renderContents: (unit: number) => {
        return <Typography variant="bodyMedium" content={unit || 'Kom'} />;
      },
      shouldRender: !isException,
    },

    {title: 'Poručeno', accessor: 'amount', type: 'text'},
    {
      title: 'Jedinična cijena',
      accessor: 'net_price',
      type: 'custom',
      renderContents: (net_price: number, _, index) => {
        return data[0].status !== ReceiveItemStatus.RECEIVED && !data[0]?.is_pro_forma_invoice ? (
          <Input
            leftContent={<Typography variant="bodyMedium" content="€" />}
            {...register(`articles.${index}.net_price`, {
              required: 'Ovo polje je obavezno',
            })}
          />
        ) : (
          <Typography
            variant="bodyMedium"
            content={
              `${net_price.toLocaleString('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} €` || ''
            }
          />
        );
      },
      shouldRender: isException,
    },
    {
      title: 'PDV',
      accessor: 'vat_percentage',
      type: 'custom',
      renderContents: (vat_percentage: any, _, index) => {
        return data[0].status !== ReceiveItemStatus.RECEIVED && !data[0]?.is_pro_forma_invoice ? (
          <Controller
            name={`articles.${index}.vat_percentage`}
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {onChange, name, value}}) => {
              return (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  options={pdvOptions}
                  error={errors.articles?.[index]?.vat_percentage?.message}
                />
              );
            }}
          />
        ) : (
          <Typography variant="bodyMedium" content={`${vat_percentage?.id} %` || ''} />
        );
      },
      shouldRender: isException,
    },
    {
      title: 'Ukupna vrijednost',
      accessor: 'total',
      type: 'custom',
      renderContents: (_, row, index) => {
        const total = calculateTotalPrice(row, index);
        return <Typography variant="bodyMedium" content={total ? convertToCurrency(total) : ''} />;
      },
      shouldRender: isException,
    },
    {
      title: 'Ukupna vrijednost(sa PDV-om)',
      accessor: 'total_price',
      type: 'custom',
      renderContents: (total_price: number) => {
        return <Typography variant="bodyMedium" content={total_price ? convertToCurrency(totalPrice) : ''} />;
      },
      shouldRender: !isException,
    },
  ];

  const calculateTotalPrice = (item: OrderArticleType, index: number) => {
    const net_price = watch('articles')?.[index]?.net_price;
    const vat_percentage = watch('articles')?.[index]?.vat_percentage as any;
    const totalArticlePrice = net_price && vat_percentage?.id ? net_price * (1 + vat_percentage?.id / 100) : net_price;
    return totalArticlePrice && totalArticlePrice * item.amount;
  };
  const handleReceiveFileUpload = async (files: FileList) => {
    setUploadedFilesForReceive(files);

    const formData = new FormData();
    Array.from(files).forEach((file: File) => {
      formData.append('file', file);
    });

    const response = await uploadFile(formData);
    setReceiveFileIds(response[0]?.id);
  };

  const handleDeliveryFileUpload = async (files: FileList) => {
    setUploadedFilesForDelivery(files);
    const formData = new FormData();
    Array.from(files).forEach((file: File) => {
      formData.append('file', file);
    });

    const response = await uploadFile(formData);
    setDeliveryFileIds(response[0]?.id);
  };

  const onDeleteFile = (id: number) => {
    const filteredFiles = receiveFile?.filter((item: FileItem) => item.id !== id) || null;
    setValue('receive_file', filteredFiles);
    setFilesToDelete(prevState => [...(prevState || []), id]);
  };

  const totalPrice = [data[0]]?.reduce((sum: any, article: any) => {
    const price = parseFloat(article?.total_bruto);

    return sum + price;
  }, 0);

  const totalNeto = [data[0]]?.reduce((sum: any, article: any) => {
    const price = parseFloat(article?.total_neto?.toFixed(2));

    return sum + price;
  }, 0);

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    if (filesToDelete && filesToDelete.length > 0) {
      await batchDeleteFiles(filesToDelete);
    }

    let articles;

    if (data[0]?.id) {
      if (isException && values?.articles && values?.articles.length > 0) {
        // Map through the articles to transform them
        articles = values.articles.map((item: any) => {
          const matchedItem = data[0]?.articles.find(
              (article: { id: any }) => article.id === item.id
          );

          const netPrice =
              data[0].status !== ReceiveItemStatus.RECEIVED
                  ? // Parse net_price if it's a string
                  typeof item?.net_price === 'string'
                      ? parseFloat(item.net_price.replace(',', '.'))
                      : item.net_price
                  : // Use matchedItem's vat_percentage if is_pro_forma_invoice
                  data[0]?.is_pro_forma_invoice && matchedItem
                      ? matchedItem.vat_percentage
                      : item.net_price;

          const vatPercentage =
              data[0]?.is_pro_forma_invoice && matchedItem
                  ? matchedItem.vat_percentage
                  : item?.vat_percentage?.id;

          return {
            id: item.id,
            net_price: netPrice,
            vat_percentage: vatPercentage,
          };
        });
      } else {
        // No articles if conditions are not met
        articles = [];
      }
    } else {
      // If data[0]?.id does not exist, set articles to undefined
      articles = undefined;
    }

    const payload = {
      order_id: data[0]?.id,
      invoice_date: parseDateForBackend(values?.invoice_date),
      invoice_number: values?.invoice_number,
      description: values?.description,
      date_system: parseDateForBackend(values?.date_system),
      receive_file: data[0]?.file?.id ? data[0]?.file?.id : receiveFileIds ? receiveFileIds : null,
      delivery_file_id: data[0]?.delivery_file?.id
        ? data[0]?.delivery_file?.id
        : deliveryFileIds
        ? deliveryFileIds
        : null,
      delivery_number: values?.delivery_number,
      delivery_date: parseDateForBackend(values?.delivery_date),
      articles
    };

    orderListReceive(
      payload,
      () => {
        fetch();
        alert.success('Uspješno sačuvano.');
        onClose();
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  useEffect(() => {
    if (data[0]) {
      reset({
        ...data[0],
        invoice_date: data[0]?.invoice_date || '',
        date_system: data[0]?.date_system || '',
        invoice_number: data[0]?.invoice_number || '',
        description: data[0]?.description || '',
        receive_file: data[0]?.receive_file || null,
        delivery_file: data[0]?.delivery_file,
        articles: data[0]?.articles
          .filter((item: OrderArticleType) => item.amount !== 0)
          .map((item: OrderArticleType) => {
            return {
              ...item,
              net_price: item.net_price || '',
              vat_percentage: {id: item.vat_percentage, title: `${item.vat_percentage} %`},
            };
          }),
      });
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      width={870}
      content={
        <FormWrapper>
          <div>
            {Number(data[0]?.public_procurement?.id) !== 0 && (
              <Title
                variant="bodySmall"
                style={{fontWeight: 600}}
                content={`JAVNA NABAVKA: JN-${data[0]?.public_procurement?.title || ''}`}
              />
            )}
            {Number(data[0]?.group_of_articles?.id) !== 0 && (
              <Title
                variant="bodySmall"
                style={{fontWeight: 600}}
                content={`GRUPA ARTIKALA: ${data[0]?.group_of_articles?.title || ''}`}
              />
            )}
            <Title
              style={{fontWeight: 600}}
              variant="bodySmall"
              content={`DOBAVLJAČ: ${data[0]?.supplier?.title || ''} `}
            />
          </div>
          <HeaderSection>
            <div>
              <StyledInput {...register('delivery_number')} label="BROJ OTPREMNICE:" />
              <DatepickersWrapper>
                <Controller
                  name="delivery_date"
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange as any}
                      label="DATUM OTPREMNICE:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.delivery_date?.message as string}
                    />
                  )}
                />
                <Controller
                  name="date_system"
                  control={control}
                  rules={{
                    validate: {
                      customDateValidation: value => {
                        const dateSystem = new Date(value);
                        dateSystem.setHours(0, 0, 0, 0);

                        const orderDate = new Date(data[0].date_order);
                        orderDate.setHours(0, 0, 0, 0);

                        if (dateSystem < orderDate) {
                          return 'Datum prijema robe ne može biti stariji od datuma narudžbenice';
                        }
                        return true;
                      },
                    },
                    required: 'Ovo polje je obavezno.',
                  }}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange as any}
                      label="DATUM PRIJEMA ROBE:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.date_system?.message as string}
                      isRequired
                    />
                  )}
                />
              </DatepickersWrapper>
              <FileUploadWrapper>
                <FileUpload
                  icon={null}
                  files={uploadedFilesForDelivery}
                  variant="secondary"
                  onUpload={handleDeliveryFileUpload}
                  note={<Typography variant="bodySmall" content="Otpremnica" />}
                  hint="Fajlovi neće biti učitani dok ne sačuvate prijemnicu."
                  buttonText="Učitaj"
                />
              </FileUploadWrapper>
              {deliveryFile && deliveryFile.length !== 0 && <FileList files={[deliveryFile] as any} />}
            </div>
            <div>
              <StyledInput {...register('invoice_number')} label="BROJ FAKTURE:" />
              <DatepickersWrapper>
                <Controller
                  name="invoice_date"
                  control={control}
                  rules={{
                    validate: {
                      customDateValidation: value => {
                        const invoiceDate = new Date(value);
                        invoiceDate.setHours(0, 0, 0, 0);

                        const orderDate = new Date(data[0].date_order);
                        orderDate.setHours(0, 0, 0, 0);

                        if (invoiceDate < orderDate) {
                          return 'Datum fakture ne može biti stariji od datuma narudžbenice';
                        }
                        return true;
                      },
                    },
                  }}
                  render={({field: {onChange, name, value}}) => (
                    <div style={{width: '100%'}}>
                      <Datepicker
                        onChange={onChange as any}
                        label="DATUM FAKTURE:"
                        name={name}
                        value={value ? parseDate(value) : ''}
                        error={errors.invoice_date?.message as string}
                      />
                    </div>
                  )}
                />
              </DatepickersWrapper>
              <FileUploadWrapper>
                <FileUpload
                  icon={null}
                  files={uploadedFilesForReceive}
                  variant="secondary"
                  onUpload={handleReceiveFileUpload}
                  note={<Typography variant="bodySmall" content="Račun" />}
                  hint="Fajlovi neće biti učitani dok ne sačuvate prijemnicu."
                  buttonText="Učitaj"
                />
              </FileUploadWrapper>
              {receiveFile && receiveFile.length !== 0 && (
                <FileList files={receiveFile} onDelete={onDeleteFile} isInModal={true} />
              )}
            </div>
          </HeaderSection>
          <TextareaWrapper>
            <Input {...register('description')} label="NAPOMENA:" textarea={true} />
            {Number(data[0]?.public_procurement?.id) !== 0 && (
              <>
                <Input
                  label="UKUPNA VRIJEDNOST NARUDŽBENICE (BEZ PDV-a):"
                  value={totalNeto.toLocaleString('sr-RS', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  disabled={true}
                  style={{marginBlock: 5}}
                />
                <Input
                  label="UKUPNA VRIJEDNOST NARUDŽBENICE (SA PDV-om):"
                  value={totalPrice.toLocaleString('sr-RS', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  disabled={true}
                />
              </>
            )}
          </TextareaWrapper>

          <Table tableHeads={tableHeads} data={fields} />
        </FormWrapper>
      }
      title={'KREIRAJ NOVU PRIJEMNICU'}
    />
  );
};
