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
          amount: article?.amount,
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
      title: 'Jedinična cijena (sa PDV-OM):',
      accessor: 'price',
      type: 'custom',
      renderContents: price => {
        return <Typography variant="bodyMedium" content={price.toFixed(2)} />;
      },
    },
    {
      title: 'Ukupna vrijednost (sa PDV-OM):',
      accessor: '',
      type: 'custom',
      renderContents: (_, row) => {
        return <Typography variant="bodyMedium" content={row.amount ? (row.amount * row.price).toFixed(2) : 0} />;
      },
    },
  ];

  useEffect(() => {
    if (mappedArticles) {
      setFilteredArticles(mappedArticles);
    }
  }, [mappedArticles]);

  const calculateTotalValues = (items: any) => {
    let totalNetValue = 0;
    let totalGrossValue = 0;

    items.forEach((item: any) => {
      const price = item.price;
      const vatPercentage = item.vat_percentage;

      const netValue = item.amount ? (price - price * (vatPercentage / 100)) * item.amount : 0;

      const grossValue = item.amount ? price * item.amount : 0;

      totalNetValue += netValue;
      totalGrossValue += grossValue;
    });

    return {totalNetValue, totalGrossValue};
  };

  const {totalNetValue, totalGrossValue} = calculateTotalValues(filteredArticles);

  const [totals, setTotals] = useState({totalNetValue, totalGrossValue});

  useEffect(() => {
    const {totalNetValue, totalGrossValue} = calculateTotalValues(filteredArticles);
    setTotals({totalNetValue, totalGrossValue});
  }, [filteredArticles]);

  return (
    <ScreenWrapper context={context}>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`NARUDŽBENICA - BROJ. N${orderId}`} />
        <CustomDivider />
        <OrderInfo>
          <div>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'JAVNA NABAVKA:'} />
              <Typography variant="bodySmall" content={`${orders && orders[0]?.public_procurement?.title}`} />
            </Row>
          </div>
        </OrderInfo>

        <Table tableHeads={tableHeads} data={filteredArticles || []} />
        <Totals>
          <Row>
            <SubTitle variant="bodySmall" content="UKUPNA NETO VRIJEDNOST:" />
            <Typography variant="bodySmall" content={`${totalNetValue.toFixed(2)}`} />
          </Row>
          <Row>
            <SubTitle variant="bodySmall" content="UKUPNA BRUTO VRIJEDNOST:" />
            <Typography variant="bodySmall" content={totalGrossValue.toFixed(2)} />
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
