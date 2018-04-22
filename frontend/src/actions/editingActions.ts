import { CHANGE_EDITED_ID } from './actionTypes';

export const changeEditedID = (id: string) => ({
    type: CHANGE_EDITED_ID,
    editedID: id
});
