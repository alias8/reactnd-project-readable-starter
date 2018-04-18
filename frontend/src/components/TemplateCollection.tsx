import * as React from 'react';
import { ShouldDisplayTopNav, ICategory, IComment, IPost, TemplateType, ShouldDisplaySort } from '../types/types';
import { Component } from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../reducers/TopReducer';
import { eventActions, IEvent, Template } from './Template';
import * as API from '../api/api';
import TopNav from './TopNav';
import Textarea from 'react-textarea-autosize';
import {
    APIDeletePost,
    APIEditDetailsOfExistingPost, APIFetchPosts,
    APIVoteOnPost,
} from '../actions/postActions';
import { APIFetchCategories } from '../actions/categoriesActions';
import { changeEditedID } from '../actions/editingActions';
import { APIDeleteComment } from '../actions/commentActions';
import { RenderList } from "./RenderList";
import { SortContainer } from "./SortContainer";

export enum sortType {
	VOTE_SCORE = 'VOTE_SCORE',
	TIME_STAMP = 'TIME_STAMP',
}

interface IState {
    sortMethod: sortType;
    comments: IComment[];
    newCommentBody: string;
    newCommentAuthor: string;
}

interface IMappedProps {
    categories: ICategory[];
    beingEditedID: string;
}

interface IOwnProps {
    pageType: TemplateType;
    itemsList: IPost[] | IComment[];
    parentPostID?: string;
}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}>;

class TemplateCollection extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            sortMethod: sortType.VOTE_SCORE,
            comments: [],
            newCommentBody: '',
            newCommentAuthor: ''
        };
    }

    componentDidMount() {
        this.props.dispatch(APIFetchPosts());
        this.props.dispatch(APIFetchCategories());
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.pageType === TemplateType.LIST_OF_COMMENTS && nextProps.parentPostID !== '') {
            API.getCommentsForPost(nextProps.parentPostID)
                .then((result) => {
                    this.setState({
                        comments: result
                    });
                })
                .catch((error) => {
                    this.setState({
                        comments: []
                    });
                });
        }
    }

    updateSortMethod = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            sortMethod: (e.currentTarget.value as sortType)
        });
    };

    handleTemplateSubmit = (event: IEvent) => {
        switch (event.action) {
            case eventActions.UPVOTE:
            case eventActions.DOWNVOTE:
                if (event.type === TemplateType.LIST_OF_COMMENTS) {
                    API.voteOnComment(event.ID, event.action)
                        .then((result) => {
                            const newCommentList = this.state.comments.filter((comment) => comment.id !== result.id);
                            newCommentList.push(result);
                            this.setState({
                                comments: newCommentList
                            });
                        });
                } else {
                    this.props.dispatch(APIVoteOnPost(event.ID, event.action));
                }
                break;
            case eventActions.CHANGE_EDIT_ID:
                this.props.dispatch(changeEditedID(event.ID));
                break;
            case eventActions.CLEAR_EDIT_ID:
                this.props.dispatch(changeEditedID(''));
                if (event.type === TemplateType.SINGLE_POST) {
                    this.props.dispatch(APIEditDetailsOfExistingPost(event.ID, event.title, event.body));
                } else if (event.type === TemplateType.LIST_OF_COMMENTS) {
                    API.editDetailsOfExistingComment(event.ID, event.body)
                        .then((result: IComment) => {
                            const newCommentList = this.state.comments.filter((comment) => comment.id !== result.id);
                            newCommentList.push(result);
                            this.setState({
                                comments: newCommentList
                            });
                        });
                }
                break;
            case eventActions.DELETE_POST:
                if (event.type === TemplateType.LIST_OF_COMMENTS) {
                    this.props.dispatch(APIDeleteComment(event.ID));
                    this.setState({
                        comments: this.state.comments.filter((comment) => comment.id !== event.ID)
                    });
                } else {
                    this.props.dispatch(APIDeletePost(event.ID));
                }
                break;
            default:
        }
    };

    updateNewComment =  (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        switch (event.target.dataset.eventAction) {
            case eventActions.CHANGE_NEW_COMMENT_BODY:
                this.setState({
                    newCommentBody: event.currentTarget.value
                });
                break;
            case eventActions.CHANGE_NEW_COMMENT_AUTHOR:
                this.setState({
                    newCommentAuthor: event.currentTarget.value
                });
                break;
            default:
        }
    };

    submitNewComment = () => {
        if (this.state.newCommentBody !== '' && this.state.newCommentAuthor !== '') {
            API.postCommentToPost(this.state.newCommentAuthor, this.state.newCommentBody, this.props.parentPostID)
                .then((result: IComment) => {
                    const newCommentList = this.state.comments.filter((comment) => comment.id !== result.id);
                    newCommentList.push(result);
                    this.setState({
                        comments: newCommentList
                    });
                });
            this.props.dispatch(APIFetchPosts());
        }
    };

    render() {
        return (
            <div>
				<TopNav
					pageType={this.props.pageType}
				/>
				<SortContainer
					updateSortMethod={this.updateSortMethod}
					sortMethod={this.state.sortMethod}
					pageType={this.props.pageType}
				/>
                <hr className={'thick-hr'}/>
                {this.props.pageType === TemplateType.LIST_OF_COMMENTS &&
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
                }

                <div className={'main-flex-container'}>
                    <div className={'post-list'}>
						<RenderList
							pageType={this.props.pageType}
							sortMethod={this.state.sortMethod}
							beingEditedID={this.props.beingEditedID}
							handleTemplateSubmit={this.handleTemplateSubmit}
							comments={this.state.comments}
							itemsList={this.props.itemsList}
						/>
                    </div>
                    {this.props.pageType !== TemplateType.LIST_OF_COMMENTS &&
                    <div className={'add-new-post'}>
                        <Link to={`/new`}>
                            Submit new post
                        </Link>
                    </div>
                    }
                </div>

            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    categories: state.categories.categories,
    beingEditedID: state.beingEdited.beingEditedID,
});

export default connect(mapStateToProps)(TemplateCollection);
