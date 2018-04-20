import * as React from 'react';
import { TemplateType } from "../types/types";
import { Link } from "react-router-dom";

interface IOwnProps {
	pageType: TemplateType
}

type IProps = IOwnProps;

export const AddNewPost: React.SFC<IProps> = (props) => {
	return props.pageType !== TemplateType.LIST_OF_COMMENTS ? (
		<div className={'add-new-post'}>
			<Link to={`/new`}>
				Submit new post
			</Link>
		</div>
		) : (
			<div/>
	)
}