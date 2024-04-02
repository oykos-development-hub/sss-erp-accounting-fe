import {Button, Dropdown, PlusIcon, Table, TableHead, Theme, Typography, Datepicker, Input} from 'client-library';
import React, {useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import useGetSuppliers from '../../services/graphql/suppliers/hooks/useGetSuppliers';
import ScreenWrapper from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox} from '../../shared/styles';
import {OrderListArticleType} from '../../types/graphql/articleTypes';
import {
  AmountInput,
  ButtonContentWrapper,
  FormControls,
  FormFooter,
  OrderInfo,
  RowWrapper,
  TextInput,
  WidthDiv,
} from '../formOrder/styles';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import {pdvOptions} from '../../constants';

type FormValues = {
  date_order: string;
  public_procurement_id: number;
  articles: any[];
  order_file: number;
  supplier: {id: 0; title: ''};
  group_of_articles_id: number;
  pro_forma_invoice_date: Date | null;
  pro_forma_invoice_number: string;
};

export const Exceptions: React.FC = () => {
  const {
    alert,
    breadcrumbs,
    navigation: {navigate, location},
  } = useAppContext();
  const [newArticles, setNewArticles] = useState<OrderListArticleType[]>([]);
  const url = location.pathname;
  const exceptionID = Number(url?.split('/').at(-1));
  const breadcrumbItems = breadcrumbs?.get();
  const exceptionsTitle = breadcrumbItems[breadcrumbItems.length - 1]?.name?.split('-').at(-1)?.trim();
  const {mutate: orderListInsert, loading: isSaving} = useOrderListInsert();
  const {suppliers} = useGetSuppliers({id: 0, search: null, page: 1, size: 100});
  const count = location.state?.count;
  const isProFormaInvoice = location.state?.isProFormaInvoice;

  const {
    handleSubmit,
    control,
    register,
    getValues,
    watch,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      date_order: '',
      public_procurement_id: 0,
      articles: [],
      order_file: 0,
      group_of_articles_id: exceptionID,
      pro_forma_invoice_date: null,
      pro_forma_invoice_number: '',
    },
  });

  const supplierID = watch('supplier')?.id;

  const proFormaInvoiceDate = watch('pro_forma_invoice_date');
  const proFormaInvoiceNumber = watch('pro_forma_invoice_number');

  const {append} = useFieldArray({
    control,
    name: 'articles',
    keyName: 'key',
  });

  const handleAddRow = () => {
    const addedArticle = {
      id: Math.floor(Math.random() * 10),
      title: '',
      description: '',
      amount: null,
    };
    append(addedArticle);
    setNewArticles((prevArticles: any) => [...prevArticles, addedArticle]);
  };

  const onSubmit = async () => {
    if (isSaving) return;
    handleSaveOrder();
  };

  const handleSaveOrder = () => {
    if (isSaving) return;
    const articles = getValues('articles');

    const insertArticles = articles?.map((article: any) => {
      return {
        id: null,
        amount: article?.amount,
        title: article?.title,
        description: article?.description,
        net_price: isProFormaInvoice ? article?.net_price : null,
        vat_percentage: isProFormaInvoice ? article?.vat_percentage.id : null,
      };
    });

    const payload = {
      date_order: new Date(),
      public_procurement_id: 0,
      articles: insertArticles,
      order_file: null,
      supplier_id: Number(supplierID),
      group_of_articles_id: isProFormaInvoice ? 0 : Number(exceptionID),
      is_pro_forma_invoice: isProFormaInvoice ? true : false,
      pro_forma_invoice_date: parseDateForBackend(proFormaInvoiceDate),
      pro_forma_invoice_number: proFormaInvoiceNumber,
      account_id: count?.id,
    };

    orderListInsert(
      payload as any,
      orderID => {
        alert.success('Uspješno sačuvano.');
        navigate(`/accounting/${exceptionID}/order-form/${orderID}/order-details`, {state: {count, isProFormaInvoice}});
        breadcrumbs.remove(2);
        breadcrumbs.add({
          name: isProFormaInvoice
            ? `Detalji predračuna - ${exceptionsTitle}`
            : `Detalji narudžbenice - ${exceptionsTitle}`,
        });
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const tableHeads: TableHead[] = [
    {
      title: 'Naziv',
      accessor: 'title',
      type: 'custom',
      renderContents: (_, row, index) => {
        return <TextInput {...register(`articles.${index}.title`)} />;
      },
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'description',
      type: 'custom',
      renderContents: (_, row, index) => {
        return <TextInput {...register(`articles.${index}.description`)} />;
      },
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row, index) => {
        return <AmountInput {...register(`articles.${index}.amount`)} isRequired />;
      },
    },
    {
      title: 'Jedinična cijena',
      accessor: 'net_price',
      type: 'custom',
      renderContents: (_, row, index) => {
        return <AmountInput {...register(`articles.${index}.net_price`)} isRequired />;
      },
      shouldRender: isProFormaInvoice,
    },
    {
      title: 'PDV',
      accessor: 'vat_percentage',
      type: 'custom',
      renderContents: (_, row, index) => {
        return (
          <Controller
            name={`articles.${index}.vat_percentage`}
            control={control}
            render={({field: {onChange, name, value}}) => {
              return <Dropdown onChange={onChange} value={value as any} name={name} options={pdvOptions} />;
            }}
          />
        );
      },
      shouldRender: isProFormaInvoice,
    },
  ];

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={'NOVO IZUZEĆE'} />
        <CustomDivider />
        <OrderInfo>
          <RowWrapper>
            {exceptionsTitle && (
              <Row>
                <Typography variant="bodySmall" style={{fontWeight: 600}} content={'GRUPA ARTIKALA:'} />
                <Typography variant="bodySmall" content={`${exceptionsTitle}`} />
              </Row>
            )}
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'KONTO:'} />
              <Typography variant="bodySmall" content={`${count?.title}`} />
            </Row>
            <Row>
              <WidthDiv>
                <Controller
                  name="supplier"
                  control={control}
                  rules={{required: 'Izaberi dobavljača.'}}
                  render={({field: {onChange, name, value}}) => {
                    return (
                      <Dropdown
                        onChange={onChange}
                        value={value}
                        name={name}
                        label="DOBAVLJAČ:"
                        options={suppliers as any}
                        error={errors?.supplier?.message as string}
                        isRequired
                      />
                    );
                  }}
                />
              </WidthDiv>
              {isProFormaInvoice && (
                <>
                  <WidthDiv>
                    <Controller
                      name="pro_forma_invoice_date"
                      control={control}
                      render={({field: {onChange, name, value}}) => (
                        <Datepicker
                          onChange={onChange}
                          label="DATUM PREDRAČUNA:"
                          name={name}
                          value={value ? parseDate(value) : ''}
                          error={errors.pro_forma_invoice_date?.message}
                          isRequired
                        />
                      )}
                    />
                  </WidthDiv>

                  <Input {...register('pro_forma_invoice_number')} label="BROJ PREDRAČUNA:" style={{width: '250px'}} />
                </>
              )}
            </Row>
          </RowWrapper>
          <div>
            <Button
              customContent={
                <ButtonContentWrapper>
                  <Typography content={'Dodaj artikal'} style={{color: Theme?.palette?.white, marginRight: 10}} />
                  <PlusIcon stroke={Theme?.palette?.white} width="15px" height="15px" />
                </ButtonContentWrapper>
              }
              onClick={handleAddRow}
              variant="primary"
            />
          </div>
        </OrderInfo>

        <Table tableHeads={tableHeads} data={newArticles || []} />
        <FormFooter>
          <FormControls>
            <Button
              content="Otkaži"
              variant="secondary"
              onClick={() => {
                navigate('/accounting/order-form');
                breadcrumbs.remove();
              }}
            />
          </FormControls>
          <FormControls>
            <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
          </FormControls>
        </FormFooter>
      </SectionBox>
    </ScreenWrapper>
  );
};
