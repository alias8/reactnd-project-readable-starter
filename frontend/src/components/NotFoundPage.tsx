import * as React from 'react';
import '../styles/App.scss';
import { Link } from "react-router-dom";
import { TemplateType } from "../types/types";
import TopNav from "./TopNav";

export const NotFoundPage = () => (
	<div>
		<TopNav
			pageType={TemplateType.LIST_OF_POSTS}
		/>
		<div className={'top-buffer'}/>
		<hr className={'thick-hr'}/>
		<div>Page not found</div>
		<Link to={`/`}>Return to home page</Link>
	</div>
);
