import {Dropdown, Modal, FileUpload, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {EditMovementModalProps} from './types';
import {FormWrapper} from '../accountingOrderModal/styles';
import useGetMovementDetails from '../../services/graphql/movement/hooks/useGetMovementDetails';
import useInsertMovement from '../../services/graphql/movement/hooks/useInsertMovement';
import FileList from '../fileList/fileList';
import {FileUploadWrapper} from '../../screens/formOrder/styles';
import {FileResponseItem} from '../../types/fileUploadType';
import useAppContext from '../../context/useAppContext';

const initialValues = {
  office: {id: 0, title: ''},
  date_order: '',
  recipient_user: {id: 0, title: ''},
  articles: [],
  file_id: 0,
};

export const EditMovementModal: React.FC<EditMovementModalProps> = ({
  open,
  onClose,
  alert,
  dropdownData,
  selectedItem,
}) => {
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

  const {
    fileService: {uploadFile},
  } = useAppContext();

  const {
    handleSubmit,
    control,
    formState: {errors},
    watch,
    reset,
    setValue,
  } = useForm();

  const {movementDetailsItems} = useGetMovementDetails(selectedItem?.id);
  const {mutate: insertMovement, loading: isSaving} = useInsertMovement();

  const handleReceiveListInsert = (
    id: number,
    office_id: number,
    recipient_user_id: number,
    date_order: string,
    fileId: number,
  ) => {
    const payload = {
      id: id,
      office_id: office_id,
      recipient_user_id: recipient_user_id,
      date_order: date_order,
      articles:
        movementDetailsItems?.articles && movementDetailsItems?.articles?.length > 0
          ? movementDetailsItems?.articles?.map((item: any) => ({article_id: item.id, quantity: item.quantity}))
          : [],
      file_id: fileId,
    };

    insertMovement(
      payload,
      () => {
        alert.success('Uspješno sačuvano.');
        onClose(true);
      },
      () => {
        alert?.error('Greška. Promjene nisu sačuvane.');
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
          setUploadedFile(null);
          setValue('file_id', files[0]);
          handleReceiveListInsert(
            values.id,
            values?.office?.id,
            values?.recipient_user?.id,
            values?.date_order,
            files[0]?.id,
          );
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );

      return;
    } else {
      handleReceiveListInsert(
        values.id,
        values?.office?.id,
        values?.recipient_user?.id,
        values?.date_order,
        movementDetailsItems?.file?.id || 0,
      );
    }
  };

  useEffect(() => {
    if (selectedItem) {
      reset(selectedItem);
    }
  }, [selectedItem]);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
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
          <Controller
            name="recipient_user"
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {onChange, name, value}}) => (
              <Dropdown
                onChange={onChange as any}
                value={value as any}
                name={name}
                label="PRIMALAC:"
                options={dropdownData.users}
                error={errors.recipient_user?.message as string}
              />
            )}
          />
          <Controller
            name="office"
            control={control}
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {onChange, name, value}}) => (
              <Dropdown
                onChange={onChange as any}
                value={value as any}
                name={name}
                label="KANCELARIJA:"
                options={dropdownData.offices}
                error={errors.office?.message as string}
              />
            )}
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
          {movementDetailsItems?.file.id !== 0 && (
            <FileList files={movementDetailsItems?.file ? [movementDetailsItems?.file] : []} />
          )}
        </FormWrapper>
      }
      title="IZMIJENI OTPREMNICU"
    />
  );
};
