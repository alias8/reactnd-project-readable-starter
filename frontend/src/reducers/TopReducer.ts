import posts, { PostState } from './PostsReducer';
import { combineReducers, Reducer } from 'redux';
import categories, { CategoriesState } from './CategoriesReducer';
import editing, { EditState } from './EditingReducer';

export type RootState = {
    posts: PostState,
    categories: CategoriesState
    beingEdited: EditState
};

const topLevelReducer: Reducer<RootState> = combineReducers<RootState>({
    posts: posts,
    categories: categories,
    beingEdited: editing
});

export default topLevelReducer;
