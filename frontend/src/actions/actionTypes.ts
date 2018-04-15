export const CHANGE_EDITED_ID = 'CHANGE_EDITED_ID';
export const CHANGE_EDITED_TITLE = 'CHANGE_EDITED_TITLE';

export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';

export const UPDATE_POSTS = 'UPDATE_POSTS';
export const DELETE_POST = 'DELETE_POST';
export const VOTE_ON_POST = 'VOTE_ON_POST';
export const EDIT_ONE_POST = 'EDIT_ONE_POST';
export const ADD_ONE_POST = 'ADD_ONE_POST';

export interface IAction {
    type: string;
    [propName: string]: any;
}
