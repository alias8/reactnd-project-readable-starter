import { ICategory } from '../types/types';
import { UPDATE_CATEGORIES } from './actionTypes';
import { updatePostsAction } from './postActions';
import * as API from '../api/api';

export const updateCategoriesAction = (categories: ICategory[]) => ({
    type: UPDATE_CATEGORIES,
    categories: categories
});

export const APIFetchCategories = () => {
    return (dispatch) => {
        API.fetchCategories()
            .then(result => {
                dispatch(updateCategoriesAction(result));
            });
    };
};
