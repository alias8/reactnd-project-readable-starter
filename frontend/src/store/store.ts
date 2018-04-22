import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import topLevelReducer from '../reducers/TopReducer';

const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancer(applyMiddleware(thunk));

const store = createStore(topLevelReducer, enhancer);
export default store;
