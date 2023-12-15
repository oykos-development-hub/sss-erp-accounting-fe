import {Theme, Typography} from 'client-library';
import useAppContext from '../../context/useAppContext';
import {Controls, DeleteFileIcon, DownloadFileIcon, FileItem as File, FileIconButton, FileList as List} from './styles';
import FileModalView from '../fileModalView/fileModalView';
import {useState} from 'react';
import {FileItem} from '../../types/fileUploadType';

const allowedTypes = ['.pdf', '.jpg', '.png'];

type FileListProps = {
  files: FileItem[] | null;
  // Delete will be done in the component. It needs to happen after saving the contract,
  // because it is more important to delete it from the contract than it is from the server.
  // Once the contract is saved, it can be deleted from the server
  onDelete?: (id: number) => void;
  isInModal?: boolean;
};

const FileList = ({files, onDelete, isInModal}: FileListProps) => {
  const [fileToView, setFileToView] = useState<FileItem>();

  const {
    fileService: {downloadFile, deleteFile},
    alert,
  } = useAppContext();

  const handleDownload = async (file: FileItem) => {
    await downloadFile(file.id, {
      onSuccess: () => {
        alert.success(`Fajl ${file.name} uspješno preuzet`);
      },
      onError: () => {
        alert.error('Došlo je do greške prilikom preuzimanja fajla');
      },
      fileName: file.name,
    });
  };

  const handleViewFile = (file: FileItem) => {
    if (allowedTypes.includes(file.type)) {
      setFileToView(file);
    }
  };

  const toggleModal = () => {
    setFileToView(undefined);
  };

  return (
    <List>
      {files &&
        files.map((file: FileItem) => (
          <File
            key={file.id}
            onClick={() => {
              !isInModal && handleViewFile(file);
            }}
            viewable={allowedTypes.includes(file.type)}>
            <Typography content={file.name} style={{borderBottom: '1px solid black'}} />
            <Controls>
              {!isInModal && (
                <FileIconButton
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}>
                  <DownloadFileIcon stroke={Theme.palette.gray700} />
                </FileIconButton>
              )}
              {onDelete && (
                <FileIconButton
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(file.id);
                  }}>
                  <DeleteFileIcon stroke={Theme.palette.gray700} />
                </FileIconButton>
              )}
            </Controls>
          </File>
        ))}

      {fileToView && <FileModalView file={fileToView} onClose={toggleModal} />}
    </List>
  );
};

export default FileList;
