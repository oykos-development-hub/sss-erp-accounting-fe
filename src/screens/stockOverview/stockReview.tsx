import {
  Button,
  Dropdown,
  Input,
  Pagination,
  PlusIcon,
  SearchIcon,
  Table,
  TableHead,
  Theme,
  XIcon,
} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, set, useFieldArray, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useInsertMovement from '../../services/graphql/movement/hooks/useInsertMovement';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useGetRecipientUsersOverview from '../../services/graphql/recipientUsersOverview/hooks/useGetRecipientUsers';
import useGetStockOverview from '../../services/graphql/stock/hooks/useGetStockOverview';
import {parseDateForBackend} from '../../utils/dateUtils';
import {tableHeadsStockReview} from './constants';
import {ArticleTitleWrapper, Column, DropdownWrapper, Filter, FormControls, FormFooter, MainTitle} from './styles';
import {StockItem} from '../../types/graphql/stockTypes';

interface Item extends StockItem {
  quantity: string;
}

type formFields = {
  office: string;
  recipient: string;
  articles: Item[];
};

export const StockReview = () => {
  const {
    contextMain,
    alert,
    reportService: {generatePdf},
    navigation,
  } = useAppContext();

  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [form, setForm] = useState({
    page: 1,
    size: 20,
    title: '',
  });
  const organisationUnitId = contextMain?.organization_unit?.id;
  const {total, stockItems, fetch} = useGetStockOverview(form);
  const {recipientUsers} = useGetRecipientUsersOverview();
  const {officesOfOrganizationUnits} = useGetOfficesOfOrganizationUnits(0, organisationUnitId, '');
  const {mutate: orderListAssetMovementMutation, loading: isSaving} = useInsertMovement();

  const {
    handleSubmit,
    control,
    register,
    formState: {errors},
    setError,
    clearErrors,
  } = useForm<formFields>({
    defaultValues: {
      office: '',
      articles: stockItems,
      recipient: '',
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'articles',
    keyName: 'key',
  });

  const tableHeadsStockArticle: TableHead[] = [
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
      title: 'Dostupne količine',
      accessor: 'amount',
      type: 'text',
    },
    {
      title: 'Količina',
      accessor: 'quantity',
      type: 'custom',
      renderContents: (_, row, index) => {
        return (
          <Input
            {...register(`articles.${index}.quantity`, {
              valueAsNumber: true,
              required: 'Ovo polje je obavezno.',
              onChange: e => {
                if (Number(e.target.value) > row.amount) {
                  setError(`articles.${index}.quantity`, {
                    type: 'custom',
                    message: 'Unijeta količina ne može biti veća od dostupne.',
                  });
                } else {
                  clearErrors(`articles.${index}.quantity`);
                }
              },
            })}
            error={errors?.articles?.[index]?.quantity?.message as string}
            style={{width: '200px'}}
            isRequired
          />
        );
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const officesDropdownData = useMemo(() => {
    if (officesOfOrganizationUnits) {
      return officesOfOrganizationUnits?.map(office => ({id: office?.id, title: office?.title}));
    }
  }, [officesOfOrganizationUnits]);

  const usersDropdownData = useMemo(() => {
    if (recipientUsers) {
      return recipientUsers?.map((user: any) => ({id: user?.id, title: user?.title}));
    }
  }, [recipientUsers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevState: any) => ({
      ...prevState,
      title: event.target.value,
    }));
  };

  const filteredTableData = stockItems?.filter(item => {
    const searchString = form?.title.toLowerCase();
    const title = item?.title.toLowerCase();

    return title.includes(searchString);
  });

  const addToSelectedItems = (
    id: number,
    title: string,
    description: string,
    amount: number,
    year: string,
    net_price: number,
    vat_percentage: number,
  ) => {
    const newItem = {id, title, description, amount, year, net_price, vat_percentage, quantity: ''};
    setSelectedItems([...selectedItems, newItem]);
    append(newItem);
  };

  const isItemAlreadySelected = (id: number) => {
    return fields.some((item: any) => item.id === id);
  };

  const onPageChange = (page: number) => {
    setForm((prevState: any) => ({
      ...prevState,
      page: page + 1,
    }));
  };

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const articles = values?.articles || [];
    const payload = {
      id: 0,
      office_id: values?.office?.id,
      recipient_user_id: values?.recipient?.id,
      date_order: parseDateForBackend(new Date()),
      articles: articles?.length > 0 ? articles.map((item: any) => ({id: item.id, quantity: item.quantity})) : [],
      file_id: 0,
    };

    orderListAssetMovementMutation(
      payload,
      () => {
        alert.success('Uspješno sačuvano.');

        generatePdf('MOVEMENT_RECEIPT', {
          articles: articles.map((item: Item) => ({
            title: item.title,
            amount: item.quantity,
            description: item.description,
          })),
          office: officesDropdownData?.find(office => office.id === values?.office?.id)?.title || '',
          recipient: usersDropdownData?.find(user => user.id === values?.recipient?.id)?.title || '',
          date: new Date(),
        });
        navigation.navigate('/accounting/movement');
      },
      () => {
        alert?.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const handleSort = (column: string, direction: string) => {
    const sorter = `sort_by_${column}`;
    setForm((prevState: any) => ({
      page: prevState.page,
      size: prevState.size,
      title: prevState.title,
      [sorter]: direction,
    }));
  };

  useEffect(() => {
    fetch();
  }, [form]);

  return (
    <>
      <div>
        <Filter>
          <Column>
            <Input
              value={form?.title}
              onChange={handleSearch}
              label="NAZIV ARTIKLA:"
              rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
            />
          </Column>
        </Filter>
      </div>

      <Table
        tableHeads={tableHeadsStockReview}
        data={filteredTableData}
        onSort={handleSort}
        tableActions={[
          {
            name: 'Dodaj',
            onClick: item =>
              addToSelectedItems(
                item.id,
                item.title,
                item.description,
                item.amount,
                item.year,
                item.net_price,
                item.vat_percentage,
              ),
            icon: <PlusIcon stroke={Theme?.palette?.gray800} />,
            disabled: item => isItemAlreadySelected(item.id),
            tooltip: () => 'Dodajte artikal',
          },
        ]}
      />
      <Pagination
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        pageRangeDisplayed={3}
        pageCount={total ? total / 10 : 0}
      />

      {fields.length > 0 && (
        <>
          <ArticleTitleWrapper>
            <MainTitle content="ODABRANI ARTIKLI" variant="bodyMedium" />
          </ArticleTitleWrapper>

          <Table
            tableHeads={tableHeadsStockArticle}
            data={fields}
            tableActions={[
              {
                name: 'Ukloni',
                icon: <XIcon stroke={Theme?.palette?.gray800} width="10px" />,
                onClick: (index: number) => remove(index),
                tooltip: () => 'Uklonite artikal',
              },
            ]}
          />
          <DropdownWrapper>
            <Filter>
              <Column>
                <Controller
                  name="office"
                  control={control}
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {onChange, name, value}}) => (
                    <Dropdown
                      onChange={onChange}
                      value={value as any}
                      name={name}
                      label="KANCELARIJA:"
                      options={officesDropdownData || []}
                      error={errors?.office?.message as string}
                      isRequired
                    />
                  )}
                />
              </Column>
              <Column>
                <Controller
                  name="recipient"
                  control={control}
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {onChange, name, value}}) => {
                    return (
                      <Dropdown
                        onChange={onChange}
                        value={value as any}
                        name={name}
                        label="PRIMALAC:"
                        options={usersDropdownData || []}
                        error={errors?.recipient?.message as string}
                        isRequired
                      />
                    );
                  }}
                />
              </Column>
            </Filter>
          </DropdownWrapper>

          <FormFooter>
            <FormControls>
              <Button content="Sačuvaj internu otpremnicu" variant="secondary" onClick={handleSubmit(onSubmit)} />
            </FormControls>
          </FormFooter>
        </>
      )}
    </>
  );
};
