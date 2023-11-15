import {Dropdown, Modal, FileUpload, Typography} from 'client-library';
import {useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useOrderListAssetMovementMutation from '../../services/graphql/movement/hooks/useOrderListAssetMovementMutation';
import useGetOfficesOfOrganizationUnits from '../../services/graphql/officesOfOrganisationUnit/hooks/useGetOfficeOfOrganizationUnits';
import useGetRecipientUsersOverview from '../../services/graphql/recipientUsersOverview/hooks/useGetRecipientUsers';
import {Row} from './styles';
import {AssetMovementModalProps} from './types';
import {FileUploadWrapper} from '../../screens/formOrder/styles';
import useAppContext from '../../context/useAppContext';
import {FileResponseItem} from '../../types/fileUploadType';

export const AssetMovementModal: React.FC<AssetMovementModalProps> = ({
  onClose,
  open,
  context,
  selectedItem,
  fetch,
}) => {
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

  const organisationUnitId = context?.contextMain?.organization_unit?.id;
  const {officesOfOrganizationUnits} = useGetOfficesOfOrganizationUnits(0, organisationUnitId, '');
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

  const {
    fileService: {uploadFile},
  } = useAppContext();

  const {handleSubmit, control, clearErrors, watch, setValue} = useForm();

  const movementFile = watch('movement_file');

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
    clearErrors('movement_file');
  };

  const handleAssetMovementInsert = (officeId: number, recipientId: number, movementFileId?: number) => {
    const payload = {
      order_id: selectedItem,
      office_id: officeId,
      recipient_user_id: recipientId,
      movement_file: movementFileId,
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

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(
        formData,
        (files: FileResponseItem[]) => {
          console.log(movementFile);
          setUploadedFile(null);
          setValue('movement_file', files[0]);

          handleAssetMovementInsert(values?.office?.id, values?.recipient?.id, files[0]?.id);
        },
        () => {
          context.alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );

      return;
    } else {
      handleAssetMovementInsert(values?.office?.id, values?.recipient?.id);
    }
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

          <FileUploadWrapper>
            <FileUpload
              icon={null}
              files={uploadedFile}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Otpremnica" />}
              hint="Fajlovi neće biti učitani dok ne sačuvate otpremnicu."
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </div>
      }
    />
  );
};
