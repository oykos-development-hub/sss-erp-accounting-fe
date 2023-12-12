import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Dropdown, Input, SearchIcon, Theme} from 'client-library';
import {Wrapper} from './styles';
import {ContractFiltersProps} from '../types';
import {yearsForDropdown} from '../../../services/constants';
import {Supplier} from '../../../types/graphql/supplierTypes';

const initialValues = {
  supplier_id: {id: 0, title: 'Sve'},
  year: {id: null, title: 'Sve'},
};

export const ContractsFilters: React.FC<ContractFiltersProps> = ({
  setFilters,
  suppliers,
  setSearchQuery,
  searchQuery,
}) => {
  const {control, watch} = useForm({defaultValues: initialValues});
  const years = yearsForDropdown(7, true, 2);

  const suppliersOptions = useMemo(() => {
    const options = suppliers.map((supplier: Supplier) => ({
      id: supplier.id,
      title: supplier.title,
    }));
    options.unshift({id: null, title: 'Sve'});
    return options;
  }, [suppliers]);

  const supplier = watch('supplier_id');
  const year = watch('year');

  useEffect(() => {
    if (supplier || year) {
      setFilters({
        supplier_id: supplier?.id || initialValues.supplier_id.id,
        year: year?.id || initialValues.year.id,
      });
    }
  }, [supplier, year]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Wrapper>
      <Controller
        name="year"
        control={control}
        defaultValue={initialValues.year}
        render={({field: {onChange, name, value}}) => {
          return <Dropdown onChange={onChange} value={value} name={name} label="GODINA:" options={years || []} />;
        }}
      />
      <Controller
        name="supplier_id"
        control={control}
        defaultValue={initialValues.supplier_id}
        render={({field: {onChange, name, value}}) => {
          return (
            <Dropdown
              onChange={onChange}
              value={value as any}
              name={name}
              label="DOBAVLJAČ:"
              options={suppliersOptions as any}
            />
          );
        }}
      />

      <Input
        value={searchQuery}
        onChange={handleSearch}
        label="PRETRAGA:"
        rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray500} />}
        placeholder="UGOVOR, NABAVKA I DOBAVLJAČ"
      />
    </Wrapper>
  );
};
