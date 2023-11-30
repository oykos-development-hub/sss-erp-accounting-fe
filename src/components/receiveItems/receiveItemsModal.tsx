import {Datepicker, Input, Modal, Table, TableHead, Typography, FileUpload} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useOrderListReceive from '../../services/graphql/orders/hooks/useOrderListReceive';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {DatepickersWrapper, FormWrapper, HeaderSection, Row, StyledInput, TextareaWrapper, Title} from './styles';
import {FileUploadWrapper} from '../../screens/formOrder/styles';
import useAppContext from '../../context/useAppContext';
import FileList from '../../components/fileList/fileList';
import {FileItem, FileResponseItem} from '../../types/fileUploadType';
import {OrderListArticleType} from '../../types/graphql/articleTypes';

type ReceiveItemForm = {
  invoice_date: string;
  date_system: string;
  invoice_number: string;
  description: string;
  receive_file: FileItem | null;
};

const initialValues: ReceiveItemForm = {
  invoice_date: '',
  date_system: '',
  invoice_number: '',
  description: '',
  receive_file: null,
};

interface ReceiveItemsModalProps {
  data?: any;
  open: boolean;
  onClose: () => void;
  alert?: any;
  fetch: () => void;
}

export const ReceiveItemsModal: React.FC<ReceiveItemsModalProps> = ({data, open, onClose, alert, fetch}) => {
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);
  const {mutate: orderListReceive, loading: isSaving} = useOrderListReceive();
  const [filesToDelete, setFilesToDelete] = useState<number>();
  const filteredArticles = data[0]?.articles.filter((item: OrderListArticleType) => item.amount !== 0);

  const tableHeads: TableHead[] = [
    {
      title: 'Naziv',
      accessor: 'title',
      type: 'text',
    },
    {
      title: 'Jedinica mjere:',
      accessor: 'unit',
      type: 'text',
      shouldRender: Number(data[0]?.public_procurement?.id) !== 0,
    },

    {title: 'Poručeno', accessor: 'amount', type: 'text'},

    {
      title: 'Ukupna vrijednost(sa PDV-om)',
      accessor: 'total_price',
      type: 'custom',
      renderContents: (total_price: number) => {
        return <Typography variant="bodyMedium" content={total_price ? parseFloat(total_price.toFixed(2)) : ''} />;
      },
      shouldRender: Number(data[0]?.public_procurement?.id) !== 0,
    },
  ];

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

  const receiveFile = watch('receive_file');

  const {
    fileService: {uploadFile, deleteFile},
  } = useAppContext();

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
    clearErrors('receive_file');
  };

  const onDeleteFile = () => {
    setValue('receive_file', null);
    setFilesToDelete(receiveFile?.id);
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
    receiveFileId?: number,
  ) => {
    const payload = {
      order_id: data[0]?.id,
      invoice_date: invoiceDate,
      invoice_number: invoiceNumber,
      description: description,
      date_system: dateSystem,
      receive_file: receiveFileId,
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

    if (filesToDelete) {
      await deleteFile(filesToDelete);
    }

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(
        formData,
        (files: FileResponseItem[]) => {
          setUploadedFile(null);
          setValue('receive_file', files[0]);
          handleReceiveListInsert(
            parseDateForBackend(values?.invoice_date),
            values?.invoice_number,
            values?.description,
            parseDateForBackend(values?.date_system),
            files[0]?.id,
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
      rightButtonText="Dodaj"
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
                    required: 'Ovo polje je obavezno',
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
                    />
                  )}
                />
              </DatepickersWrapper>
              <FileUploadWrapper>
                <FileUpload
                  icon={null}
                  files={uploadedFile}
                  variant="secondary"
                  onUpload={handleUpload}
                  note={<Typography variant="bodySmall" content="Dokument" />}
                  hint="Fajlovi neće biti učitani dok ne sačuvate prijemnicu."
                  buttonText="Učitaj"
                />
              </FileUploadWrapper>
              {receiveFile?.id !== 0 && (
                <FileList files={receiveFile && [receiveFile]} onDelete={onDeleteFile} isInModal={true} />
              )}
            </div>
            <TextareaWrapper>
              <Input {...register('description')} label="NAPOMENA:" textarea={true} />
            </TextareaWrapper>
          </HeaderSection>

          <Table tableHeads={tableHeads} data={filteredArticles} />
          {Number(data[0]?.public_procurement?.id) !== 0 && (
            <Row>
              <Input label="UKUPNA VRIJEDNOST NARUDŽBENICE (BEZ PDV-a):" value={totalNeto} disabled={true} />
              <Input
                label="UKUPNA VRIJEDNOST NARUDŽBENICE (SA PDV-om):"
                value={totalPrice.toFixed(2)}
                disabled={true}
              />
            </Row>
          )}
        </FormWrapper>
      }
      title={'KREIRAJ NOVU PRIJEMNICU'}
    />
  );
};
