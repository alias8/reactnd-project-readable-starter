export const UPDATE_POSTS = 'UPDATE_POSTS'
export const DELETE_POST = 'DELETE_POST';
export const VOTE_ON_POST = 'VOTE_ON_POST';
export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES'


export function updatePostsAction(posts) {
    return {
        type: UPDATE_POSTS,
        posts: posts

    };
}

export function deletePostAction(post) {
    return {
        type: DELETE_POST,
        post: post

    };
}

export function voteOnPostAction(post) {
    return {
        type: VOTE_ON_POST,
        post: post
    }
}

export function updateCategoriesAction(categories) {
    return {
        type: UPDATE_CATEGORIES,
        categories: categories

    };
}

export interface IAction {
    type: string;
    [propName: string]: any;
}
