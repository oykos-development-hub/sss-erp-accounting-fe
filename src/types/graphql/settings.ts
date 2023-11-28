import {DeleteResponse, GetResponse, InsertResponse} from './response';

export interface Settings {
  abbreviation: string;
  color: string;
  description: string;
  entity: string;
  icon: string;
  id: number;
  title: string;
  value: string;
}

export type SettingsGetParams = {
  page?: number;
  size?: number;
  id?: number;
  entity?: string;
};

export interface SettingsFormValues extends Omit<Settings, 'id'> {
  id: number | null;
}

export type SettingsResponse = {
  get: {
    settingsDropdown_Overview: GetResponse<Settings>;
  };
  insert: {
    settingsDropdown_Insert: InsertResponse<Settings>;
  };
  delete: {
    settingsDropdown_Delete: DeleteResponse;
  };
};
