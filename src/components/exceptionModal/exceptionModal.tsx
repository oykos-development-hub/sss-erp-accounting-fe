import {Button, Dropdown, Modal} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useGetCounts from '../../services/graphql/counts/hooks/useGetCounts';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import useGetSettings from '../../services/graphql/settings/useGetSettings';
import {AccountingOrderModalProps} from '../accountingOrderModal/types';
import {ButtonWrapper, FormWrapper, Row} from './styles';

const TypeOptions = [
  {
    id: false,
    title: 'Narudžbenica',
  },
  {
    id: true,
    title: 'Predračun',
  },
];
const initialValues = {
  id: 0,
  article_group: {id: null, title: ''},
  counts: {id: null, title: ''},
  is_pro_forma_invoice: {id: false, title: ''},
};

export const ExceptionModal: React.FC<AccountingOrderModalProps> = ({open, onClose}) => {
  const {breadcrumbs, navigation} = useAppContext();
  const {options: articleGroup} = useGetSettings({entity: 'article_group'});
  const {loading: isSaving} = useOrderListInsert();
  const {counts} = useGetCounts({level: 3});
  const {handleSubmit, watch, control, setValue} = useForm({defaultValues: initialValues});
  const articlegGroupName = watch('article_group')?.title;
  const articleGroupID = watch('article_group')?.id;
  const count = watch('counts');
  const isProFormaInvoice = watch('is_pro_forma_invoice')?.id;

  const dropdowncountsOptions = counts?.map(item => {
    return {
      title: `${item.serial_number} - ${item.title}`,
      id: item.id,
    };
  });

  const onSubmit = async () => {
    navigation.navigate(`/accounting/order-form/exceptions/${articleGroupID ? articleGroupID : count?.id}`, {
      state: {count, isProFormaInvoice},
    });
    breadcrumbs.add({
      name: `Novo izuzeće - ${articlegGroupName}`,
      to: `/accounting/order-form/exceptions/${articleGroupID ? articleGroupID : count?.id}`,
    });
  };

  useEffect(() => {
    setValue('article_group', {id: null, title: ''});
    setValue('counts', {id: null, title: ''});
  }, [watch('is_pro_forma_invoice')?.id]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      buttonLoading={isSaving}
      customButtonsControls={
        <ButtonWrapper>
          <Button variant="secondary" content="Otkaži" onClick={onClose} style={{marginRight: 10}} />
          <Button
            variant="primary"
            disabled={
              (isProFormaInvoice && count.id === null) ||
              (!isProFormaInvoice && (count.id === null || articleGroupID === 0))
            }
            onClick={handleSubmit(onSubmit)}
            content="Nastavi"
          />
        </ButtonWrapper>
      }
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="is_pro_forma_invoice"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown onChange={onChange} value={value} name={name} label="TIP:" options={TypeOptions} isRequired />
              )}
            />
          </Row>
          <Row>
            <Controller
              name="article_group"
              rules={{
                required: watch('is_pro_forma_invoice')?.id === false ? 'Ovo polje je obavezno.' : false,
              }}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="GRUPA ARTIKALA:"
                  options={articleGroup}
                  isRequired={watch('is_pro_forma_invoice')?.id === false}
                />
              )}
            />
          </Row>
          <Controller
            name="counts"
            rules={{
              required: 'Ovo polje je obavezno.',
            }}
            control={control}
            render={({field: {onChange, name, value}}) => (
              <Dropdown
                onChange={onChange}
                value={value}
                name={name}
                label="KONTO:"
                options={dropdowncountsOptions}
                isRequired
              />
            )}
          />
        </FormWrapper>
      }
      title="IZUZEĆE OD PLANA"
    />
  );
};
