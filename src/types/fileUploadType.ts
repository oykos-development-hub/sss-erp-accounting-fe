export type FileItem = {id: number; name: string; type: string};

export type FileResponseItem = {
  id: number;
  parent_id: number;
  name: string;
  description: string;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
};
