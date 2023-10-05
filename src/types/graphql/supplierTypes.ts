import {GetResponse} from './response';

export interface Supplier {
  id: number | null;
  title?: string;
  abbreviation?: string;
  description?: string;
  address?: string;
  official_id?: number;
  folder_id?: number;
}

export interface GetSupplierParams {
  id: number;
  search?: string | null;
  page: number;
  size: number;
}

export interface SuppliersResponse {
  get: {
    suppliers_Overview: GetResponse<Supplier>;
  };
}
