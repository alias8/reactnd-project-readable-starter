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

export enum TemplateType {
	LIST_OF_POSTS = 'LIST_OF_POSTS',
	SINGLE_POST = 'SINGLE_POST',
	LIST_OF_COMMENTS = 'LIST_OF_COMMENTS'
}

export const ShouldDisplayTopNav = {};
[TemplateType.LIST_OF_POSTS, TemplateType.SINGLE_POST].forEach((name) => {
	ShouldDisplayTopNav[name] = true;
});

export const ShouldDisplaySort = {};
[TemplateType.LIST_OF_POSTS, TemplateType.LIST_OF_COMMENTS].forEach((name) => {
	ShouldDisplaySort[name] = true;
});
