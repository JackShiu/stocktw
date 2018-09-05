
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


const stockApp = combineReducers({
    filters,
})

export default stockApp;