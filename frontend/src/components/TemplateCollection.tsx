import * as React from 'react';
import { ICategory, IComment, IPost, PageType } from '../types/types';
import { Component } from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { RootState } from '../reducers/TopReducer';
import { eventActions, IEvent, Template } from './Template';
import * as API from '../api/api';
import {
    changeEditedID,
    deletePostAction,
    editOnePost, updateCategoriesAction,
    updatePostsAction,
    voteOnPostAction
} from '../actions/actions';
import TopNav from './TopNav';
import Textarea from 'react-textarea-autosize';

interface IState {
    sortMethod: string;
    comments: IComment[];
    newCommentBody: string;
    newCommentAuthor: string;
}

interface IMappedProps {
    categories: ICategory[];
    beingEditedID: string;
}

interface IOwnProps {
    pageType: PageType;
    itemsList: IPost[] | IComment[];
    parentPostID?: string;
}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}>;

class TemplateCollection extends Component<IProps, IState> {
    private TIME_STAMP: string;
    private VOTE_SCORE: string;

    constructor(props: IProps) {
        super(props);
        this.VOTE_SCORE = 'VOTE_SCORE';
        this.TIME_STAMP = 'TIME_STAMP';
        this.state = {
            sortMethod: this.VOTE_SCORE,
            comments: [],
            newCommentBody: '',
            newCommentAuthor: ''
        };
    }

    componentDidMount() {
        API.fetchPosts()
            .then(result => {
                this.props.dispatch(updatePostsAction(result));
            });
        API.fetchCategories()
            .then(result => {
                this.props.dispatch(updateCategoriesAction(result));
            });
        if (this.props.pageType === PageType.COMMENT) {
            API.getCommentsForPost(this.props.parentPostID)
                .then((result) => {
                    this.setState({
                        comments: result
                    });
                });
        }
    }

    updateSortMethod = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            sortMethod: e.currentTarget.value
        });
    }

    handleTemplateSubmit = (event: IEvent) => {
        switch (event.action) {
            case eventActions.UPVOTE:
            case eventActions.DOWNVOTE:
                if(event.type === PageType.COMMENT) {
                    API.voteOnComment(event.ID, event.action)
                        .then((result) => {
                            const newCommentList = this.state.comments.filter((comment) => comment.id !== result.id);
                            newCommentList.push(result);
                            this.setState({
                                comments: newCommentList
                            });
                        });
                } else {
                    API.voteOnPost(event.ID, event.action)
                        .then((result) => {
                            this.props.dispatch(voteOnPostAction(result));
                        });
                }

                break;
            case eventActions.CHANGE_EDIT_ID:
                this.props.dispatch(changeEditedID(event.ID));
                break;
            case eventActions.CLEAR_EDIT_ID:
                this.props.dispatch(changeEditedID(''));
                if (event.type === PageType.POST) {
                    API.editDetailsOfExistingPost(event.ID, event.title, event.body)
                        .then((result: IPost) => {
                            this.props.dispatch(editOnePost(result));
                        });
                } else if (event.type === PageType.COMMENT) {
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
                if (event.type === PageType.COMMENT) {
                    API.deleteComment(event.ID)
                        .then((result: IComment) => {
                            this.setState({
                                comments: this.state.comments.filter((comment) => comment.id !== result.id)
                            });
                        });
                } else {
                    API.deletePost(event.ID)
                        .then((result: IPost) => {
                            this.props.dispatch(deletePostAction(result));
                        });
                }
                break;
            default:
        }
    }

    isComment(obj: IComment[] | IPost[]): obj is IComment[] {
        return this.props.pageType === PageType.COMMENT;
        // const objTest = obj as IComment[];
        // return objTest[0].parentDeleted !== undefined;
    }

    renderList() {
            if (this.isComment(this.props.itemsList)) {
                return this.state.comments
                    .sort((a, b) =>
                        this.state.sortMethod === this.VOTE_SCORE ?
                            b.voteScore - a.voteScore :
                            b.timestamp - a.timestamp)
                    .map((comment, index) => {
                        const beingEdited = this.props.beingEditedID === comment.id;
                        return (
                            <Template
                                ID={comment.id}
                                body={comment.body}
                                timestamp={comment.timestamp}
                                author={comment.author}
                                type={this.props.pageType}
                                beingEdited={beingEdited}
                                voteScore={comment.voteScore}
                                onSubmit={this.handleTemplateSubmit}
                                key={index}
                            />
                        );
                    });
            } else {
                return this.props.itemsList
                    .sort((a, b) =>
                        this.state.sortMethod === this.VOTE_SCORE ?
                            b.voteScore - a.voteScore :
                            b.timestamp - a.timestamp)
                    .map((post, index) => {
                        const beingEdited = this.props.beingEditedID === post.id;
                        return (
                            <Template
                                ID={post.id}
                                category={post.category}
                                title={post.title}
                                body={post.body}
                                timestamp={post.timestamp}
                                author={post.author}
                                type={this.props.pageType}
                                beingEdited={beingEdited}
                                voteScore={post.voteScore}
                                onSubmit={this.handleTemplateSubmit}
                                commentCount={post.commentCount}
                                key={index}
                            />
                        );
                    });
            }
    }

    updateNewComment =  (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    }

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
        }
    }

    render() {
        return (
            <div>
                {this.props.pageType !== PageType.COMMENT &&
                <TopNav/>
                }
                {this.props.pageType !== PageType.POST &&
                <div className={'sort-container'}>
                    <div>Sort:</div>
                    <select value={this.state.sortMethod} onChange={this.updateSortMethod}>
                        <option value={this.VOTE_SCORE}>Score (highest first)</option>
                        <option value={this.TIME_STAMP}>Time (newest first)</option>
                    </select>
                </div>
                }
                <hr className={'thick-hr'}/>
                {this.props.pageType === PageType.COMMENT &&
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
                }

                <div className={'main-flex-container'}>
                    <div className={'post-list'}>
                        {this.renderList()}
                    </div>
                    {this.props.pageType !== PageType.COMMENT &&
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
