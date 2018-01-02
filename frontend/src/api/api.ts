import { ICategory, IComment, IPost } from '../types/types';
import uuid from 'uuid/v4.js';

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
