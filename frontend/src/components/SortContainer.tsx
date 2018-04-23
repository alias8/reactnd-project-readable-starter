import * as React from 'react';
import { sortType } from './TemplateCollection';
import { ShouldDisplaySort, TemplateType } from '../types/types';

interface IOwnProps {
	updateSortMethod: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	sortMethod: sortType;
	pageType: TemplateType;
}

type IProps = IOwnProps;

export const SortContainer: React.SFC<IProps> = (props) => {
	return ShouldDisplaySort[props.pageType] ? (
		<div className={'sort-container'}>
			<div>Sort:</div>
			<select value={props.sortMethod} onChange={props.updateSortMethod}>
				<option value={sortType.VOTE_SCORE}>Score (highest first)</option>
				<option value={sortType.TIME_STAMP}>Time (newest first)</option>
			</select>
		</div>
	) : (
		<div/>
	);
};
