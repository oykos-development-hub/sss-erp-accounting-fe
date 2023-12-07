import {Response} from './utils';

export interface Count {
  id: number;
  parent_id: number;
  title: string;
  serial_number: string;
  children?: Count[];
}

export interface CountResponse {
  account_Overview: Response<Count>;
}
