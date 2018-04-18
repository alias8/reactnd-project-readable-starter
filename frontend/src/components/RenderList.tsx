import * as React from 'react';
import { Component } from 'react';
import { IComment, IPost, TemplateType } from "../types/types";
import { sortType } from "./TemplateCollection";
import { IEvent, Template } from "./Template";

interface IOwnProps {
	pageType: TemplateType;
	sortMethod: sortType;
	beingEditedID: string;
	comments: IComment[];
	itemsList: IPost[] | IComment[];
	handleTemplateSubmit: (event: IEvent) => void;
}

type IProps = IOwnProps;

export class RenderList extends Component<IProps, {}> {
	render() {
		if (this.props.pageType === TemplateType.LIST_OF_COMMENTS) {
			return this.props.comments
				.sort((a, b) =>
					this.props.sortMethod === sortType.VOTE_SCORE ?
						b.voteScore - a.voteScore :
						b.timestamp - a.timestamp)
				.map((comment, index) => {
					const beingEdited = this.props.beingEditedID === comment.id;
					const { id, body, timestamp, author, voteScore } = comment;
					return (
						<Template
							ID={id}
							body={body}
							timestamp={timestamp}
							author={author}
							type={this.props.pageType}
							beingEdited={beingEdited}
							voteScore={voteScore}
							onSubmit={this.props.handleTemplateSubmit}
							key={index}
						/>
					);
				});
		} else {
			return (this.props.itemsList as IPost[])
				.sort((a, b) =>
					this.props.sortMethod === sortType.VOTE_SCORE ?
						b.voteScore - a.voteScore :
						b.timestamp - a.timestamp)
				.map((post, index) => {
					const beingEdited = this.props.beingEditedID === post.id;
					const { id, category, title, body, timestamp, author, voteScore, commentCount } = post;
					return (
						<Template
							ID={id}
							category={category}
							title={title}
							body={body}
							timestamp={timestamp}
							author={author}
							type={this.props.pageType}
							beingEdited={beingEdited}
							voteScore={voteScore}
							onSubmit={this.props.handleTemplateSubmit}
							commentCount={commentCount}
							key={index}
						/>
					);
				});
		}
	}
}