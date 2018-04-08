import { IPost } from '../types/types';
import { Reducer } from 'redux';
import { ADD_ONE_POST, DELETE_POST, EDIT_ONE_POST, IAction, UPDATE_POSTS, VOTE_ON_POST } from '../actions/actions';

export type PostState = {
    posts: IPost[]
};

const initialState: PostState = {
    posts: []
};

const reducer: Reducer<PostState> = (state = initialState, action: IAction) => {
    switch (action.type) {
        case UPDATE_POSTS:
            return {
                ...state,
                posts: action.posts
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.post.id)
            };
        case VOTE_ON_POST:
            return {
                ...state,
                posts: state.posts.map(post => post.id === action.post.id ? action.post : post)
            };
        case EDIT_ONE_POST:
            const newPostList =  state.posts.filter(post => post.id !== action.post.id);
            newPostList.push(action.post);
            return {
                ...state,
                posts: newPostList
            };
        case ADD_ONE_POST:
            const newPostList1 =  state.posts.filter(post => post.id !== action.post.id);
            newPostList1.push(action.post);
            return {
                ...state,
                posts: newPostList1
            };

        default:
            return state;
    }
};

export default reducer;
