import {Button, Datepicker, Dropdown, Input} from 'client-library';
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/hooks/useGetOrganizationUnits';
import useGetOverallSpendingReport from '../../services/graphql/overallSpendingReport/useGetOverallSpendingReport';
import useGetStockOverview from '../../services/graphql/stock/hooks/useGetStockOverview';
import ScreenWrapper from '../../shared/screenWrapper';
import {CustomDivider, MainTitle} from '../../shared/styles';
import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';
import {parseDateForBackend} from '../../utils/dateUtils';
import {AccountingReportType, accountingReportTypeOptions} from './constants';
import {Container, Options, OptionsRow} from './styles';

type AccountingReportFilterState = {
  type: DropdownDataString | null;
  start_date: Date | null;
  end_date: Date | null;
  office: DropdownDataNumber | null;
  organization_unit_id: DropdownDataNumber | null;
  exception: boolean | null;
  search: string | null;
  date: Date | null;
};

const initialValues: AccountingReportFilterState = {
  type: accountingReportTypeOptions[0],
  start_date: null,
  end_date: null,
  office: null,
  organization_unit_id: null,
  search: null,
  exception: null,
  date: null,
};

const AccountingReports = () => {
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
    register,
    setValue,
  } = useForm({defaultValues: initialValues});

  const {type, start_date, end_date, office, search, date} = watch();

  const {fetch: fetchStock} = useGetStockOverview(undefined, true);

  const {lazyFetch} = useGetOverallSpendingReport();

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

      const articles = await lazyFetch({
        start_date: parseDateForBackend(start_date) || null,
        end_date: parseDateForBackend(end_date) || null,
        office_id: office?.id || null,
        search: search || null,
        exception: type?.id === AccountingReportType.EXCEPTED_FROM_PLAN ? true : null,
      });

      if (!articles || articles.length === 0) {
        alert.error('Nema artikala za ove datume!');
        return;
      }

      generatePdf('ACCOUNTING_SPENDING', {articles, type: type?.id});
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
      setValue('search', null);
    }
  }, [type]);

  const validateDate = () => {
    if (start_date && end_date) {
      if (start_date > end_date) {
        return 'Datum OD ne može biti veći od datuma DO!';
      }
    }
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
                      error={errors.end_date?.message}
                    />
                  )}
                />
              </>
            )}
          </OptionsRow>

          {type?.id === AccountingReportType.OFFICE_SPENDING && (
            <OptionsRow>
              <Controller
                control={control}
                name="office"
                rules={{
                  required: {
                    value: type?.id === AccountingReportType.OFFICE_SPENDING,
                    message: 'Ovo polje je obavezno!',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    label="KANCELARIJA"
                    value={value}
                    onChange={onChange}
                    options={officeOptions}
                    error={errors.office?.message}
                  />
                )}
              />
              <Input {...register('search')} label="ARTIKAL:" />
            </OptionsRow>
          )}

          {type?.id === AccountingReportType.TOTAL_SPENDING && isSuperAdmin && (
            <Controller
              control={control}
              name="organization_unit_id"
              render={({field: {onChange, value}}) => (
                <Dropdown
                  label="ORGANIZACIONA JEDINICA"
                  value={value}
                  onChange={onChange}
                  options={organizationUnitOptions}
                  isDisabled={!!office}
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
