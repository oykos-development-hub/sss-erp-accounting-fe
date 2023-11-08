import {Dropdown, Modal} from 'client-library';
import {useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useOrderListAssetMovementMutation from '../../services/graphql/movement/hooks/useOrderListAssetMovementMutation';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useGetRecipientUsersOverview from '../../services/graphql/recipientUsersOverview/hooks/useGetRecipientUsers';
import {Row} from './styles';
import {AssetMovementModalProps} from './types';

export const AssetMovementModal: React.FC<AssetMovementModalProps> = ({
  onClose,
  open,
  context,
  selectedItem,
  fetch,
}) => {
  const {control, handleSubmit} = useForm({});

  const {officesOfOrganizationUnits} = useGetOfficesOfOrganizationUnits();
  const {recipientUsers} = useGetRecipientUsersOverview();
  const {mutate: orderListAssetMovementMutation, loading: isSaving} = useOrderListAssetMovementMutation();

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

  const onSubmit = (values: any) => {
    if (isSaving) return;

    const payload = {
      order_id: selectedItem,
      office_id: values?.office?.id,
      recipient_user_id: values?.recipient?.id,
      movement_file: values?.movement_file?.id || null,
    };

    orderListAssetMovementMutation(
      payload,
      () => {
        onClose(true);
        fetch();
        context?.alert.success('Uspješno sačuvano.');
      },
      () => {
        onClose(false);
        context?.alert?.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      title="OTPREMNICA"
      leftButtonText="Otkaži"
      rightButtonText="Proslijedi"
      rightButtonOnClick={handleSubmit(onSubmit)}
      leftButtonOnClick={onClose}
      buttonLoading={isSaving}
      content={
        <div>
          <Row>
            <Controller
              name="office"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="LOKACIJA:"
                  options={officesDropdownData || []}
                />
              )}
            />
          </Row>

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
                />
              );
            }}
          />
        </div>
      }
    />
  );
};
