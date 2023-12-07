import {Button, Dropdown, Modal} from 'client-library';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import useGetSettings from '../../services/graphql/settings/useGetSettings';
import {AccountingOrderModalProps} from '../accountingOrderModal/types';
import {ButtonWrapper, FormWrapper, Row} from './styles';
import useGetCounts from '../../services/graphql/counts/hooks/useGetCounts';

const initialValues = {
  id: 0,
  article_group: {id: 0, title: ''},
  counts: {id: null, title: ''},
};

export const ExceptionModal: React.FC<AccountingOrderModalProps> = ({open, onClose}) => {
  const {breadcrumbs, navigation} = useAppContext();
  const {options: articleGroup} = useGetSettings({entity: 'article_group'});
  const {loading: isSaving} = useOrderListInsert();
  const {counts} = useGetCounts({level: 3});
  const {handleSubmit, watch, control} = useForm({defaultValues: initialValues});
  const articlegGroupName = watch('article_group')?.title;
  const articleGroupID = watch('article_group')?.id;
  const count = watch('counts').title;

  const dropdowncountsOptions = counts?.map(item => {
    return {
      title: item.serial_number,
      id: item.id,
    };
  });

  const onSubmit = async () => {
    navigation.navigate(`/accounting/order-form/exceptions/${articleGroupID}`, {state: {count}});
    breadcrumbs.add({
      name: `Novo izuzeće - ${articlegGroupName}`,
      to: `/accounting/order-form/exceptions/${articleGroupID}`,
    });
  };

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
            disabled={articleGroupID === 0}
            onClick={handleSubmit(onSubmit)}
            content="Nastavi"
          />
        </ButtonWrapper>
      }
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="article_group"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="GRUPA ARTIKALA:"
                  options={articleGroup}
                />
              )}
            />
          </Row>
          <Controller
            name="counts"
            control={control}
            render={({field: {onChange, name, value}}) => (
              <Dropdown onChange={onChange} value={value} name={name} label="KONTO:" options={dropdowncountsOptions} />
            )}
          />
        </FormWrapper>
      }
      title="IZUZEĆE OD PLANA"
    />
  );
};
