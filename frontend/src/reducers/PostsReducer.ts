import { IPost } from '../types/types';
import { Reducer } from 'redux';
import {
    ADD_ONE_POST,
    COMPLETE_FETCH_POSTS,
    DELETE_POST,
    EDIT_ONE_POST,
    IAction,
    IN_PROGRESS_FETCH_POSTS,
    UPDATE_POSTS,
    VOTE_ON_POST
} from '../actions/actionTypes';

export type PostState = {
    posts: IPost[]
    fetching: boolean;
};

const initialState: PostState = {
    posts: [],
    fetching: false
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
            const newPostList = state.posts.filter(post => post.id !== action.post.id);
            newPostList.push(action.post);
            return {
                ...state,
                posts: newPostList
            };
        case ADD_ONE_POST:
            const newPostList1 = state.posts.filter(post => post.id !== action.post.id);
            newPostList1.push(action.post);
            return {
                ...state,
                posts: newPostList1
            };
        case COMPLETE_FETCH_POSTS:
            return {
                ...state,
                fetching: false
            };
        case IN_PROGRESS_FETCH_POSTS:
            return {
                ...state,
                fetching: true
            };
        default:
            return state;
    }
};

export default reducer;
