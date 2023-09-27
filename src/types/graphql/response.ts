export type GetResponse<T> = {
  status: string;
  message: string;
  total?: number;
  items: T[];
};

export type DetailsResponse<T> = {
  status: string;
  message: string;
  item: T;
};

export type DeleteResponse = {
  status: string;
  message: string;
};
