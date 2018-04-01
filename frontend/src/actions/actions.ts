import { IPost } from '../types/types';

export const UPDATE_POSTS = 'UPDATE_POSTS';
export const DELETE_POST = 'DELETE_POST';
export const VOTE_ON_POST = 'VOTE_ON_POST';
export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';
export const CHANGE_EDITED_ID = 'CHANGE_EDITED_ID';
export const CHANGE_EDITED_TITLE = 'CHANGE_EDITED_TITLE';
export const EDIT_ONE_POST = 'EDIT_ONE_POST';

export function updatePostsAction(posts: IPost[]) {
    return {
        type: UPDATE_POSTS,
        posts: posts

    };
}

export function deletePostAction(post: IPost) {
    return {
        type: DELETE_POST,
        post: post
    };
}

export function voteOnPostAction(post) {
    return {
        type: VOTE_ON_POST,
        post: post
    };
}

export function updateCategoriesAction(categories) {
    return {
        type: UPDATE_CATEGORIES,
        categories: categories

    };
}

export function changeEditedID(id: string) {
    return {
        type: CHANGE_EDITED_ID,
        editedID: id
    };
}

export function changeEditedTitle(title: string) {
    return {
        type: CHANGE_EDITED_TITLE,
        editedTitle: title
    };
}

export function editOnePost(post: IPost) {
    return {
        type: EDIT_ONE_POST,
        post: post
    };
}

export interface IAction {
    type: string;
    [propName: string]: any;
}
