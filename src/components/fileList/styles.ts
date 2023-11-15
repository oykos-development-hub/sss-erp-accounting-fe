import styled, {css} from 'styled-components';
import {Theme, DownloadIcon, TrashIcon} from 'client-library';

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 400px;
  width: fit-content;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FileItem = styled.div<{viewable: boolean}>`
  display: flex;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: ${({viewable}) => (viewable ? 'pointer' : 'default')};
  transition: background-color 0.2s ease;
  width: 250px;
  &:hover {
    background-color: ${({viewable}) => (viewable ? Theme.palette.gray100 : 'none')};
  }
`;

export const FileIcon = css`
  width: 16px;
  height: 16px;
  margin-left: 10px;
`;

export const FileIconButton = styled.button`
  all: unset;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

export const DownloadFileIcon = styled(DownloadIcon)`
  ${FileIcon}
`;

export const DeleteFileIcon = styled(TrashIcon)`
  ${FileIcon}
`;
