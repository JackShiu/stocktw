
import { combineReducers } from 'redux';


function filters(state = {}, action) {
    switch (action.type) {
      case "ACTION_SEARCH":
        {
            return Object.assign({},state,{
                search: action.payload.data
                    .trim()
                    .replace(/\s +/g, ",")
                    .split(',')
            })
        }
        case "ACTION_SEARCH_CANCEL":
        {
            return Object.assign({},state,{
                search: []
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