export function getPosts(posts) {
    return {
        type: 'GET_POSTS',
        posts: posts

    }
}

export interface IAction {
    type: string;
    [propName: string]: any;
}