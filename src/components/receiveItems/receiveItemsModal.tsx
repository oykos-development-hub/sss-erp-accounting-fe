import {Datepicker, Input, Modal, Table, TableHead, Typography, FileUpload, Dropdown, ValueType} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import useOrderListReceive from '../../services/graphql/orders/hooks/useOrderListReceive';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {DatepickersWrapper, FormWrapper, HeaderSection, StyledInput, TextareaWrapper, Title} from './styles';
import {FileUploadWrapper} from '../../screens/formOrder/styles';
import useAppContext from '../../context/useAppContext';
import FileList from '../../components/fileList/fileList';
import {FileItem, FileResponseItem} from '../../types/fileUploadType';
import {OrderArticleType, OrderListArticleType} from '../../types/graphql/articleTypes';
import {pdvOptions} from '../../constants';
import {ReceiveItemStatus} from '../../types/graphql/orderListTypes';
import {convertToCurrency} from '../../utils/stringUtils';

type ReceiveItemForm = {
  invoice_date: string;
  date_system: string;
  invoice_number: string;
  description: string;
  receive_file: FileItem[] | null;
  articles?: OrderArticleType[];
};

const initialValues: ReceiveItemForm = {
  invoice_date: '',
  date_system: '',
  invoice_number: '',
  description: '',
  receive_file: null,
  articles: [],
};

interface ReceiveItemsModalProps {
  data?: any;
  open: boolean;
  onClose: () => void;
  alert?: any;
  fetch: () => void;
}

export const ReceiveItemsModal: React.FC<ReceiveItemsModalProps> = ({data, open, onClose, alert, fetch}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>();
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

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
    clearErrors('receive_file');
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

  const handleReceiveListInsert = (
    invoiceDate: string | null,
    invoiceNumber: string,
    description: string,
    dateSystem: string | null,
    receiveFileIds?: number[],
    articles?: OrderArticleType[],
  ) => {
    const payload = {
      order_id: data[0]?.id,
      invoice_date: invoiceDate,
      invoice_number: invoiceNumber,
      description: description,
      date_system: dateSystem,
      receive_file: receiveFileIds,
      articles:
        isException && articles && articles?.length > 0
          ? articles?.map((item: any) => {
              const matchedItem = data[0]?.articles.find((article: {id: any}) => article.id === item.id);

              return {
                id: item.id,
                net_price:
                  data[0].status !== ReceiveItemStatus.RECEIVED
                    ? typeof item?.net_price === 'string'
                      ? parseFloat(item.net_price.replace(',', '.'))
                      : item.net_price
                    : data[0]?.is_pro_forma_invoice && matchedItem
                    ? matchedItem.vat_percentage
                    : item.net_price,
                vat_percentage:
                  data[0]?.is_pro_forma_invoice && matchedItem ? matchedItem.vat_percentage : item?.vat_percentage?.id,
              };
            })
          : [],
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

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    if (filesToDelete && filesToDelete?.length > 0) {
      await batchDeleteFiles(filesToDelete);
    }

    if (uploadedFiles) {
      const filesToUpload = [...uploadedFiles];

      const formData = new FormData();
      filesToUpload.forEach((file: File) => {
        formData.append('file', file);
      });

      await uploadFile(
        formData,
        (files: FileResponseItem[]) => {
          setUploadedFiles(null);
          setValue('receive_file', files);
          handleReceiveListInsert(
            parseDateForBackend(values?.invoice_date),
            values?.invoice_number,
            values?.description,
            parseDateForBackend(values?.date_system),
            files.map((item: FileResponseItem) => item.id),
            values?.articles,
          );
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );

      return;
    } else {
      handleReceiveListInsert(
        parseDateForBackend(values?.invoice_date),
        values?.invoice_number,
        values?.description,
        parseDateForBackend(values?.date_system),
        undefined,
        values?.articles,
      );
    }
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
                    <Datepicker
                      onChange={onChange as any}
                      label="DATUM FAKTURE:"
                      name={name}
                      value={value ? parseDate(value) : ''}
                      error={errors.invoice_date?.message as string}
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
                    required: 'Ovo polje je obavezno',
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
                  files={uploadedFiles}
                  variant="secondary"
                  onUpload={handleUpload}
                  note={<Typography variant="bodySmall" content="Dokument" />}
                  hint="Fajlovi neće biti učitani dok ne sačuvate prijemnicu."
                  buttonText="Učitaj"
                />
              </FileUploadWrapper>
              {receiveFile && receiveFile.length !== 0 && (
                <FileList files={receiveFile} onDelete={onDeleteFile} isInModal={true} />
              )}
            </div>
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
          </HeaderSection>

          <Table tableHeads={tableHeads} data={fields} />
        </FormWrapper>
      }
      title={'KREIRAJ NOVU PRIJEMNICU'}
    />
  );
};
