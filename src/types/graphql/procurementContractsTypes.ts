import {DropdownDataNumber} from '../dropdownData';
import {Response, SingularResponse} from './utils';

export type FileItem = {id: number; name: string; type: string};

export interface ProcurementContract {
  id: number;
  public_procurement: DropdownDataNumber;
  supplier: DropdownDataNumber;
  serial_number: string;
  date_of_signing: string;
  date_of_expiry: string;
  net_value: string;
  gross_value: string;
  created_at: string;
  updated_at: string;
  file: FileItem[];
  vat_value: string;
}

export interface ProcurementContractInsert {
  id: number;
  public_procurement_id: number;
  supplier_id: number;
  serial_number: string;
  date_of_signing: string;
  date_of_expiry: string;
  net_value: string;
  gross_value: string;
  file?: number[];
  vat_value?: string;
}

export interface GetProcurementContractParams {
  id: number;
  supplier_id?: number;
  procurement_id?: number;
}

export interface ProcurementContractsGetResponse {
  publicProcurementContracts_Overview: Response<ProcurementContract>;
}

export interface ContractDeleteResponse {
  publicProcurementContracts_Delete: SingularResponse<null>;
}

export interface ProcurementContractsInsertResponse {
  publicProcurementContracts_Insert: SingularResponse<ProcurementContract>;
}
