import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import * as moment from 'moment';
import { TemplateType } from '../types/types';
import { Link } from 'react-router-dom';

interface IState {
    editedTitle: string;
    editedBody: string;
}

interface IOwnProps {
    ID: string;
    title?: string;
    body: string;
    beingEdited: boolean;
    timestamp: number;
    author: string;
    type: TemplateType;
    voteScore: number;
    onSubmit: (event: IEvent) => void;
    category?: string;
    commentCount?: number;
}

export interface IEvent extends IOwnProps {
    action: eventActions;
}

export enum eventActions {
    UPVOTE = 'upVote',
    DOWNVOTE = 'downVote',
    CHANGE_EDIT_ID = 'CHANGE_EDIT_ID',
    CHANGE_EDITED_TITLE = 'CHANGE_EDITED_TITLE',
    CLEAR_EDIT_ID = 'CLEAR_EDIT_ID',
    DELETE_POST = 'DELETE_POST',
    CHANGE_EDITED_BODY = 'CHANGE_EDITED_BODY',
    CHANGE_NEW_COMMENT_BODY = 'CHANGE_NEW_COMMENT_BODY',
    CHANGE_NEW_COMMENT_AUTHOR = 'CHANGE_NEW_COMMENT_AUTHOR'
}

type IProps = IOwnProps;

export class Template extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            editedTitle: this.props.title,
            editedBody: this.props.body
        };
    }

    clickHandle = (event) => {
        const myEvent = {
            ...this.props,
            title: this.state.editedTitle,
            body: this.state.editedBody,
            action: event.target.dataset.eventAction
        };
        this.props.onSubmit(myEvent);
    }

    componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            editedTitle: nextProps.title,
            editedBody: nextProps.body
        })
    }

    handleChange = (event) => {
        switch (event.target.dataset.eventAction) {
            case eventActions.CHANGE_EDITED_TITLE:
                this.setState({
                    editedTitle: event.target.value
                });
                break;
            case eventActions.CHANGE_EDITED_BODY:
                this.setState({
                    editedBody: event.target.value
                });
                break;
            default:
        }
    }

    render() {
        const textAreaClassNames = ['no-black-outline-textbox', 'post-title'];
        if (!this.props.beingEdited) {
            textAreaClassNames.push('no-blue-highlight-text-area');
        }
        const titleAsLink = (
            <Link to={`${this.props.category}/${this.props.ID}`}>
                {this.state.editedTitle}
            </Link>
        );
        const titleAsTextArea = (
                <Textarea
                    data-event-action={eventActions.CHANGE_EDITED_TITLE}
                    value={this.state.editedTitle}
                    readOnly={!this.props.beingEdited}
                    onChange={this.handleChange}
                    className={textAreaClassNames.join(' ')}
                />
            );
        let title;
        if (this.props.type === TemplateType.SINGLE_POST) {
            title = titleAsTextArea;
        } else {
            if (this.props.beingEdited) {
                title = titleAsTextArea;
            } else {
                title = titleAsLink;
            }
        }
        return (
            <div>
                <div className="comment">
                    <div className={'vote-arrows'}>
                        <div
                            className={'arrow-up'}
                            data-event-action={eventActions.UPVOTE}
                            onClick={this.clickHandle}
                        />
                        <div className={'arrow-separator'}>{this.props.voteScore}</div>
                        <div
                            className={'arrow-down'}
                            data-event-action={eventActions.DOWNVOTE}
                            onClick={this.clickHandle}
                        />
                    </div>
                    <div className={'comment-right-side'}>
                        {title}
                        {this.props.type !== TemplateType.LIST_OF_POSTS &&
                        <Textarea
                            data-event-action={eventActions.CHANGE_EDITED_BODY}
                            onChange={this.handleChange}
                            value={this.state.editedBody}
                            readOnly={!this.props.beingEdited}
                        />
                        }
                        <div className={'post-extra-info'}>
                            <div
                                className={'first-line'}
                            >submitted {moment(this.props.timestamp).fromNow()} by {this.props.author}
                                {this.props.type === TemplateType.LIST_OF_POSTS &&
                                <span> to <Link to={`${this.props.category}`}>{this.props.category}</Link>
                            </span>
                                }
                            </div>
                            <div className={'second-line'}>
                                {this.props.type !== TemplateType.LIST_OF_COMMENTS &&
                                <span>{this.props.commentCount} comments </span>
                                }
                                <button
                                    className={'edit-submit-delete-button'}
                                    data-event-action={this.props.beingEdited ?
                                        eventActions.CLEAR_EDIT_ID :
                                        eventActions.CHANGE_EDIT_ID}
                                    onClick={this.clickHandle}
                                >{this.props.beingEdited ? 'Submit' : 'Edit'}
                                </button>
                                <button
                                    className={'edit-submit-delete-button'}
                                    data-event-action={eventActions.DELETE_POST}
                                    onClick={this.clickHandle}
                                >Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
}
