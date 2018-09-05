

export const onSearch = (data) => (
    { type: 'ACTION_SEARCH', payload:{data} }
)

export const onSearchCancel = () => (
    { type: 'ACTION_SEARCH_CANCEL'}
)

// export const onItemDel = (id: number) => ({type:'DEL_ITEM', id});
export const onItemDel = (id) => ({type:'DEL_ITEM', id});



