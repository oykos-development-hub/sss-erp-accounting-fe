import {Button, Dropdown, PlusIcon, Table, TableHead, Theme, Typography} from 'client-library';
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
} from '../formOrder/styles';

type FormValues = {
  date_order: string;
  public_procurement_id: number;
  articles: any[];
  order_file: number;
  supplier: {id: 0; title: ''};
  group_of_articles_id: number;
};

export const Exceptions: React.FC = () => {
  const {alert, breadcrumbs, navigation} = useAppContext();
  const [newArticles, setNewArticles] = useState<OrderListArticleType[]>([]);
  const url = navigation.location.pathname;
  const exceptionID = Number(url?.split('/').at(-1));
  const breadcrumbItems = breadcrumbs?.get();
  const exceptionsTitle = breadcrumbItems[breadcrumbItems.length - 1]?.name?.split('-').at(-1)?.trim();
  const {mutate: orderListInsert, loading: isSaving} = useOrderListInsert();
  const {suppliers} = useGetSuppliers({id: 0, search: null, page: 1, size: 100});
  const countTitle = navigation.location.state?.count;

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
    },
  });

  const supplierID = watch('supplier')?.id;

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
      };
    });

    const payload = {
      date_order: new Date(),
      public_procurement_id: 0,
      articles: insertArticles,
      order_file: null,
      supplier_id: Number(supplierID),
      group_of_articles_id: Number(exceptionID),
    };

    orderListInsert(
      payload as any,
      orderID => {
        alert.success('Uspješno sačuvano.');
        navigation.navigate(`/accounting/${exceptionID}/order-form/${orderID}/order-details`, {state: {countTitle}});
        breadcrumbs.remove(2);
        breadcrumbs.add({
          name: `Detalji narudžbenice - ${exceptionsTitle}`,
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
        return <AmountInput {...register(`articles.${index}.amount`)} />;
      },
    },
  ];

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={'NOVO IZUZEĆE'} />
        <CustomDivider />
        <OrderInfo>
          <RowWrapper>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'GRUPA ARTIKALA:'} />
              <Typography variant="bodySmall" content={`${exceptionsTitle}`} />
            </Row>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'KONTO:'} />
              <Typography variant="bodySmall" content={`${countTitle}`} />
            </Row>
            <Row>
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
                    />
                  );
                }}
              />
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
            <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
          </FormControls>
        </FormFooter>
      </SectionBox>
    </ScreenWrapper>
  );
};
