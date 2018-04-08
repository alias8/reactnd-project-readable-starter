import { createStore } from 'redux';
import topLevelReducer from '../reducers/TopReducer';

const store =  createStore(
    topLevelReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
export default store;
