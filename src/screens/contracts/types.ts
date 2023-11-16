import {Supplier} from '../../types/graphql/supplierTypes';

export interface ContractFiltersProps {
  suppliers: Supplier[];
  setFilters: (filters: any) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}
