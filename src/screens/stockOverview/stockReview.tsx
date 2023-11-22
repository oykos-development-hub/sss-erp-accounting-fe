import {
  Button,
  Dropdown,
  FileUpload,
  Input,
  PlusIcon,
  SearchIcon,
  Table,
  Theme,
  Typography,
  XIcon,
  TableHead,
  Pagination,
} from 'client-library';
import {useMemo, useState} from 'react';
import useGetStockOverview from '../../services/graphql/stock/hooks/useGetStockOverview';
import {tableHeadsStockReview} from './constants';
import {
  ArticleTitleWrapper,
  Column,
  FileUploadWrapper,
  Filter,
  FormControls,
  FormFooter,
  Header,
  MainTitle,
} from './styles';
import useInsertMovement from '../../services/graphql/movement/hooks/useInsertMovement';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useAppContext from '../../context/useAppContext';
import useGetRecipientUsersOverview from '../../services/graphql/recipientUsersOverview/hooks/useGetRecipientUsers';
import {Controller, useForm} from 'react-hook-form';
import {FileResponseItem} from '../../types/fileUploadType';
import {parseDateForBackend} from '../../utils/dateUtils';

export const StockReview = () => {
  const {
    contextMain,
    alert,
    fileService: {uploadFile},
  } = useAppContext();
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [disabled, setDisabled] = useState(false);

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

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
    clearErrors('file_id');
  };

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
            style={{width: '100px'}}
            disabled={disabled}
          />
        );
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const handleAssetMovementInsert = (id: number, officeId: number, recipientId: number, movementFileId?: number) => {
    const payload = {
      id: id,
      office_id: officeId,
      recipient_user_id: recipientId,
      date_order: parseDateForBackend(new Date()),
      articles:
        selectedItems?.length > 0
          ? selectedItems.map((item: any) => ({article_id: item.id, quantity: item.quantity}))
          : [],
      file_id: movementFileId,
    };

    orderListAssetMovementMutation(
      payload,
      () => {
        setDisabled(true);
        alert.success('Uspješno sačuvano.');
      },
      () => {
        alert?.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(
        formData,
        (files: FileResponseItem[]) => {
          setUploadedFile(null);
          setValue('file_id', files[0]);

          handleAssetMovementInsert(values?.id, values?.office?.id, values?.recipient?.id, files[0]?.id);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );

      return;
    } else {
      handleAssetMovementInsert(values?.id, values?.office?.id, values?.recipient?.id);
    }
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
            onClick: item => addToSelectedItems(item.article_id, item.title, item.description, item.amount),
            icon: <PlusIcon stroke={Theme?.palette?.gray800} />,
            disabled: item => isItemAlreadySelected(item.article_id),
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
          <Header>
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
            <Column></Column>
          </Header>
          <FileUploadWrapper>
            <FileUpload
              icon={null}
              files={uploadedFile}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Otpremnica" />}
              hint="Fajlovi neće biti učitani dok ne sačuvate otpremnicu."
              buttonText="Učitaj"
              disabled={disabled}
            />
          </FileUploadWrapper>

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
