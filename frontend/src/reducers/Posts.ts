import { IPost } from '../types/types';
import { Reducer } from 'redux';
import { IAction } from '../actions/actions';
import { IModifiedPost } from '../components/App';

export type PostState = {
    posts: IModifiedPost[]
};

const initialState: PostState = {
    posts: []
};

const reducer: Reducer<PostState> = (state = initialState, action: IAction) => {
    switch (action.type) {
        case 'GET_POSTS':
            return {
                ...state,
                posts: addInfoToPosts(action.posts)
            };
        default:
            return state;
    }
};

const addInfoToPosts = (unmodifiedPosts: IPost[]): IModifiedPost[] => {
    return unmodifiedPosts.map((post, index) => {
        const url = post.title.replace(/ /g, '_');
        return {
            ...post,
            path: `/${post.category}/${url}`,
            index
        };
    });
};

export default reducer;
