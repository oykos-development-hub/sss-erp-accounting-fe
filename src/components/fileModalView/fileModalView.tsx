import {Modal} from 'client-library';
import useAppContext from '../../context/useAppContext';
import {useEffect, useState} from 'react';
import {FileItem} from '../../types/fileUploadType';

type FileModalViewProps = {
  onClose: () => void;
  file: FileItem;
};

const setMIMEType = (type: string) => {
  if (type === '.pdf') {
    return 'application/.pdf';
  } else {
    return `image/${type.substring(1)}`;
  }
};

const FileModalView = ({onClose, file}: FileModalViewProps) => {
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const {
    fileService: {getFileBinary},
  } = useAppContext();

  const fetchFile = async () => {
    const response = await getFileBinary(file.id);
    new Blob([response], {type: setMIMEType(file.type)});
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    setFileUrl(blobUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setFileUrl('');
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    if (file) {
      fetchFile();
    }

    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

  return (
    <Modal
      open={open && !!fileUrl}
      onClose={handleClose}
      customModalContent={<iframe src={fileUrl} width={'100%'} height={'100%'} style={{marginTop: 10}} />}
      style={{width: '80vw', height: '80vh'}}
    />
  );
};

export default FileModalView;
