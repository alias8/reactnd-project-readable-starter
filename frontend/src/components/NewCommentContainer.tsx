import * as React from 'react';
import { TemplateType } from "../types/types";
import { eventActions } from "./Template";
import Textarea from 'react-textarea-autosize';

interface IOwnProps {
	pageType: TemplateType
}

type IProps = IOwnProps;

export const NewCommentContainer: React.SFC<IProps> = (props) => {
	return props.pageType === TemplateType.LIST_OF_COMMENTS ? (
		<div className={'add-new-comment-container'}>
			<div>
				<div>Add a comment:</div>
				<Textarea
					placeholder={'start typing your comment!'}
					data-event-action={eventActions.CHANGE_NEW_COMMENT_BODY}
					value={this.state.newCommentBody}
					onChange={this.updateNewComment}
					required={true}
					className={'input-field'}
				/>
				<Textarea
					placeholder={'comment author\'s name'}
					data-event-action={eventActions.CHANGE_NEW_COMMENT_AUTHOR}
					value={this.state.newCommentAuthor}
					onChange={this.updateNewComment}
					required={true}
					className={'input-field'}
				/>
				<button onClick={this.submitNewComment}>Submit comment</button>
			</div>
		</div>
	) : (
		<div/>
	)
};