import {Datepicker, Input, Modal, Table, TableHead, Typography} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useOrderListReceive from '../../services/graphql/orders/hooks/useOrderListReceive';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {DatepickersWrapper, FormWrapper, HeaderSection, Row, StyledInput, Title} from './styles';

const initialValues = {
  invoice_date: '',
  date_system: '',
  invoice_number: '',
  description: '',
};

interface ReceiveItemsModalProps {
  data?: any;
  open: boolean;
  onClose: () => void;
  alert?: any;
  fetch: () => void;
}

export const tableHeads: TableHead[] = [
  {
    title: 'Naziv',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Jedinica mjere:',
    accessor: 'unit',
    type: 'text',
  },

  {title: 'Poručeno', accessor: 'amount', type: 'text'},

  {
    title: 'Ukupna vrijednost(sa PDV-om)',
    accessor: 'total_price',
    type: 'custom',
    renderContents: (total_price: number) => {
      return <Typography variant="bodyMedium" content={total_price ? parseFloat(total_price.toFixed(2)) : ''} />;
    },
  },
];

export const ReceiveItemsModal: React.FC<ReceiveItemsModalProps> = ({data, open, onClose, alert, fetch}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: initialValues});

  const {mutate: orderListReceive, loading: isSaving} = useOrderListReceive();

  const totalPrice = [data[0]]?.reduce((sum: any, article: any) => {
    const price = parseFloat(article?.total_bruto);

    return sum + price;
  }, 0);

  const totalNeto = [data[0]]?.reduce((sum: any, article: any) => {
    const price = parseFloat(article?.total_neto?.toFixed(2));

    return sum + price;
  }, 0);

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const payload = {
      order_id: data[0]?.id,
      invoice_date: parseDateForBackend(values?.invoice_date) || '',
      invoice_number: values?.invoice_number || '',
      description: values?.description,
      date_system: parseDateForBackend(values?.date_order) || '',
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
            <Title
              variant="bodySmall"
              style={{fontWeight: 600}}
              content={`JAVNA NABAVKA: JN-${data[0]?.public_procurement?.title || ''}`}
            />
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
                  rules={{required: 'Ovo polje je obavezno'}}
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
                  rules={{required: 'Ovo polje je obavezno'}}
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
            </div>
            <div>
              <Input {...register('description')} label="NAPOMENA:" textarea={true} />
            </div>
          </HeaderSection>
          <Table tableHeads={tableHeads} data={data[0]?.articles || []} />
          <Row>
            <Input label="UKUPNA VRIJEDNOST NARUDŽBENICE (BEZ PDV-a):" value={totalNeto} disabled={true} />
            <Input label="UKUPNA VRIJEDNOST NARUDŽBENICE (SA PDV-om):" value={totalPrice.toFixed(2)} disabled={true} />
          </Row>
        </FormWrapper>
      }
      title={'KREIRAJ NOVU PRIJEMNICU'}
    />
  );
};
