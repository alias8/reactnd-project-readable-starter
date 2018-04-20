import { IPost } from '../types/types';
import { ADD_ONE_POST, COMPLETE_FETCH_POSTS, DELETE_POST, EDIT_ONE_POST, IN_PROGRESS_FETCH_POSTS, UPDATE_POSTS, VOTE_ON_POST } from './actionTypes';
import * as API from '../api/api';

export const addOnePostAction = (post: IPost) => ({
    type: ADD_ONE_POST,
    post: post
});

export const deletePostAction = (post: IPost) => ({
    type: DELETE_POST,
    post: post
});

export const voteOnPostAction = (post: IPost) => ({
    type: VOTE_ON_POST,
    post: post
});

export const updatePostsAction = (posts: IPost[]) => ({
    type: UPDATE_POSTS,
    posts: posts
});

export const editOnePost = (post: IPost) => ({
    type: EDIT_ONE_POST,
    post: post
});

const fetchingPostsInProgress = () => ({
	type: IN_PROGRESS_FETCH_POSTS
});

const fetchingPostsComplete = () => ({
	type: COMPLETE_FETCH_POSTS
});

export const APIAddNewPost = (title, text, author, chosenCategory) => {
    return (dispatch) => {
		return API.addNewPost(title, text, author, chosenCategory)
			.then((result: IPost) => {
				dispatch(addOnePostAction(result));
			});
	};
};

export const APIVoteOnPost = (ID, action) => {
    return (dispatch) => {
        API.voteOnPost(ID, action)
            .then((result) => {
                dispatch(voteOnPostAction(result));
            });
    };
};

export const APIEditDetailsOfExistingPost = (ID, title, body) => {
    return (dispatch) => {
        API.editDetailsOfExistingPost(ID, title, body)
            .then((result: IPost) => {
                dispatch(editOnePost(result));
            });
    };
};

export const APIDeletePost = (ID) => {
    return (dispatch) => {
        API.deletePost(ID)
            .then((result: IPost) => {
                dispatch(deletePostAction(result));
            });
    };
};

export const APIFetchPosts = () => {
    return (dispatch) => {
    	dispatch(fetchingPostsInProgress());
        API.fetchPosts()
            .then(result => {
                dispatch(updatePostsAction(result));
                dispatch(fetchingPostsComplete());
            })
			.catch((result) => {
        		dispatch(fetchingPostsComplete());
			})
    }
};
