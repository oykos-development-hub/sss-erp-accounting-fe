import {Button, MicroserviceProps, Table, TableHead, Typography, FileUpload} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import useGetOrderList from '../../services/graphql/orders/hooks/useGetOrderList';
import useGetOrderProcurementAvailableArticles from '../../services/graphql/orders/hooks/useGetOrderProcurementAvailableArticles';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox, SubTitle} from '../../shared/styles';
import {AmountInput, FileUploadWrapper, FormControls, FormFooter, OrderInfo, Totals} from './styles';
import {useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import {FileResponseItem} from '../../types/fileUploadType';

export const FormOrderDetails: React.FC = () => {
  const {alert, breadcrumbs, navigation} = useAppContext();
  const url = navigation.location.pathname;
  const orderId = Number(url?.split('/').at(-1));
  const procurementID = Number(url?.split('/').at(-3));
  const [touchedFields, setTouchedFields] = useState<any>({});
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const {articles} = useGetOrderProcurementAvailableArticles(procurementID);
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

  const {orders} = useGetOrderList(1, 10, orderId, 0, '', '');

  const {mutate: orderListInsert, loading: isSaving} = useOrderListInsert();

  const {handleSubmit, clearErrors, setValue} = useForm();

  const {
    fileService: {uploadFile},
  } = useAppContext();

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
    clearErrors('receive_file');
  };

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

  const onSubmit = async () => {
    if (isSaving) return;

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        setValue('receive_file', files[0]);
        handleSaveOrder(files[0].id);
      });

      return;
    } else {
      handleSaveOrder();
    }
  };

  const handleSaveOrder = (files?: number) => {
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
      order_file: files,
    };

    orderListInsert(
      payload as any,
      () => {
        alert.success('Uspješno sačuvano.');
        navigation.navigate(`/accounting/${procurementID}/order-form/${orderId}/order-details`);
        breadcrumbs.add({
          name: `Detalji narudžbenice - ${orderId}`,
          to: `/accounting/${procurementID}/order-form/${orderId}/order-details`,
        });
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
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
  ];

  useEffect(() => {
    if (mappedArticles) {
      setFilteredArticles(mappedArticles);
    }
  }, [mappedArticles]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`NARUDŽBENICA - BROJ. N${orderId}`} />
        <CustomDivider />
        <OrderInfo>
          <div>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'JAVNA NABAVKA:'} />
              <Typography variant="bodySmall" content={`${orders && orders[0]?.public_procurement?.title}`} />
            </Row>

            <Row>
              <FileUploadWrapper>
                <FileUpload
                  icon={null}
                  files={uploadedFile}
                  variant="secondary"
                  onUpload={handleUpload}
                  note={<Typography variant="bodySmall" content="Narudžbenica" />}
                  hint="Fajlovi neće biti učitani dok ne sačuvate narudžbenicu."
                  buttonText="Učitaj"
                />
              </FileUploadWrapper>
            </Row>
          </div>
        </OrderInfo>

        <Table tableHeads={tableHeads} data={filteredArticles || []} />
        <FormFooter>
          <FormControls>
            <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
          </FormControls>
        </FormFooter>
      </SectionBox>
    </ScreenWrapper>
  );
};
