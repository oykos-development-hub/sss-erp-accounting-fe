const getSettings = `query SettingsDropdownOverview($search: String, $id: Int, $entity: String!, $page: Int, $size: Int) {
        settingsDropdown_Overview(search: $search, page: $page, size: $size, id: $id, entity: $entity) {
            status 
            message
            total
            items {
                id
                title
                entity
                value
                description
                abbreviation
                color
                icon
            }
        }
    }`;

export default getSettings;
