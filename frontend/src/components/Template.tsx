import * as React from 'react';
import { DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as API from '../api/api';
import { updateCategoriesAction, updatePostsAction } from "../actions/actions";
import Textarea from "react-textarea-autosize";
import * as moment from 'moment';
import { PageType } from "../types/types";
import { FormEvent } from "react";

interface IState {

}

interface IMappedProps {

}

interface IOwnProps {
    ID: string;
    title: string;
    body: string;
    beingEdited: boolean;
    timestamp: number;
    author: string;
    type: PageType;
    voteScore: number;
    onSubmit: (event: IEvent) => void;
    category: string;
}

export interface IEvent extends IOwnProps {
    action: eventActions
}

export enum eventActions {
    UPVOTE = "upVote",
    DOWNVOTE = "downVote"
}

type IProps = IOwnProps;

export class Template extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    clickHandle = (event) => {
        const myEvent = {
                ...this.props,
            action: event.target.dataset.eventAction
        };
        this.props.onSubmit(myEvent);
    };

    render() {
        return (
            <div>
                <div className="comment">
                    <div className={"vote-arrows"}>
                        <button className={"arrow-up"} data-event-action={eventActions.UPVOTE} onClick={this.clickHandle}/>
                        <div className={"arrow-separator"}>{this.props.voteScore}</div>
                        <button className={"arrow-down"} data-event-action={eventActions.DOWNVOTE} onClick={this.clickHandle}/>
                    </div>
                    <div>
                        <Textarea
                            data-event-action="title"
                            value={this.props.title}
                            readOnly={this.props.beingEdited}
                        />
                        {this.props.type !== PageType.LISTED_POST &&
                        <Textarea
                            data-event-action="body"
                            value={this.props.body}
                            readOnly={this.props.beingEdited}
                        />
                        }
                    </div>
                    <div>
                        <div>submitted by {this.props.author} {moment(this.props.timestamp).fromNow()} {this.props.type === PageType.LISTED_POST ? `to ${this.props.category}`:``}</div>
                        <button className={"edit-submit-delete-button"}>{this.props.beingEdited ? "Submit" : "Edit"}</button>
                        <button className={"edit-submit-delete-button"} data-event-action="delete">Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}