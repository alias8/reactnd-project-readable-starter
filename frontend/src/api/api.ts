import { ICategory, IComment, IPost } from '../types/types';
import uuid from 'uuid/v4.js';

const api = 'http://localhost:3001';
const header = {
    Accept: 'application/json',
    Authorization: 'jameskirk75701',
    'Content-Type': 'application/json',
};

//     GET /categories
// USAGE:
//     Get all of the categories available for the app. List is found in categories.js.
//     Feel free to extend this list as you desire.
export function fetchCategories(): Promise<ICategory[]> {
    return fetch(`${api}/categories`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data.categories)
        .catch(error => error);
}

// GET /posts
// USAGE:
//     Get all of the posts. Useful for the main page when no category is selected.
export function fetchPosts(): Promise<IPost[]> {
    return fetch(`${api}/posts`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

//     GET /posts/:id/comments
// USAGE:
//     Get all the comments for a single post
export function getCommentsForPost(id: string): Promise<IComment[]> {
    return fetch(`${api}/posts/${id}/comments`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

// POST /comments
// USAGE:
//     Add a comment to a post
//
// PARAMS:
//     id: Any unique ID. As with posts, UUID is probably the best here.
//     timestamp: timestamp. Get this however you want.
//     body: String
// author: String
// parentId: Should match a post id in the database.
export function postCommentToPost(author: string, body: string, parentId: string): Promise<IComment> {
    return fetch(`${api}/comments`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            id: uuid(),
            timestamp: Date.now(),
            body,
            author,
            parentId
        })
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

//     POST /posts
// USAGE:
//     Add a new post
// PARAMS:
//     id - UUID should be fine, but any unique id will work
// timestamp - timestamp in whatever format you like, you can use Date.now() if you like
// title - String
// body - String
// author - String
// category: Any of the categories listed in categories.js. Feel free to extend this list as you desire.
export function addNewPost(title: string, body: string, author: string, category: string): Promise<IComment> {
    return fetch(`${api}/posts`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            id: uuid(),
            timestamp: Date.now(),
            title,
            body,
            author,
            category
        })
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}


//
//     GET /:category/posts
// USAGE:
//     Get all of the posts for a particular category
//

//

//

//
//     GET /posts/:id
// USAGE:
//     Get the details of a single post
//
// POST /posts/:id
// USAGE:
//     Used for voting on a post
// PARAMS:
//     option - String: Either "upVote" or "downVote"
//
// PUT /posts/:id
// USAGE:
//     Edit the details of an existing post
// PARAMS:
//     title - String
// body - String
//
// DELETE /posts/:id
// USAGE:
//     Sets the deleted flag for a post to 'true'.
//     Sets the parentDeleted flag for all child comments to 'true'.
//

//

//
//     GET /comments/:id
// USAGE:
//     Get the details for a single comment
//
// POST /comments/:id
// USAGE:
//     Used for voting on a comment.
//
//     PUT /comments/:id
// USAGE:
//     Edit the details of an existing comment
//
// PARAMS:
//     timestamp: timestamp. Get this however you want.
//     body: String
//
// DELETE /comments/:id
// USAGE:
//     Sets a comment's deleted flag to 'true'
