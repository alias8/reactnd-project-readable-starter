import { deletePostAction } from './postActions';
import { IPost } from '../types/types';
import * as API from '../api/api';

export const APIDeleteComment = (ID) => {
    return (dispatch) => {
        API.deleteComment(ID);
    };
};
