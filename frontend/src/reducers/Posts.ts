import { IPost } from '../types/types';
import { Reducer } from 'redux';
import { IAction } from '../actions/actions';

export type PostState = {
    posts: IPost[]
};

const initialState: PostState = {
    posts: []
};

const reducer: Reducer<PostState> = (state = initialState, action: IAction) => {
    switch (action.type) {
        case 'GET_POSTS':
            return {
                ...state,
                posts: action.posts
            };
        default:
            return state;
    }
};

export default reducer;
