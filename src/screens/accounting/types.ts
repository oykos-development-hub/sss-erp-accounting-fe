import {MicroserviceProps} from '../../types/micro-service-props';
import {Supplier} from '../../types/graphql/supplierTypes';

export interface AccountingFiltersProps {
  context?: MicroserviceProps;
  suppliers: Supplier[];
  setFilters: (filters: any) => void;
  search: string;
}
