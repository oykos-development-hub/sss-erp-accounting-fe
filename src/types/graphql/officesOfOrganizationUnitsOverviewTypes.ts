import {ReactNode} from 'react';

export interface OfficesOfOrganizationUnits {
  id: number;
  title: string;
  organization_unit: {
    id: number;
    title: string;
  };
  abbreviation: string;
  description: string;
  color: string;
  icon: ReactNode;
}

export interface OfficesOfOrganizationUnitsOverviewResponse {
  data: {
    officesOfOrganizationUnits_Overview: {
      status?: string;
      message?: string;
      total?: string;
      items?: OfficesOfOrganizationUnits[];
    };
  };
}
