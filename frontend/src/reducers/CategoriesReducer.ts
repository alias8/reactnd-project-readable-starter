import { ICategory } from '../types/types';
import { Reducer } from 'redux';
import {
	COMPLETE_FETCH_CATEGORIES,
	IAction,
	IN_PROGRESS_FETCH_CATEGORIES,
	UPDATE_CATEGORIES
} from '../actions/actionTypes';

export type CategoriesState = {
	categories: ICategory[],
	fetching: boolean
};

const initialState: CategoriesState = {
	categories: [],
	fetching: false
};

const reducer: Reducer<CategoriesState> = (state = initialState, action: IAction) => {
	switch (action.type) {
		case UPDATE_CATEGORIES:
			return {
				...state,
				categories: action.categories
			};
		case IN_PROGRESS_FETCH_CATEGORIES:
			return {
				...state,
				fetching: true
			};
		case COMPLETE_FETCH_CATEGORIES:
			return {
				...state,
				fetching: false
			};
		default:
			return state;
	}
};

export default reducer;
