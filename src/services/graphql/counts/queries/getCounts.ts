const getCounts = `query AccountOverview($id: Int, $tree: Boolean, $search: String, $page: Int, $level: Int,$size: Int) {
    account_Overview(id: $id, tree: $tree, search: $search, page: $page, size: $size, level: $level) {
        status
        message
        total
        items {
            id
            parent_id
            title
            serial_number
            children {
                id
                parent_id
                title
                serial_number
                children {
                    id
                    parent_id
                    title
                    serial_number
                    children {
                        id
                        parent_id
                        title
                        serial_number
                        children {
                            id
                            parent_id
                            title
                            serial_number
                            children {
                                id
                                parent_id
                                title
                                serial_number
                                children {
                                    id
                                    parent_id
                                    title
                                    serial_number
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export default getCounts;
