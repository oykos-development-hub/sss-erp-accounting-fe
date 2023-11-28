import {Button, Dropdown, Modal} from 'client-library';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useOrderListInsert from '../../services/graphql/orders/hooks/useInsertOrderList';
import useGetSettings from '../../services/graphql/settings/useGetSettings';
import {AccountingOrderModalProps} from '../accountingOrderModal/types';
import {ButtonWrapper, FormWrapper, Row} from './styles';

const initialValues = {
  id: 0,
  article_group: {id: 0, title: ''},
};

export const ExceptionModal: React.FC<AccountingOrderModalProps> = ({open, onClose, navigate}) => {
  const {breadcrumbs} = useAppContext();
  const {options: articleGroup} = useGetSettings({entity: 'article_group'});
  const {loading: isSaving} = useOrderListInsert();
  const {handleSubmit, watch, control} = useForm({defaultValues: initialValues});
  const articlegGroupName = watch('article_group')?.title;
  const articleGroupID = watch('article_group')?.id;

  const onSubmit = async () => {
    navigate(`/accounting/order-form/exceptions/${articleGroupID}`);
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
                  onChange={onChange as any}
                  value={value as any}
                  name={name}
                  label="GRUPA ARTIKALA:"
                  options={articleGroup as any}
                />
              )}
            />
          </Row>
        </FormWrapper>
      }
      title="KREIRANJE NOVE NARUDŽBENICE"
    />
  );
};
