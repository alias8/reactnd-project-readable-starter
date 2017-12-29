import { IComment, IPost } from "./types";

const api = 'http://localhost:3001';
const header = {
    Accept: 'application/json',
    Authorization: 'jameskirk75701',
    'Content-Type': 'application/json',
};

export function fetchCategories() {
    return new Promise((resolve, reject) => {
        fetch(`${api}/categories`,
            {
                method: 'GET',
                headers: header
            })
            .then(result => result.json())
            .then(data => resolve(data.categories))
            .catch(error => reject(error))
    });
}

export function fetchPosts(): Promise<IPost[]> {
    return new Promise((resolve, reject) => {
        fetch(`${api}/posts`,
            {
                method: 'GET',
                headers: header
            })
            .then(result => result.json())
            .then(data => resolve(data))
            .catch(error => reject(error))
    });
}

export function getCommentsForPost(id: string): Promise<IComment> {
    return new Promise((resolve, reject) => {
        fetch(`${api}/posts/${id}/comments`,
            {
                method: 'GET',
                headers: header
            })
            .then(result => result.json())
            .then(data => resolve(data))
            .catch(error => reject(error))
    });
}

export function postCommentToPost(id: string, author: string, body: string, parentId: string) {
    return new Promise((resolve, reject) => {
        const bodyParam = {
            id,
            author,
            body,
            parentId,
            timestamp: Date.now()
        };
        fetch(`${api}/comments`,
            {
                method: 'POST',
                headers: header,
                body: bodyParam,
            })
            .then(result => result.json())
            .then(data => resolve(data))
            .catch(error => reject(error))
    });
}


// const fetchCategoriesAPI = async () => {
//     try {
//         const response = await fetch(`${api}/categories`, {
//             method: 'GET',
//             headers: header
//         });
//         return await response.json();
//     } catch (e) {
//         return e;
//     }
// };
//
// const fetchAllPostsAPI = async () => {
//     try {
//         const response = await fetch(`${api}/posts`, {
//             method: 'GET',
//             headers: header
//         });
//         return await response.json();
//     } catch (e) {
//         return e;
//     }
// };