export interface IPost {
    author: string;
    body: string;
    category: string;
    commentCount: number;
    deleted: boolean;
    id: string;
    timestamp: number;
    title: string;
    voteScore: number;
}

export interface IComment {
    author: string;
    body: string;
    deleted: boolean;
    id: string;
    parentDeleted: boolean;
    parentId: string;
    timestamp: number;
    voteScore: number;
}

export interface ICategory {
    name: string;
    path: string;
}

export enum PageType {
    LISTED_POST = 'LISTED_POST',
    POST = 'POST',
    COMMENT = 'COMMENT'

}