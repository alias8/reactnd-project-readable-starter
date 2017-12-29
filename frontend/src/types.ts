export interface IPost {
    author: string,
    body: string,
    category: string,
    commentCount: number,
    deleted: boolean,
    id: string,
    timestamp: number,
    title: string,
    voteScore: number
}

export interface IComment {
    author: string,
    body: string,
    deleted: boolean,
    id: string,
    parentDeleted: boolean,
    parentId: string,
    timestamp: number,
    voteScore: number
}