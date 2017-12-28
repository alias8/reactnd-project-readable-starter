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

export function fetchPosts() {
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

export function getCommentsForPost(id) {
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

export function postCommentToPost(id, author, body, parentId) {
    return new Promise((resolve, reject) => {
        const body = {
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
                body: body,
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