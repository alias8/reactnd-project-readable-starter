import { ICategory, IPost } from '../types/types';
import { Reducer } from 'redux';
import { CHANGE_EDITED, IAction, UPDATE_CATEGORIES } from '../actions/actions';

export type EditState = {
    beingEdited: string;
};

const initialState: EditState = {
    beingEdited: ''
};

const reducer: Reducer<EditState> = (state = initialState, action: IAction) => {
    switch (action.type) {
        case CHANGE_EDITED:
            return {
                ...state,
                beingEdited: action.editedID
            };
        default:
            return state;
    }
};

export default reducer;
