import { PostState } from './Posts';
import { combineReducers, Reducer } from 'redux';
import posts from './Posts';
import categories, { CategoriesState } from './Categories';
import editing, { EditState } from './Editing';

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
