import React, {useMemo, useState} from 'react';
import {Dropdown, Modal} from 'client-library';
import {FormWrapper, Row} from './styles';
import {ProcurementContractModalProps} from './types';
import {DropdownDataNumber} from '../../types/dropdownData';
import useGetPlans from '../../services/graphql/plans/hooks/useGetPlans';
import {Controller, useForm} from 'react-hook-form';
import useOrderListInsert from '../../services/graphql/orders/hooks/useOrderListInsert';
import {parseDate} from '../../utils/dateUtils';

const initialValues = {
  id: 0,
  date_order: '',
  public_procurement_id: {id: 0, title: ''},
  articles: [],
};

export const AccountingOrderModal: React.FC<ProcurementContractModalProps> = ({open, onClose, navigate, alert}) => {
  const [selectedPlan, setSelectedPlan] = useState<DropdownDataNumber | null>(null);

  const {
    handleSubmit,
    control,
    formState: {errors},
    watch,
  } = useForm({defaultValues: initialValues});

  const {data: plansData} = useGetPlans({
    page: 1,
    size: 100,
    status: '',
    is_pre_budget: false,
    year: '',
  });

  const procurementID = watch('public_procurement_id')?.id;

  const {mutate: orderListInsert} = useOrderListInsert();

  const plansOptions = useMemo(() => {
    return plansData?.map(item => {
      return {
        id: Number(item.id),
        title: item.title.toString(),
      };
    });
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

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        public_procurement_id: values?.public_procurement_id?.id,
        date_order: parseDate(new Date(), true),
      };

      orderListInsert(payload, async orderID => {
        alert.success('Uspješno ste dodali narudzbenicu.');
        onClose();
        navigate(`/accounting/${procurementID}/order-form/${orderID}`);
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Nastavi"
      rightButtonOnClick={handleSubmit(onSubmit)}
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
              options={plansOptions || []}
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
              />
            )}
          />
        </FormWrapper>
      }
      title="KREIRANJE NOVE NARUDŽBENICE"
    />
  );
};
