import { PostState } from './Posts';
import { combineReducers, Reducer } from 'redux';
import posts from './Posts';
import categories, { CategoriesState } from './Categories'

export type RootState = {
    posts: PostState,
    categories: CategoriesState
};

const topLevelReducer: Reducer<RootState> = combineReducers<RootState>({
    posts: posts,
    categories: categories
});

export default topLevelReducer;
