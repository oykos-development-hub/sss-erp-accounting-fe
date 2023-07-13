export interface Supplier {
  id: number;
  title?: string;
  abbreviation?: string;
  description?: string;
  address?: string;
  official_id?: number;
  folder_id?: number;
}

export interface GetSupplier {
  id: number;
  search?: string;
}

export interface SuppliersOverviewResponse {
  data: {
    suppliers_Overview: {
      status?: string;
      message?: string;
      total?: string;
      items?: Supplier[];
    };
  };
}

export interface SupplierInsertResponse {
  data: {
    suppliers_Insert: {
      status?: string;
      message?: string;
      total?: string;
      item?: Supplier;
    };
  };
}
