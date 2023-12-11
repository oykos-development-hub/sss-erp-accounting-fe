import {Button, Datepicker, Dropdown} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useGetMovementArticles from '../../services/graphql/movementArticles/useGetMovementArticles';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/hooks/useGetOrganizationUnits';
import useGetOverallSpendingReport from '../../services/graphql/overallSpendingReport/useGetOverallSpendingReport';
import useGetStockOverview from '../../services/graphql/stock/hooks/useGetStockOverview';
import ScreenWrapper from '../../shared/screenWrapper';
import {CustomDivider, MainTitle} from '../../shared/styles';
import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';
import {parseDateForBackend} from '../../utils/dateUtils';
import {useDebounce} from '../../utils/useDebounce';
import {AccountingReportType, accountingReportTypeOptions} from './constants';
import {Container, OfficeOptionsRow, Options, OptionsRow} from './styles';

type AccountingReportFilterState = {
  type: DropdownDataString | null;
  start_date: Date | null;
  end_date: Date | null;
  office: DropdownDataNumber | null;
  organization_unit_id: DropdownDataNumber | null;
  exception: boolean | null;
  articles: {value: string; label: string}[] | null;
  date: Date | null;
};

const initialValues: AccountingReportFilterState = {
  type: accountingReportTypeOptions[0],
  start_date: null,
  end_date: null,
  office: null,
  organization_unit_id: null,
  articles: null,
  exception: null,
  date: null,
};

const AccountingReports = () => {
  const [search, setSearch] = useState('');

  const {
    reportService: {generatePdf},
    contextMain,
    alert,
  } = useAppContext();

  const orgUnitId = contextMain?.organization_unit?.id;
  const isSuperAdmin = contextMain?.role_id === 1;

  const {officesOfOrganizationUnits: officeOptions} = useGetOfficesOfOrganizationUnits(0, orgUnitId, '');
  const {organizationUnits: organizationUnitOptions} = useGetOrganizationUnits();

  const {
    handleSubmit,
    control,
    formState: {isValid, errors},
    watch,
    setValue,
  } = useForm({defaultValues: initialValues});

  const {type, start_date, end_date, office, articles, date, organization_unit_id} = watch();

  const {fetch: fetchStock} = useGetStockOverview(undefined, true);

  const {lazyFetch} = useGetOverallSpendingReport();

  const debouncedSearch = useDebounce(search, 500);

  const {articles: movementArticles} = useGetMovementArticles(
    debouncedSearch,
    type?.id !== AccountingReportType.OFFICE_SPENDING,
  );

  const onSubmit = async () => {
    if (type?.id === AccountingReportType.STOCK) {
      if (date) {
        const stockArticles = await fetchStock(parseDateForBackend(date)!);

        if (!stockArticles || stockArticles.length === 0) {
          alert.error('Nema artikala za ovaj datum!');
          return;
        }

        generatePdf('ACCOUNTING_SPENDING', {articles: stockArticles, type: AccountingReportType.STOCK});
      }
    } else {
      if (!isValid) return;

      const orgUnit = isSuperAdmin
        ? organization_unit_id
          ? organization_unit_id.id
          : null
        : contextMain?.organization_unit?.id;

      const data = await lazyFetch({
        start_date: parseDateForBackend(start_date) || null,
        end_date: parseDateForBackend(end_date) || null,
        office_id: office?.id || null,
        articles: articles ? articles.map(opt => opt.value) : null,
        exception: type?.id === AccountingReportType.EXCEPTED_FROM_PLAN ? true : null,
        organization_unit_id: orgUnit,
      });

      if (!data || data.length === 0) {
        alert.error('Nema artikala za ovaj period!');
        return;
      }

      generatePdf('ACCOUNTING_SPENDING', {articles: data, type: type?.id});
    }
  };

  useEffect(() => {
    if (type && type.id === AccountingReportType.EXCEPTED_FROM_PLAN) {
      setValue('exception', true);
    } else {
      setValue('exception', null);
    }

    if (type && type.id !== AccountingReportType.OFFICE_SPENDING) {
      setValue('office', null);
      setValue('articles', null);
    }
  }, [type]);

  const validateDate = () => {
    if (start_date && end_date) {
      if (start_date > end_date) {
        return 'Datum OD ne može biti veći od datuma DO!';
      }
    }
  };

  const articleOptions = useMemo(() => {
    return movementArticles?.map((item: any) => ({id: item, title: item})) as any;
  }, [movementArticles]);

  const onSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <ScreenWrapper>
      <Container>
        <MainTitle content="IZVJEŠTAJI" variant="bodyMedium" />
        <CustomDivider />

        <Options>
          <OptionsRow>
            <Controller
              control={control}
              name="type"
              rules={{required: 'Ovo polje je obavezno!'}}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  label="TIP IZVJEŠTAJA"
                  value={value}
                  onChange={onChange}
                  options={accountingReportTypeOptions}
                  isRequired
                  error={errors.type?.message}
                />
              )}
            />
            {type?.id === AccountingReportType.STOCK ? (
              <Controller
                name="date"
                rules={{required: {value: type?.id === AccountingReportType.STOCK, message: 'Ovo polje je obavezno!'}}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange as any}
                    label="DATUM:"
                    name={name}
                    selected={value ? new Date(value) : ''}
                    isRequired
                    error={errors.date?.message}
                  />
                )}
              />
            ) : (
              <>
                <Controller
                  name="start_date"
                  rules={{validate: validateDate}}
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange as any}
                      label="DATUM OD:"
                      name={name}
                      selected={value ? new Date(value) : ''}
                      isRequired
                      error={errors.start_date?.message}
                    />
                  )}
                />
                <Controller
                  name="end_date"
                  control={control}
                  rules={{required: 'Ovo polje je obavezno!', validate: validateDate}}
                  render={({field: {onChange, name, value}}) => (
                    <Datepicker
                      onChange={onChange as any}
                      label="DATUM DO:"
                      name={name}
                      selected={value ? new Date(value) : ''}
                      isRequired
                      error={errors.end_date?.message}
                    />
                  )}
                />
              </>
            )}
          </OptionsRow>

          {type?.id === AccountingReportType.OFFICE_SPENDING && (
            <OfficeOptionsRow>
              <Controller
                control={control}
                name="office"
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    label="KANCELARIJA:"
                    value={value}
                    onChange={onChange}
                    options={officeOptions}
                    isRequired
                    error={errors.office?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="articles"
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    label="ARTIKLI:"
                    value={value as any}
                    onChange={onChange}
                    options={articleOptions as any}
                    isMulti={true}
                    isSearchable={true}
                    // Remove this when component is fixed in devkit and storybook
                    //@ts-ignore
                    onInputChange={onSearch}
                  />
                )}
              />
            </OfficeOptionsRow>
          )}

          {type?.id === AccountingReportType.EXCEPTED_FROM_PLAN && isSuperAdmin && (
            <Controller
              control={control}
              name="organization_unit_id"
              render={({field: {onChange, value}}) => (
                <Dropdown
                  label="ORGANIZACIONA JEDINICA:"
                  value={value}
                  onChange={onChange}
                  options={organizationUnitOptions}
                  isDisabled={!!office}
                  style={{maxWidth: '320px'}}
                />
              )}
            />
          )}
        </Options>

        <Button content="Generiši izvještaj" onClick={handleSubmit(onSubmit)} style={{width: 'fit-content'}} />
      </Container>
    </ScreenWrapper>
  );
};

export default AccountingReports;
