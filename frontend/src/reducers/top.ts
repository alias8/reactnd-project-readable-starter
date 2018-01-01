import { PostState } from './Posts';
import { combineReducers, Reducer } from 'redux';
import posts from './Posts';

export type RootState = {
    posts: PostState
};

const topLevelReducer: Reducer<RootState> = combineReducers<RootState>({
    posts: posts
});

export default topLevelReducer;
