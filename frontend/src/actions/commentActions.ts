import * as API from '../api/api';

export const APIDeleteComment = (ID) => {
    return (dispatch) => {
        API.deleteComment(ID);
    };
};
