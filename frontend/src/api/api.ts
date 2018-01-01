import { ICategory, IComment, IPost } from '../types/types';
import uuid from 'uuid/v4.js';

const api = 'http://localhost:3001';
const header = {
    Accept: 'application/json',
    Authorization: 'jameskirk75701',
    'Content-Type': 'application/json',
};

export function fetchCategories(): Promise<ICategory[]> {
    return new Promise((resolve, reject) => {
        fetch(`${api}/categories`, {
                method: 'GET',
                headers: header
            })
            .then(result => result.json())
            .then(data => resolve(data.categories))
            .catch(error => reject(error));
    });
}

export function fetchPosts(): Promise<IPost[]> {
    return new Promise((resolve, reject) => {
        fetch(`${api}/posts`, {
                method: 'GET',
                headers: header
            })
            .then(result => result.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

export function getCommentsForPost(id: string): Promise<IComment[]> {
    return new Promise((resolve, reject) => {
        fetch(`${api}/posts/${id}/comments`, {
                method: 'GET',
                headers: header
            })
            .then(result => result.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

export function postCommentToPost(author: string, body: string, parentId: string): Promise<IComment> {
    return new Promise((resolve, reject) => {
        fetch(`${api}/comments`, {
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
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}
