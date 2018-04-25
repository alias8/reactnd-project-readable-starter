import { ICategory } from '../types/types';
import { COMPLETE_FETCH_CATEGORIES, IN_PROGRESS_FETCH_CATEGORIES, UPDATE_CATEGORIES } from './actionTypes';
import * as API from '../api/api';

export const updateCategoriesAction = (categories: ICategory[]) => ({
	type: UPDATE_CATEGORIES,
	categories: categories
});

const fetchingCategoriesInProgress = () => ({
	type: IN_PROGRESS_FETCH_CATEGORIES
});

const fetchingCategoriesComplete = () => ({
	type: COMPLETE_FETCH_CATEGORIES
});

export const APIFetchCategories = () => {
	return (dispatch) => {
		dispatch(fetchingCategoriesInProgress());
		API.fetchCategories()
			.then(result => {
				dispatch(updateCategoriesAction(result));
				dispatch(fetchingCategoriesComplete());
			})
			.catch((result) => {
				dispatch(fetchingCategoriesComplete());
			});
	};
};
