import {ReactNode} from 'react';
import {GetResponse} from './response';

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
export interface OfficesOfOrganizationUnitsTypeResponse {
  get: {
    officesOfOrganizationUnits_Overview: GetResponse<OfficesOfOrganizationUnits>;
  };
}
