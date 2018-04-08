import { ICategory, IPost } from '../types/types';
import { Reducer } from 'redux';
import { IAction, UPDATE_CATEGORIES } from '../actions/actions';

export type CategoriesState = {
    categories: ICategory[]
};

const initialState: CategoriesState = {
    categories: []
};

const reducer: Reducer<CategoriesState> = (state = initialState, action: IAction) => {
    switch (action.type) {
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: action.categories
            };
        default:
            return state;
    }
};

export default reducer;
