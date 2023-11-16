import {REQUEST_STATUSES} from '../../services/constants';

export interface Response<T> {
  status: REQUEST_STATUSES;
  message: string;
  total?: number;
  items: T[];
}

export interface SingularResponse<T> {
  status: REQUEST_STATUSES;
  message: string;
  item: T;
}
