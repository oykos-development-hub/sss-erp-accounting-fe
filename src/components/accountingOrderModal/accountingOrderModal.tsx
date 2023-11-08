import {Dropdown, Input, Modal} from 'client-library';
import React, {useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {PlanStatus} from '../../constants';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import useGetPlans from '../../services/graphql/plans/hooks/useGetPlans';
import {parseDateForBackend} from '../../utils/dateUtils';
import {FormWrapper, Row} from './styles';
import {ProcurementContractModalProps} from './types';

const initialValues = {
  id: 0,
  date_order: '',
  public_procurement_id: {id: 0, title: ''},
  articles: [],
};

export const AccountingOrderModal: React.FC<ProcurementContractModalProps> = ({open, onClose, navigate, alert}) => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    watch,
  } = useForm({defaultValues: initialValues});

  const {data: plansData} = useGetPlans({
    page: 1,
    size: 100,
    status: undefined,
    is_pre_budget: false,
    year: '',
    contract: true,
  });

  const procurementID = watch('public_procurement_id')?.id;

  const {loading: isSaving, mutate: orderListInsert} = useOrderListInsert();

  const planOption: {id: number; title: string}[] = useMemo(() => {
    if (plansData) {
      const latestPublishedPlan = plansData
        .filter(item => item.status === PlanStatus.OBJAVLJEN)
        .reduce((latestPlan, currentPlan) => {
          const latestPlanYear = new Date(latestPlan.year).getFullYear();
          const currentPlanYear = new Date(currentPlan.year).getFullYear();
          return currentPlanYear > latestPlanYear ? currentPlan : latestPlan;
        });

      if (latestPublishedPlan) {
        return [
          {
            id: Number(latestPublishedPlan.id),
            title: latestPublishedPlan.title.toString(),
          },
        ];
      }
    }

    return [];
  }, [plansData]);

  let procurements: any = [];

  if (planOption) {
    const selectedPlanId = planOption[0]?.id;

    const selectedPlanData = plansData?.find((plan: any) => plan?.id === selectedPlanId);

    if (selectedPlanData) {
      procurements = selectedPlanData.items.map((procurement: any) => ({id: procurement.id, title: procurement.title}));
    }
  }

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    try {
      const payload = {
        ...values,
        public_procurement_id: values?.public_procurement_id?.id,
        date_order: parseDateForBackend(new Date()),
        order_file: values?.order_file?.id || null,
      };

      orderListInsert(payload, async orderID => {
        alert.success('Uspješno sačuvano.');
        onClose();
        navigate(`/accounting/${procurementID}/order-form/${orderID}`);
      });
    } catch (e) {
      alert.error('Greška. Promjene nisu sačuvane.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Nastavi"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <FormWrapper>
          <Row>
            <Input value={planOption[0]?.title} name="plan" label="PLAN:" disabled />
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
              />
            )}
          />
        </FormWrapper>
      }
      title="KREIRANJE NOVE NARUDŽBENICE"
    />
  );
};
