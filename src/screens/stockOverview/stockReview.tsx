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
import {useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useInsertMovement from '../../services/graphql/movement/hooks/useInsertMovement';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useGetRecipientUsersOverview from '../../services/graphql/recipientUsersOverview/hooks/useGetRecipientUsers';
import useGetStockOverview from '../../services/graphql/stock/hooks/useGetStockOverview';
import {parseDateForBackend} from '../../utils/dateUtils';
import {tableHeadsStockReview} from './constants';
import {ArticleTitleWrapper, Column, DropdownWrapper, Filter, FormControls, FormFooter, MainTitle} from './styles';

export const StockReview = ({navigateToList}: {navigateToList: () => void}) => {
  const {
    contextMain,
    alert,
    reportService: {generatePdf},
  } = useAppContext();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [touchedFields, setTouchedFields] = useState<any>({});

  const {total, stockItems} = useGetStockOverview(page, 1000, searchQuery);
  const organisationUnitId = contextMain?.organization_unit?.id;
  const {officesOfOrganizationUnits} = useGetOfficesOfOrganizationUnits(0, organisationUnitId, '');
  const {recipientUsers} = useGetRecipientUsersOverview();
  const {mutate: orderListAssetMovementMutation, loading: isSaving} = useInsertMovement();

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
    setSearchQuery(event.target.value);
  };

  const filteredTableData = stockItems?.filter(item => {
    const searchString = searchQuery.toLowerCase();
    const title = item?.title.toLowerCase();

    return title.includes(searchString);
  });

  const addToSelectedItems = (id: number, title: string, description: string, amount: number) => {
    const newItem = {id, title, description, amount};
    setSelectedItems([...selectedItems, newItem]);
  };

  const isItemAlreadySelected = (id: number) => {
    return selectedItems.some((item: any) => item.id === id);
  };

  const removeFromSelectedItems = (id: number) => {
    const updatedItems = selectedItems.filter((item: any) => item.id !== id);
    setSelectedItems(updatedItems);
  };

  const {handleSubmit, control, clearErrors, setValue} = useForm();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    const {value} = event.target;
    const updatedArticles = [...selectedItems];
    const index = updatedArticles.findIndex(item => item.id === row.id);

    if (index !== -1) {
      const updatedItem = {...updatedArticles[index], quantity: value === '' ? null : +value};
      updatedArticles[index] = updatedItem;
      setSelectedItems(updatedArticles);
    }
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const handleBlurInput = (itemId: number) => {
    setTouchedFields({...touchedFields, [itemId]: true});
    const touchedItem = selectedItems.find((item: any) => item.id === itemId);
    if (touchedItem && touchedItem.quantity > touchedItem.amount) {
      const updatedItems = selectedItems.map((item: any) => {
        if (item.id === itemId) {
          return {...item, error: 'Količina ne može biti veća od dostupne.'};
        }
        return item;
      });
      setSelectedItems(updatedItems);
    } else {
      const updatedItems = selectedItems.map((item: any) => {
        if (item.id === itemId) {
          return {...item, error: ''};
        }
        return item;
      });
      setSelectedItems(updatedItems);
    }
  };

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
      renderContents: (_, row) => {
        return (
          <Input
            type="number"
            value={row.quantity}
            onChange={event => handleInputChange(event, row)}
            onBlur={() => handleBlurInput(row.id)}
            style={{width: '100px'}}
            disabled={disabled}
            error={touchedFields[row.id] ? row.error : ''}
          />
        );
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const onSubmit = (values: any) => {
    if (isSaving) return;
    console.log(selectedItems);
    const payload = {
      id: values.id,
      office_id: values?.office?.id,
      recipient_user_id: values?.recipient?.id,
      date_order: parseDateForBackend(new Date()),
      articles:
        selectedItems?.length > 0 ? selectedItems.map((item: any) => ({id: item.id, quantity: item.quantity})) : [],
      file_id: 0,
    };

    orderListAssetMovementMutation(
      payload,
      () => {
        setDisabled(true);
        alert.success('Uspješno sačuvano.');

        generatePdf('MOVEMENT_RECEIPT', {
          articles: selectedItems.map((item: any) => ({
            title: item.title,
            amount: item.amount,
            description: item.description,
          })),
          office: officesDropdownData?.find(office => office.id === values?.office?.id)?.title || '',
          recipient: usersDropdownData?.find(user => user.id === values?.recipient?.id)?.title || '',
          date: new Date(),
        });

        navigateToList();
      },
      () => {
        alert?.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  return (
    <>
      <div>
        <Filter>
          <Column>
            <Input
              value={searchQuery}
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
        tableActions={[
          {
            name: 'Dodaj',
            onClick: item => addToSelectedItems(item.id, item.title, item.description, item.amount),
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

      {selectedItems.length > 0 && (
        <>
          <ArticleTitleWrapper>
            <MainTitle content="ODABRANI ARTIKLI" variant="bodyMedium" />
          </ArticleTitleWrapper>

          <Table
            tableHeads={tableHeadsStockArticle}
            data={selectedItems}
            tableActions={[
              {
                name: 'Ukloni',
                icon: <XIcon stroke={Theme?.palette?.gray800} width="10px" />,
                onClick: (item: any) => removeFromSelectedItems(item.id),
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
                  render={({field: {onChange, name, value}}) => (
                    <Dropdown
                      onChange={onChange}
                      value={value}
                      name={name}
                      label="KANCELARIJA:"
                      options={officesDropdownData || []}
                      isDisabled={disabled}
                    />
                  )}
                />
              </Column>
              <Column>
                <Controller
                  name="recipient"
                  control={control}
                  render={({field: {onChange, name, value}}) => {
                    return (
                      <Dropdown
                        onChange={onChange}
                        value={value as any}
                        name={name}
                        label="PRIMALAC:"
                        options={usersDropdownData || []}
                        isDisabled={disabled}
                      />
                    );
                  }}
                />
              </Column>
            </Filter>
          </DropdownWrapper>

          <FormFooter>
            <FormControls>
              <Button
                content="Sačuvaj internu otpremnicu"
                variant="secondary"
                onClick={handleSubmit(onSubmit)}
                disabled={disabled}
              />
            </FormControls>
          </FormFooter>
        </>
      )}
    </>
  );
};
