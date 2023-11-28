import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {Settings, SettingsGetParams, SettingsResponse} from '../../../types/graphql/settings';
import {REQUEST_STATUSES} from '../../constants';

const useGetSettings = ({entity, page, size, id}: SettingsGetParams) => {
  const [settingsData, setSettingsData] = useState<Settings[]>([]);
  const [options, setOptions] = useState<DropdownDataNumber[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch, graphQl} = useAppContext();

  const fetchSettings = async () => {
    setLoading(true);

    const response: SettingsResponse['get'] = await fetch(graphQl.getSettings, {
      entity: entity,
      page: page,
      size: size,
      id: id,
    });

    if (response.settingsDropdown_Overview?.status === REQUEST_STATUSES.success) {
      const items = response.settingsDropdown_Overview.items ?? [];

      if (!items.length) return;

      setSettingsData(items);
      setOptions(items?.map((item: Settings) => ({title: item.title, id: item.id})));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, [entity, id, page, size]);

  return {settingsData, loading, refetch: fetchSettings, options};
};

export default useGetSettings;
