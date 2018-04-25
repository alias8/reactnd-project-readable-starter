import * as React from 'react';
import { ICategory, IPost, TemplateType } from '../types/types';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/TopReducer';
import '../styles/App.scss';
import { default as PostOrCommentCollection } from './PostOrCommentCollection';

interface IState {
	sortMethod: string;
	originalParentPostId: string;
}

interface IMappedProps {
	originalParentPost: IPost[];
	categories: ICategory[];
	wrongRoute: boolean;
}

interface IPostPageUrl {
	category: string;
	id: string;
}

type IProps = IMappedProps & RouteComponentProps<IPostPageUrl>;

export class PostPage extends React.Component<IProps, IState> {
	private TIME_STAMP: string;
	private VOTE_SCORE: string;

	constructor(props: IProps) {
		super(props);
		this.VOTE_SCORE = 'VOTE_SCORE';
		this.TIME_STAMP = 'TIME_STAMP';
		this.state = {
			sortMethod: this.VOTE_SCORE,
			originalParentPostId: ''
		};
	}

	componentWillReceiveProps(nextProps: IProps) {
		if (nextProps.originalParentPost.length > 0) {
			this.setState({
				originalParentPostId: nextProps.originalParentPost[0].id
			});
		}
	}

	render() {
		return this.props.wrongRoute ? (
			<Redirect to={'/404'}/>
		) : (
			<div>
				<PostOrCommentCollection
					pageType={TemplateType.SINGLE_POST}
					listOfPosts={this.props.originalParentPost}
				/>
				<PostOrCommentCollection
					pageType={TemplateType.LIST_OF_COMMENTS}
					parentPostID={this.state.originalParentPostId}
					listOfPosts={[]}
				/>
			</div>
		);
	}
}

const mapStateToProps: MapStateToProps<IMappedProps, {}, RootState> = (state: RootState, props: IProps) => {
	const originalParentPost = state.posts.posts.filter(post => post.id === props.match.params.id);
	const wrongRoute = state.posts.posts.length > 0 && originalParentPost.length === 0
		|| state.posts.posts.length === 0 && !state.posts.fetching;
	return {
		originalParentPost,
		categories: state.categories.categories,
		wrongRoute
	};
};

export default withRouter<any>(connect(mapStateToProps)(PostPage));
