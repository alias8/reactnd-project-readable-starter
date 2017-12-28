import { createStore, combineReducers } from 'redux'
import { postReducer } from "./reducers";

const combinedReducers = combineReducers({
    posts: postReducer
});
const store =  createStore(combinedReducers);
export default store;