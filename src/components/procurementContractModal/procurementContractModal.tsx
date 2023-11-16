import React, {useMemo, useEffect} from 'react';
import {Dropdown, Modal, Input, Datepicker} from 'client-library';
import {Column, FormWrapper} from './styles';
import {ProcurementContractModalProps} from './types';
import useGetPlansOverview from '../../services/graphql/plans/hooks/useGetPlans';
import {Filters} from '../../shared/styles';
import useInsertProcurementContract from '../../services/graphql/procurementContractsOverview/hooks/useInsertProcurementContract';
import {parseDate, parseDateForBackend} from '../../utils/dateUtils';
import useGetSuppliers from '../../services/graphql/suppliers/hooks/useGetSuppliers';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';

const initialValues = {
  plan: {id: 0, title: ''},
  procurement: {id: 0, title: ''},
  serial_number: '',
  date_of_signing: '',
  date_of_expiry: '',
  supplier: {id: 0, title: ''},
};

export const ProcurementContractModal: React.FC<ProcurementContractModalProps> = ({
  open,
  onClose,
  navigate,
  fetch,
  alert,
  selectedItem,
}) => {
  const {suppliers} = useGetSuppliers({id: 0, search: null, page: 1, size: 100});
  const supplierOptions = useMemo(() => suppliers?.map(item => ({id: item?.id, title: item?.title})), [suppliers]);
  const {breadcrumbs} = useAppContext();
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
  } = useForm({defaultValues: initialValues});

  const selectedPlanId = watch('plan')?.id;
  const selectedProcurementId = watch('procurement')?.id;

  const {data: plansData} = useGetPlansOverview({
    page: 1,
    size: 1000,
    status: undefined,
    is_pre_budget: false,
    year: '',
    contract: false,
  });

  const plansOptions = useMemo(() => {
    return plansData?.map(item => {
      return {
        id: item.id,
        title: item.title,
      };
    });
  }, [plansData]);

  const procurementsOptions = useMemo(() => {
    const plan = plansData?.find(item => item.id === selectedPlanId);
    return plan?.items.map(item => {
      return {id: item.id, title: item.title};
    });
  }, [plansData, selectedPlanId]);

  const {mutate: insertContract} = useInsertProcurementContract();

  const serialNumber = watch('serial_number');

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        id: 0,
        public_procurement_id: Number(selectedProcurementId),
        supplier_id: Number(values?.supplier.id),
        serial_number: values?.serial_number,
        date_of_signing: values.date_of_signing && parseDateForBackend(values.date_of_signing),
        date_of_expiry: values?.date_of_expiry && parseDateForBackend(values?.date_of_expiry),
        net_value: values?.net_value || 0.0,
        gross_value: values?.gross_value || 0.0,
        file: [],
      };

      await insertContract(
        payload,
        contractID => {
          reset();
          fetch();
          alert.success('Uspješno sačuvano!');
          onClose();
          navigate(`/procurements/contracts/${contractID}`);
          breadcrumbs.add({
            name: `Detalji ugovora ${serialNumber} `,
            to: `/procurements/contracts/${contractID}`,
          });
        },
        () => {
          fetch();
          alert.error('Greška pri čuvanju!');
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        plan: selectedItem?.plan,
        procurement: {id: selectedItem?.id, title: selectedItem?.title},
      });
    }
  }, [selectedItem]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Dodaj novi ugovor"
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <FormWrapper>
          <Filters>
            <Column>
              <Controller
                name="plan"
                control={control}
                rules={{validate: () => (selectedPlanId === 0 ? 'Izaberi plan' : true)}}
                render={({field: {name, onChange, value}}) => {
                  return (
                    <Dropdown
                      onChange={onChange}
                      value={value}
                      name={name}
                      label="PLAN:"
                      options={plansOptions || []}
                      error={selectedPlanId === 0 ? (errors?.plan?.message as string) : ''}
                    />
                  );
                }}
              />
            </Column>
            <Column>
              <Controller
                name="procurement"
                control={control}
                rules={{
                  validate: () =>
                    selectedProcurementId === 0 && selectedPlanId === 0 ? 'Izaberi javnu nabavku' : true,
                }}
                render={({field: {name, onChange, value}}) => {
                  return (
                    <Dropdown
                      onChange={onChange}
                      value={value}
                      name={name}
                      label="NABAVKA:"
                      options={procurementsOptions || []}
                      isDisabled={!selectedPlanId}
                      error={
                        selectedProcurementId === 0 && selectedPlanId > 0
                          ? (errors?.procurement?.message as string)
                          : ''
                      }
                    />
                  );
                }}
              />
            </Column>
          </Filters>

          <Filters>
            <Column>
              <Input
                {...register('serial_number', {required: 'Ovo polje je obavezno'})}
                error={errors?.serial_number?.message as string}
                label={'ŠIFRA UGOVORA:'}
              />
            </Column>
            <Column>
              <Controller
                name="supplier"
                control={control}
                rules={{validate: value => (value.title === '' ? 'Izaberi dobavljača' : true)}}
                render={({field: {onChange, name, value}}) => {
                  return (
                    <Dropdown
                      onChange={onChange}
                      value={value}
                      name={name}
                      label="DOBAVLJAČ:"
                      options={supplierOptions as any}
                      error={errors?.supplier?.message as string}
                    />
                  );
                }}
              />
            </Column>
          </Filters>

          <Filters>
            <Column>
              <Controller
                name="date_of_signing"
                control={control}
                rules={{
                  required: 'Ovo polje je obavezno',
                  validate: value =>
                    !value || !watch('date_of_signing') || new Date(value) >= new Date(watch('date_of_signing'))
                      ? true
                      : 'Datum završetka ugovora ne može biti prije datuma zaključenja ugovora.',
                }}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange}
                    label="DATUM ZAKLJUČENJA UGOVORA:"
                    name={name}
                    value={value ? parseDate(value) : ''}
                    error={errors.date_of_signing?.message}
                  />
                )}
              />
            </Column>
            <Column>
              <Controller
                name="date_of_expiry"
                control={control}
                rules={{
                  required: 'Ovo polje je obavezno',
                  validate: value =>
                    !value || !watch('date_of_signing') || new Date(value) >= new Date(watch('date_of_signing'))
                      ? true
                      : 'Datum završetka ugovora ne može biti prije datuma zaključenja ugovora.',
                }}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange}
                    label="DATUM ZAVRŠETKA UGOVORA:"
                    name={name}
                    value={value ? parseDate(value) : ''}
                    error={errors.date_of_expiry?.message}
                  />
                )}
              />
            </Column>
          </Filters>
        </FormWrapper>
      }
      title="NOVI UGOVOR"
    />
  );
};
