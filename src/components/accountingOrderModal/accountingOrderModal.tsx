import {Button, Dropdown, Modal} from 'client-library';
import React, {useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {PlanStatus} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useGetPlans from '../../services/graphql/plans/hooks/useGetPlans';
import {DropdownDataNumber} from '../../types/dropdownData';
import {ButtonWrapper, FormWrapper, Row} from './styles';
import {AccountingOrderModalProps} from './types';

const initialValues = {
  id: 0,
  date_order: '',
  public_procurement_id: {id: 0, title: ''},
  articles: [],
};

export const AccountingOrderModal: React.FC<AccountingOrderModalProps> = ({open, onClose}) => {
  const [selectedPlan, setSelectedPlan] = useState<DropdownDataNumber | null>(null);

  const {
    handleSubmit,
    control,
    formState: {errors},
    watch,
  } = useForm({defaultValues: initialValues});

  const {breadcrumbs, navigation} = useAppContext();
  const {data: plansData} = useGetPlans({
    page: 1,
    size: 100,
    status: undefined,
    is_pre_budget: false,
    year: '',
    contract: true,
  });

  const procurementID = watch('public_procurement_id')?.id;
  const procurementTitle = watch('public_procurement_id').title;

  const plansOptions = useMemo(() => {
    if (plansData) {
      return plansData
        .filter(item => item.status === PlanStatus.OBJAVLJEN)
        .map(item => ({
          id: Number(item.id),
          title: item.title.toString(),
        }));
    } else {
      return [];
    }
  }, [plansData]);

  const handlePlanSelect = (value: any) => {
    setSelectedPlan(plansOptions?.find((item: any) => item.id === value?.id) || null);
  };

  let procurements: any = [];

  if (selectedPlan) {
    procurements = plansData
      ?.find((plan: any) => plan.id === selectedPlan?.id)
      ?.items.map((procurement: any) => {
        return {id: procurement.id, title: procurement.title};
      });
  }

  const onSubmit = async () => {
    navigation.navigate(`/accounting/order-form/${procurementID}`);
    breadcrumbs.add({
      name: `Nova narudžbenica - ${procurementTitle} `,
      to: '/accounting/order-form',
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      customButtonsControls={
        <ButtonWrapper>
          <Button variant="secondary" content="Otkaži" onClick={onClose} style={{marginRight: 10}} />
          <Button variant="primary" disabled={procurementID === 0} onClick={handleSubmit(onSubmit)} content="Nastavi" />
        </ButtonWrapper>
      }
      content={
        <FormWrapper>
          <Row>
            <Dropdown
              onChange={value => {
                handlePlanSelect(value);
              }}
              value={selectedPlan}
              name="plan"
              label="PLAN:"
              options={plansOptions as any}
            />
          </Row>
          <Controller
            name="public_procurement_id"
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {onChange, name, value}}) => (
              <Dropdown
                onChange={onChange as any}
                value={value as any}
                name={name}
                label="NABAVKA:"
                options={procurements}
                error={errors.public_procurement_id?.message as string}
                isDisabled={!selectedPlan}
                isRequired
              />
            )}
          />
        </FormWrapper>
      }
      title="KREIRANJE NOVE NARUDŽBENICE"
    />
  );
};
