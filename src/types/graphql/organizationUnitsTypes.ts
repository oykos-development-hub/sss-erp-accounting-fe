import {Response} from './utils';

export interface OrganizationUnit {
  id: number;
  parent_id?: number;
  number_of_judges?: number;
  title?: string;
  abbreviation?: string;
  description?: string;
  address?: string;
  color?: string;
  folder_id?: number;
  icon?: string;
}

export interface OrganizationUnitsResponse {
  organizationUnits: Response<OrganizationUnit>;
}

export interface OrganizationUnitInsertResponse {
  data: {
    organizationUnits_Insert: {
      status?: string;
      message?: string;
      item?: OrganizationUnit;
    };
  };
}

export interface OrganizationUnitDeleteResponse {
  data: {
    organizationUnits_Delete: {
      status?: string;
      message?: string;
    };
  };
}
