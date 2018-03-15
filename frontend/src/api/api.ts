import { ICategory, IComment, IPost } from '../types/types';
import * as uuid from 'uuid/v4.js';
import * as moment from 'moment';

const api = 'http://localhost:3001';
const header = {
    Accept: 'application/json',
    Authorization: 'jameskirk75701',
    'Content-Type': 'application/json',
};

export function fetchCategories(): Promise<ICategory[]> {
    return fetch(`${api}/categories`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data.categories)
        .catch(error => error);
}

export function fetchPosts(): Promise<IPost[]> {
    return fetch(`${api}/posts`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

export function getCommentsForPost(id: string): Promise<IComment[]> {
    return fetch(`${api}/posts/${id}/comments`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

export function postCommentToPost(author: string, body: string, parentId: string): Promise<IComment> {
    return fetch(`${api}/comments`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            id: uuid(),
            timestamp: moment().unix() * 1000,
            body,
            author,
            parentId
        })
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

export function addNewPost(title: string, body: string, author: string, category: string): Promise<IComment> {
    return fetch(`${api}/posts`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            id: uuid(),
            timestamp: moment().unix() * 1000,
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

export function getPostsForOneCategory(category: string): Promise<IPost[]> {
    return fetch(`${api}/${category}/posts`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

export function getDetailsForOnePost(id: string): Promise<IPost> {
    return fetch(`${api}/posts/${id}`, {
        method: 'GET',
        headers: header
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

//
// POST /posts/:id
// USAGE:
//     Used for voting on a post
// PARAMS:
//     option - String: Either "upVote" or "downVote"

export function voteOnPost(id: string, vote: string): Promise<IPost> {
    return fetch(`${api}/posts/${id}`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            option: vote,
        })
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}
//


export function editDetailsOfExistingPost(id: string, title: string, body: string): Promise<IPost> {
    return fetch(`${api}/posts/${id}`, {
        method: 'PUT',
        headers: header,
        body: JSON.stringify({
            title,
            body,
        })
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

export function deletePost(id: string): Promise<IPost> {
    return fetch(`${api}/posts/${id}`, {
        method: 'DELETE',
        headers: header,
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

//

//
//     GET /comments/:id
// USAGE:
//     Get the details for a single comment
//


export function voteOnComment(id: string, vote: string): Promise<IPost> {
    return fetch(`${api}/comments/${id}`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            option: vote,
        })
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}


export function editDetailsOfExistingComment(id: string, body: string): Promise<IComment> {
    return fetch(`${api}/comments/${id}`, {
        method: 'PUT',
        headers: header,
        body: JSON.stringify({
            timestamp: moment().unix() * 1000,
            body,
        })
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}

export function deleteComment(id: string): Promise<IPost> {
    return fetch(`${api}/comments/${id}`, {
        method: 'DELETE',
        headers: header,
    })
        .then(result => result.json())
        .then(data => data)
        .catch(error => error);
}
