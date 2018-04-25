import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/TopReducer';
import { IPost, TemplateType } from '../types/types';
import '../styles/App.scss';
import { default as PostOrCommentCollection } from './PostOrCommentCollection';

interface IMappedProps {
	posts: IPost[];
	wrongRoute: boolean;
}

interface ICategoryPageUrl {
	category: string;
}

type IProps = IMappedProps & RouteComponentProps<ICategoryPageUrl>;

export const Category: React.SFC<IProps> = (props) => {
	return props.wrongRoute ? (
		<Redirect to={'/404'}/>
	) : (
		<PostOrCommentCollection
			pageType={TemplateType.LIST_OF_POSTS}
			listOfPosts={props.posts}
		/>
	);
};

const mapStateToProps: MapStateToProps<IMappedProps, {}, RootState> = (state: RootState, props: IProps) => {
	const wrongRoute = state.categories.fetching
		? false
		: !state.categories.categories
			.map((category) => category.name)
			.includes(props.match.params.category);
	return {
		posts: state.posts.posts.filter(post => post.category === props.match.params.category),
		wrongRoute
	};
};

export default withRouter<any>(connect(mapStateToProps)(Category));
