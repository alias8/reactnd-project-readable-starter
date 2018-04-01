import { ICategory, IPost } from '../types/types';
import { Reducer } from 'redux';
import { CHANGE_EDITED_ID, CHANGE_EDITED_TITLE, IAction, UPDATE_CATEGORIES } from '../actions/actions';

export type EditState = {
    beingEditedID: string;
    beingEditedTitle: string;
};

const initialState: EditState = {
    beingEditedID: '',
    beingEditedTitle: ''
};

const reducer: Reducer<EditState> = (state = initialState, action: IAction) => {
    switch (action.type) {
        case CHANGE_EDITED_ID:
            return {
                ...state,
                beingEditedID: action.editedID
            };
        case CHANGE_EDITED_TITLE:
            return {
                ...state,
                beingEditedTitle: action.editedTitle
            };
        default:
            return state;
    }
};

export default reducer;
