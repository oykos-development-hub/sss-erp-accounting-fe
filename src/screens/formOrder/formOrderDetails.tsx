import {Button, Table, TableHead, Typography} from 'client-library';
import React, {useEffect} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useGetOrderProcurementAvailableArticles from '../../services/graphql/orders/hooks/useGetOrderProcurementAvailableArticles';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox} from '../../shared/styles';
import {VisibilityType} from '../../types/graphql/publicProcurementArticlesTypes';
import {AmountInput, FormControls, FormFooter, OrderInfo} from './styles';

type FormValues = {
  date_order: string;
  public_procurement_id: number;
  articles: any[];
  order_file: number | null;
};

export const FormOrderDetails: React.FC = () => {
  const {alert, breadcrumbs, navigation} = useAppContext();
  const url = navigation.location.pathname;
  const procurementID = Number(url?.split('/').at(-1));
  const breadcrumbItems = breadcrumbs?.get();
  const procurementTitle = breadcrumbItems[breadcrumbItems.length - 1]?.name?.split('-').at(-1)?.trim();
  const {articles} = useGetOrderProcurementAvailableArticles(procurementID, VisibilityType.Accounting);
  const {mutate: orderListInsert, loading: isSaving} = useOrderListInsert();
  const {
    handleSubmit,
    clearErrors,
    control,
    reset,
    register,
    setError,
    getValues,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      date_order: '',
      public_procurement_id: procurementID,
      articles: articles,
      order_file: null,
    },
  });

  const {fields} = useFieldArray({
    control,
    name: 'articles',
    keyName: 'key',
  });

  const onSubmit = async () => {
    if (isSaving) return;

    handleSaveOrder();
  };

  const handleSaveOrder = (fileID?: number) => {
    if (isSaving) return;
    const articles = getValues('articles');

    const insertArticles = articles?.map((article: any) => {
      return {
        id: article?.id || 0,
        amount: article?.amount || 0,
      };
    });

    const payload = {
      date_order: new Date(),
      public_procurement_id: Number(procurementID),
      articles: insertArticles || [],
      order_file: fileID || null,
    };

    orderListInsert(
      payload as any,
      orderID => {
        alert.success('Uspješno sačuvano.');
        navigation.navigate(`/accounting/${procurementID}/order-form/${orderID}/order-details`);
        breadcrumbs.remove(2);
        breadcrumbs.add({
          name: `Detalji narudžbenice - ${orderID}`,
          to: `/accounting/${procurementID}/order-form/${orderID}/order-details`,
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
    },
    {
      title: 'Dostupne količine',
      accessor: 'available',
      type: 'text',
    },
    {
      title: 'Poruči',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row, index) => {
        return (
          <AmountInput
            {...register(`articles.${index}.amount`, {
              valueAsNumber: true,
              onBlur: e => {
                if (Number(e.target.value) > row.available) {
                  setError(`articles.${index}`, {
                    type: 'custom',
                    message: 'Unijeta količina ne može biti veća od dostupne.',
                  });
                } else {
                  clearErrors(`articles.${index}`);
                }
              },
            })}
            error={errors?.articles?.[index]?.message as string}
          />
        );
      },
    },
  ];

  useEffect(() => {
    if (articles) {
      reset(formValues => ({
        ...formValues,
        articles: articles.map(article => {
          return {
            ...article,
            id: article.id,
            amount: article.amount,
          };
        }),
      }));
    }
  }, [articles]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={'NOVA NARUDŽBENICA'} />
        <CustomDivider />
        <OrderInfo>
          <div>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'JAVNA NABAVKA:'} />
              <Typography variant="bodySmall" content={`${procurementTitle}`} />
            </Row>
          </div>
        </OrderInfo>

        <Table tableHeads={tableHeads} data={fields || []} />
        <FormFooter>
          <FormControls>
            <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
          </FormControls>
        </FormFooter>
      </SectionBox>
    </ScreenWrapper>
  );
};
