import * as React from 'react';
import { IComment, IPost, TemplateType } from "../types/types";
import { sortType } from "./TemplateCollection";
import { IEvent, Template } from "./Template";

interface IOwnProps {
	pageType: TemplateType;
	sortMethod: sortType;
	beingEditedID: string;
	listOfComments: IComment[];
	listOfPosts: IPost[];
	handleTemplateSubmit: (event: IEvent) => void;
}

type IProps = IOwnProps;

export const RenderList: React.SFC<IProps> = (props) => {
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
				<Template
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
	return (
		<div>
			{list}
		</div>
	)
};