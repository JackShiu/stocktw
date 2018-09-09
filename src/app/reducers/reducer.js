
import { combineReducers } from 'redux';


function filters(state = {}, action) {
    switch (action.type) {
      case "ACTION_SEARCH":
        {
            let searchValue = action.payload.data
                .trim()
                // .replace(/\s +/g, ",")
                .replace(/\s/g, ",")
                .split(',')
            return Object.assign({},state,{
                search: searchValue,
                isSearch: searchValue.length > 0
            })
        }
        case "ACTION_SEARCH_CANCEL":
        {
            return Object.assign({},state,{
                search: [],
                isSearch: false
            })
        }
      default:
            return state;
    }
}

function selectList(state = { listId: [5392], listName: ['應華']}, action) {
    switch (action.type) {
        case "ADD_TO_LIST": {
            console.log(state);
            if (state.listId.indexOf(action.payload.id) ===-1){
                return Object.assign({}, state, {
                    listId: [action.payload.id, ...state.listId],
                    listName: [action.payload.name, ...state.listName]
                });
            } else {
                return state;
            }
        }
        case "DEL_FROM_LIST": {
            console.log(state);
            let index = state.listId.indexOf(action.payload.id)
            console.log(index)
            if (index !== -1) {
                state.listId.splice(index,1);
                state.listName.splice(index, 1);
                return Object.assign({}, state, {
                    listId: [...state.listId],
                    listName: [ ...state.listName]
                });
            } else {
                return state;
            }
        }
        case "SHOW_BY_SELECTOR": {
        }
      default:
        return state;
    }
}

const stockApp = combineReducers({
    filters,
    selectList
})

export default stockApp;