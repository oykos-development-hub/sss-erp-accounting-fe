import {Button, FileUpload, Table, TableHead, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useGetOrderProcurementAvailableArticles from '../../services/graphql/orders/hooks/useGetOrderProcurementAvailableArticles';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, Row, SectionBox} from '../../shared/styles';
import {FileResponseItem} from '../../types/fileUploadType';
import {VisibilityType} from '../../types/graphql/publicProcurementArticlesTypes';
import {AmountInput, FileUploadWrapper, FormControls, FormFooter, OrderInfo} from './styles';

export const FormOrderDetails: React.FC = () => {
  const {alert, breadcrumbs, navigation} = useAppContext();
  const url = navigation.location.pathname;
  const procurementID = Number(url?.split('/').at(-1));
  const breadcrumbItems = breadcrumbs?.get();
  const procurementTitle = breadcrumbItems[breadcrumbItems.length - 1]?.name?.split('-').at(-1)?.trim();
  const [touchedFields, setTouchedFields] = useState<any>({});
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const {articles} = useGetOrderProcurementAvailableArticles(procurementID, VisibilityType.Accounting);
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

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

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        setValue('receive_file', files[0]);
        handleSaveOrder(values.date_order, files[0].id);
      });

      return;
    } else {
      handleSaveOrder(values.date_order);
    }
  };

  const handleSaveOrder = (dateOrder: string, fileID?: number) => {
    if (isSaving) return;

    const insertArticles = filteredArticles.map((article: any) => {
      return {
        id: article?.id,
        amount: article?.amount,
      };
    });

    const payload = {
      date_order: dateOrder,
      public_procurement_id: Number(procurementID),
      articles: insertArticles,
      order_file: fileID,
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

  const mappedArticles = useMemo(() => {
    if (articles) {
      return articles.map((article: any) => {
        return {
          ...article,
          amount: article?.amount,
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
        <MainTitle variant="bodyMedium" content={'NOVA NARUDŽBENICA'} />
        <CustomDivider />
        <OrderInfo>
          <div>
            <Row>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'JAVNA NABAVKA:'} />
              <Typography variant="bodySmall" content={`${procurementTitle}`} />
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
