import * as React from 'react';
import * as API from '../api/api';
import { ChangeEvent, FormEvent } from 'react';
import { IComment, IPost } from '../types/types';
import * as moment from 'moment';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/top';
import Textarea from 'react-textarea-autosize';
import '../styles/App.scss';

interface IState {
    comments: IComment[];
    childNewComment: string;
    childNewAuthor: string;
    editParentEnabled: boolean;
    editChildEnabled: boolean;
    modifiedParentPostDetails: IPost;
    editChildId: string;
    editedChildBody: string;
    parentPostDeleted: boolean;
}

interface IMappedProps {
    originalParentPost: IPost[];
}

interface IOwnProps {

}

interface IPostPageUrl {
    category: string;
    id: string;
}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<IPostPageUrl>;

export class PostPage extends React.Component<IProps, IState> {
    private parentPostId: string;

    constructor(props: IProps) {
        super(props);
        this.parentPostId = this.props.match.params.id;
        this.state = {
            comments: [],
            childNewComment: '',
            childNewAuthor: '',
            editParentEnabled: false,
            editChildEnabled: false,
            editChildId: '',
            editedChildBody: '',
            parentPostDeleted: false,
            modifiedParentPostDetails: this.props.originalParentPost[0]
        };
    }

    componentDidMount() {
        API.getCommentsForPost(this.parentPostId)
            .then(result => {
                this.setState({
                    comments: result
                });
            });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            modifiedParentPostDetails: nextProps.originalParentPost[0]
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        API.postCommentToPost(this.state.childNewAuthor, this.state.childNewComment, this.parentPostId)
            .then((result: IComment) => {
                this.setState(prevState => ({
                    comments: [...prevState.comments, result],
                    childNewComment: '',
                    childNewAuthor: ''
                }));
            });
    }

    handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLInputElement;
        switch (target.name) {
            case 'child_new_author':
                this.setState({
                    childNewAuthor: target.value
                });
                break;
            case 'child_new_comment':
                this.setState({
                    childNewComment: target.value
                });
                break;
            case 'parent_title':
                this.setState(previousState => ({
                    modifiedParentPostDetails: {
                        ...previousState.modifiedParentPostDetails,
                        title: target.value
                    }
                }));
                break;
            case 'parent_comment':
                this.setState(previousState => ({
                    modifiedParentPostDetails: {
                        ...previousState.modifiedParentPostDetails,
                        body: target.value
                    }
                }));
                break;
            case 'editedChildBody':
                this.setState({
                    editedChildBody: target.value
                });
                break;
            default:
                break;
        }
    }

    onEditTopCommentButtonClicked = (event: FormEvent<EventTarget>) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.state.editParentEnabled) {
            API.editDetailsOfExistingPost(this.parentPostId, this.state.modifiedParentPostDetails.title, this.state.modifiedParentPostDetails.body)
                .then((result) => {
                    this.setState({
                        editParentEnabled: false,
                        modifiedParentPostDetails: result
                    });
                });
        } else {
            this.setState({
                editParentEnabled: true
            });
        }
    }

    onEditChildCommentButtonClicked = (event: FormEvent<EventTarget>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLInputElement;
        if (this.state.editChildEnabled) {
            API.editDetailsOfExistingComment(target.id, this.state.editedChildBody)
                .then((result) => {
                    const newComments = this.state.comments.filter(comment => comment.id !== result.id);
                    newComments.push(result);
                    this.setState({
                        editChildEnabled: false,
                        editChildId: '',
                        editedChildBody: '',
                        comments: newComments
                    });
                });
        } else {
            this.setState({
                editChildEnabled: true,
                editChildId: target.id,
                editedChildBody: target[0].defaultValue
            });
        }
    }

    onDeleteTopCommentButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        API.deletePost(this.parentPostId)
            .then(() => {
                this.setState({
                    parentPostDeleted: true
                });
            });
    }

    onDeleteChildCommentClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.deleteComment(target.dataset.eventId)
            .then(result => {
                const newComments = this.state.comments.filter(comment => comment.id !== result.id);
                this.setState({
                    comments: newComments
                });
            });
    }

    voteOnComment = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLDivElement;
        API.voteOnComment(target.dataset.eventId, target.dataset.eventAction)
            .then(result => {
                const newComments = this.state.comments.filter(comment => comment.id !== result.id);
                newComments.push(result);
                this.setState({
                    comments: newComments
                });
            });
    }

    voteOnPost = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.voteOnPost(this.parentPostId, target.dataset.eventAction)
            .then(result => {
                this.setState({
                    modifiedParentPostDetails: result
                });
            });
    }

    renderNewCommentSection() {
        return (
            <div className="lower">
                <div className="comment">COMMENT SECTION</div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Your comment:
                        <Textarea
                            name="child_new_comment"
                            className="input-box"
                            value={this.state.childNewComment}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        Your name:
                        <input
                            type="text"
                            name="child_new_author"
                            value={this.state.childNewAuthor}
                            onChange={this.handleChange}
                        />
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }

    renderChildCommentSection() {
        return this.state.comments.map((comment, index) => {
                const commentBeingEdited = this.state.editChildId === comment.id;
                const commentClassList = ['body-text-area'];
                if (!commentBeingEdited) {
                    commentClassList.push('no-outline-text-area');
                }
                return (
                    <div>
                        <div className={'vote-arrows'}>
                            <div className={'arrow-up'} data-event-action="upVote" data-event-id={comment.id} onClick={this.voteOnComment}/>
                            <div className={'arrow-separator'}>{comment.voteScore}</div>
                            <div className={'arrow-down'} data-event-action="downVote" data-event-id={comment.id} onClick={this.voteOnComment}/>
                        </div>
                        <form key={index} className="comment" onSubmit={this.onEditChildCommentButtonClicked} id={comment.id}>
                            <div>Author: {comment.author}</div>
                            <Textarea
                                className={commentClassList.join(' ')}
                                name="parent_comment"
                                value={comment.body}
                                onChange={this.handleChange}
                                readOnly={!commentBeingEdited}
                            />
                            <div>Timestamp: {moment(comment.timestamp).fromNow()}</div>
                            <button className={'edit-submit-delete-button'}>{commentBeingEdited ? 'Submit' : 'Edit'}</button>
                            <button className={'edit-submit-delete-button'} data-event-id={comment.id} onClick={this.onDeleteChildCommentClicked}>Delete</button>
                        </form>
                    </div>
                );
            }
        );
    }

    renderParentCommentSection() {
        const parentBeingEdited = this.state.editParentEnabled;
        const parentClassList = ['body-text-area'];
        if (!parentBeingEdited) {
            parentClassList.push('no-outline-text-area');
        }

        return (
            <div className="upper">

                <div className={'vote-arrows'}>
                    <div className={'arrow-up'} data-event-action="upVote" data-event-id={this.parentPostId} onClick={this.voteOnPost}/>
                    <div className={'arrow-separator'}>{this.state.modifiedParentPostDetails.voteScore}</div>
                    <div className={'arrow-down'} data-event-action="downVote" data-event-id={this.parentPostId} onClick={this.voteOnPost}/>
                </div>

                <form className="comment" onSubmit={this.onEditTopCommentButtonClicked} id={this.parentPostId}>
                    <div>Author: {this.state.modifiedParentPostDetails.author}</div>
                    <Textarea
                        className={parentClassList.join(' ')}
                        value={this.state.modifiedParentPostDetails.title}
                        readOnly={parentBeingEdited}
                        name="parent_title"
                        onChange={this.handleChange}/>
                    <Textarea
                        className={parentClassList.join(' ')}
                        name="parent_comment"
                        value={this.state.modifiedParentPostDetails.body}
                        onChange={this.handleChange}
                        readOnly={!parentBeingEdited}
                    />
                    <div>Timestamp: {moment(this.state.modifiedParentPostDetails.timestamp).fromNow()}</div>
                    <button className={'edit-submit-delete-button'}>{parentBeingEdited ? 'Submit' : 'Edit'}</button>
                    <button className={'edit-submit-delete-button'} data-event-id={this.parentPostId} onClick={this.onDeleteChildCommentClicked}>Delete</button>
                </form>
            </div>
        );
    }

    render() {
        if (this.state.parentPostDeleted) {
            return (
                <Redirect to={'/'}/>
            );
        }

        return (
            <div>
                {this.renderParentCommentSection()}
                {this.renderNewCommentSection()}
                {this.renderChildCommentSection()}
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    originalParentPost: state.posts.posts.filter(post => {
        return post.id === props.match.params.id;
    })
});

export default withRouter<any>(connect(mapStateToProps)(PostPage));