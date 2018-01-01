import { createStore } from 'redux';
import topLevelReducer from '../reducers/top';

const store =  createStore(topLevelReducer);
export default store;
