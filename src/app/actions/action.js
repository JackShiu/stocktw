

export const onSearch = (data) => (
    { type: 'ACTION_SEARCH', payload:{data} }
)

export const onSearchCancel = () => (
    { type: 'ACTION_SEARCH_CANCEL'}
)

// export const onItemDel = (id: number) => ({type:'DEL_ITEM', id});
export const onItemDel = (id) => ({type:'DEL_ITEM', id});

export const onAddToList = (id, name) => ({ type: "ADD_TO_LIST", payload: { id, name } });
export const onDeleteFromList = (id) => ({ type: 'DEL_FROM_LIST', payload: { id } });
export const onShowBySelect = (id) => ({ type: 'SHOW_BY_SELECTOR', payload: { id } });
