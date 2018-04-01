import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import * as moment from 'moment';
import { PageType } from '../types/types';
import * as API from '../api/api';
import { changeEditedID, changeEditedTitle, voteOnPostAction } from '../actions/actions';
import { Link } from 'react-router-dom';

interface IState {
    editedTitle: string;
}

interface IOwnProps {
    ID: string;
    title: string;
    body: string;
    beingEditedID: boolean;
    timestamp: number;
    author: string;
    type: PageType;
    voteScore: number;
    onSubmit: (event: IEvent) => void;
    category: string;
    commentCount: number;
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
    DELETE_POST = 'DELETE_POST'
}

type IProps = IOwnProps;

export class Template extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            editedTitle: this.props.title
        };
    }

    clickHandle = (event) => {
        const myEvent = {
            ...this.props,
            title: this.state.editedTitle,
            action: event.target.dataset.eventAction
        };
        this.props.onSubmit(myEvent);
    }

    handleChange = (event) => {
        switch (event.target.dataset.eventAction) {
            case eventActions.CHANGE_EDITED_TITLE:
                this.setState({
                    editedTitle: event.target.value
                });
                break;
            default:
        }
    }

    render() {
        const textAreaClassNames = ['no-black-outline-textbox', 'post-title'];
        if (!this.props.beingEditedID) {
            textAreaClassNames.push('no-blue-highlight-text-area');
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
                        <Textarea
                            data-event-action={eventActions.CHANGE_EDITED_TITLE}
                            value={this.state.editedTitle}
                            readOnly={!this.props.beingEditedID}
                            onChange={this.handleChange}
                            className={textAreaClassNames.join(' ')}
                        />
                        {this.props.type !== PageType.LISTED_POST &&
                        <Textarea
                            data-event-action="body"
                            value={this.props.body}
                            readOnly={!this.props.beingEditedID}
                        />
                        }
                        <div className={'post-extra-info'}>
                            <div className={'first-line'}>submitted {moment(this.props.timestamp).fromNow()} by {this.props.author}
                                {this.props.type === PageType.LISTED_POST &&
                                <span> to <Link to={`${this.props.category}/posts`}>{this.props.category}</Link>
                            </span>
                                }
                            </div>
                            <div className={'second-line'}>
                                <span>{this.props.commentCount} comments </span>
                                <button
                                    className={'edit-submit-delete-button'}
                                    data-event-action={this.props.beingEditedID ?
                                        eventActions.CLEAR_EDIT_ID :
                                        eventActions.CHANGE_EDIT_ID}
                                    onClick={this.clickHandle}
                                >{this.props.beingEditedID ? 'Submit' : 'Edit'}
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
