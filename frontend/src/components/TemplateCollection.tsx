import * as React from 'react';
import { ICategory, IComment, IPost, PageType } from '../types/types';
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
    deletePostAction,
    editOnePost,
    updatePostsAction,
    voteOnPostAction
} from '../actions/postActions';
import { APIFetchCategories, updateCategoriesAction } from '../actions/categoriesActions';
import { changeEditedID } from '../actions/editingActions';
import { APIDeleteComment } from '../actions/commentActions';

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
        this.props.dispatch(APIFetchPosts());
        this.props.dispatch(APIFetchCategories());
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.pageType === PageType.COMMENT && nextProps.parentPostID !== '') {
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
            sortMethod: e.currentTarget.value
        });
    }

    handleTemplateSubmit = (event: IEvent) => {
        switch (event.action) {
            case eventActions.UPVOTE:
            case eventActions.DOWNVOTE:
                if (event.type === PageType.COMMENT) {
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
                if (event.type === PageType.POST) {
                    this.props.dispatch(APIEditDetailsOfExistingPost(event.ID, event.title, event.body));
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
    }

    renderList() {
            if (this.props.pageType === PageType.COMMENT) {
                return this.state.comments
                    .sort((a, b) =>
                        this.state.sortMethod === this.VOTE_SCORE ?
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
                                onSubmit={this.handleTemplateSubmit}
                                key={index}
                            />
                        );
                    });
            } else {
                return (this.props.itemsList as IPost[])
                    .sort((a, b) =>
                        this.state.sortMethod === this.VOTE_SCORE ?
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
                                onSubmit={this.handleTemplateSubmit}
                                commentCount={commentCount}
                                key={index}
                            />
                        );
                    });
            }
    }

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
            this.props.dispatch(APIFetchPosts());
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
