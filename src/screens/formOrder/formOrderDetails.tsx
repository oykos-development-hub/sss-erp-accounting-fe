import {Button, MicroserviceProps, Table, TableHead, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import useGetOrderList from '../../services/graphql/orders/hooks/useGetOrderList';
import useGetOrderProcurementAvailableArticles from '../../services/graphql/orders/hooks/useGetOrderProcurementAvailableArticles';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox, SubTitle} from '../../shared/styles';
import {AmountInput, FormControls, FormFooter, OrderInfo, Totals} from './styles';

interface FormOrderDetailsPageProps {
  context: MicroserviceProps;
}

export const FormOrderDetails: React.FC<FormOrderDetailsPageProps> = ({context}) => {
  //fixed for now, will be dynamic
  const url = context?.navigation.location.pathname;
  const orderId = Number(url?.split('/').at(-1));
  const procurementID = Number(url?.split('/').at(-3));
  const [touchedFields, setTouchedFields] = useState<any>({});
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const {articles} = useGetOrderProcurementAvailableArticles(procurementID);

  const {orders} = useGetOrderList(1, 10, orderId, 0, '', '');
  const supplier = orders[0]?.supplier;
  const {mutate: orderListInsert, loading: isSaving} = useOrderListInsert();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    const {value} = event.target;
    const updatedArticles = [...filteredArticles];
    const index = updatedArticles.findIndex(item => item.id === row.id);

    if (index !== -1) {
      const updatedItem = {...updatedArticles[index], amount: Number(value)};
      updatedArticles[index] = updatedItem;
      setFilteredArticles([...updatedArticles]);
    }
  };

  const handleBlurInput = (itemId: number) => {
    setTouchedFields({...touchedFields, [itemId]: true});
    const touchedItem = filteredArticles.find(item => item.id === itemId);

    if (touchedItem && touchedItem.amount > touchedItem.available) {
      const updatedArticles = filteredArticles.map(item => {
        if (item.id === itemId) {
          return {...item, error: 'Količina ne može biti veća od dostupne.'};
        }
        return item;
      });
      setFilteredArticles(updatedArticles);
    } else {
      const updatedArticles = filteredArticles.map(item => {
        if (item.id === itemId) {
          return {...item, error: ''};
        }
        return item;
      });

      setFilteredArticles(updatedArticles);
    }
  };

  const handleSaveOrder = () => {
    if (isSaving) return;

    const insertArticles = filteredArticles.map((article: any) => {
      return {
        id: article?.id,
        amount: article?.amount,
      };
    });

    const payload = {
      id: orderId,
      date_order: orders[0]?.date_order,
      public_procurement_id: Number(procurementID),
      articles: insertArticles,
    };

    orderListInsert(
      payload as any,
      () => {
        context.alert.success('Uspješno sačuvano.');
        context.navigation.navigate(`/accounting/${procurementID}/order-form/${orderId}/order-details`);
        context.breadcrumbs.add({
          name: `Detalji narudžbenice - ${orderId}`,
          to: `/accounting/${procurementID}/order-form/${orderId}/order-details`,
        });
      },
      () => {
        context.alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const mappedArticles = useMemo(() => {
    if (articles) {
      return articles.map((article: any) => {
        return {
          ...article,
          amount: article?.amount || 0,
          order_id: orderId,
        };
      });
    } else {
      return [];
    }
  }, [articles]);

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
      accessor: 'supplier',
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
      renderContents: (_, row) => {
        return (
          <AmountInput
            type="number"
            value={row.amount}
            onChange={event => handleInputChange(event, row)}
            onBlur={() => handleBlurInput(row.id)}
            error={touchedFields[row.id] ? row.error : ''}
          />
        );
      },
    },
    {
      title: 'Narudžbenica',
      accessor: 'order_id',
      type: 'text',
    },
    {
      title: 'Ukupna vrijednost (sa PDV-OM):',
      accessor: 'total_price',
      type: 'custom',
      renderContents: (total_price: number) => {
        return <Typography variant="bodyMedium" content={total_price ? parseFloat(total_price.toFixed(2)) : ''} />;
      },
    },
  ];

  useEffect(() => {
    if (mappedArticles) {
      setFilteredArticles(mappedArticles);
    }
  }, [mappedArticles]);

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
              <Typography variant="bodySmall" content={`${supplier?.title}`} />
            </Row>
          </div>
        </OrderInfo>

        <Table tableHeads={tableHeads} data={filteredArticles || []} />
        <Totals>
          <Row>
            <SubTitle variant="bodySmall" content="UKUPNA NETO VRIJEDNOST:" />
            <Typography variant="bodySmall" content="1.000,00 KM" />
          </Row>
          <Row>
            <SubTitle variant="bodySmall" content="UKUPNA BRUTO VRIJEDNOST:" />
            <Typography variant="bodySmall" content="1.000,00 KM" />
          </Row>
        </Totals>

        <FormFooter>
          <FormControls>
            <Button content="Sačuvaj" variant="primary" onClick={handleSaveOrder} />
          </FormControls>
        </FormFooter>
      </SectionBox>
    </ScreenWrapper>
  );
};
