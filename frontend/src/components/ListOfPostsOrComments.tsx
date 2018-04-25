import * as React from 'react';
import { IComment, IPost, TemplateType } from '../types/types';
import { sortType } from './PostOrCommentCollection';
import { IEvent, PostOrCommentContainer } from './PostOrCommentContainer';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router';
import { RootState } from '../reducers/TopReducer';

interface IOwnProps {
	pageType: TemplateType;
	sortMethod: sortType;
	beingEditedID: string;
	listOfComments: IComment[];
	listOfPosts: IPost[];
	handleTemplateSubmit: (event: IEvent) => void;
}

interface IMappedProps {
	fetchingInProgress: boolean;
}

type IProps = IOwnProps & IMappedProps;

const ListOfPostsOrComments: React.SFC<IProps> = (props) => {
	let itemList;
	itemList = props.pageType === TemplateType.LIST_OF_COMMENTS ? props.listOfComments : props.listOfPosts;
	const list =
		itemList
			.sort((a, b) =>
				props.sortMethod === sortType.VOTE_SCORE ?
					b.voteScore - a.voteScore :
					b.timestamp - a.timestamp)
			.map((post, index) => {
				const beingEdited = props.beingEditedID === post.id;
				const {id, category, title, body, timestamp, author, voteScore, commentCount} = post;
				return (
					<PostOrCommentContainer
						ID={id}
						category={category}
						title={title}
						body={body}
						timestamp={timestamp}
						author={author}
						type={props.pageType}
						beingEdited={beingEdited}
						voteScore={voteScore}
						onSubmit={props.handleTemplateSubmit}
						commentCount={commentCount}
						key={index}
					/>
				);
			});
	return !props.fetchingInProgress && list.length === 0 ? (
		<div>{`No ${props.pageType === TemplateType.LIST_OF_COMMENTS ? `Comments` : `Posts`} to display`}</div>
	) : (
		<div>
			{list}
		</div>
	);
};

const mapStateToProps: MapStateToProps<IMappedProps, {}, RootState> = (state: RootState, props: IProps) => ({
	fetchingInProgress: state.posts.fetching || state.categories.fetching
});

export default connect(mapStateToProps)(ListOfPostsOrComments);
