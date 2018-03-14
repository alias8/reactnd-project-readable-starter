import * as React from 'react';
import * as API from '../api/api';
import '../styles/App.css';
import { ChangeEvent, FormEvent } from 'react';
import { IComment, IPost } from '../types/types';
import * as moment from 'moment';
import { Redirect, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

interface IState {
    comments: IComment[];
    childNewComment: string;
    childNewAuthor: string;
    editParentEnabled: boolean;
    editChildEnabled: boolean;
    parentPostDetails: IPost;
    editChildId: string;
    editChildBody: string;
    parentPostDeleted: boolean;
}

interface IMappedProps {

}

interface IOwnProps {
    post: IPost;
}

interface IPostPageUrl {
    category: string;
    id: string;
}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<IPostPageUrl>;

export class PostPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            comments: [],
            childNewComment: '',
            childNewAuthor: '',
            editParentEnabled: false,
            editChildEnabled: false,
            editChildId: '',
            editChildBody: '',
            parentPostDeleted: false,
            parentPostDetails: {
                author: '',
                body: '',
                category: '',
                commentCount: 0,
                deleted: false,
                id: '',
                timestamp: 0,
                title: '',
                voteScore: 0
            }
        };
    }

    componentDidMount() {
        API.getCommentsForPost(this.props.match.params.id)
            .then(result => {
                this.setState({
                    comments: result
                });
            });
        API.getDetailsForOnePost(this.props.match.params.id)
            .then(result => {
                this.setState({
                    parentPostDetails: result
                });
            });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        API.postCommentToPost(this.state.childNewAuthor, this.state.childNewComment, this.props.match.params.id)
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
                this.setState(previousState => {
                    const newPostDetails = {
                        ...previousState.parentPostDetails,
                        title: target.value
                    };
                    return {
                        parentPostDetails: newPostDetails
                    };
                });
                break;
            case 'parent_comment':
                this.setState(previousState => {
                    const newPostDetails = {
                        ...previousState.parentPostDetails,
                        body: target.value
                    };
                    return {
                        parentPostDetails: newPostDetails
                    };
                });
                break;
            case 'editChildBody':
                this.setState({
                    editChildBody: target.value
                });
                break;
            default:
                break;
        }
    }

    onEditTopCommentButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.state.editParentEnabled) {
            API.editDetailsOfExistingPost(this.props.match.params.id, this.state.parentPostDetails.title, this.state.parentPostDetails.body)
                .then((result) => {
                    this.setState({
                        editParentEnabled: false
                    });
                    return API.getDetailsForOnePost(this.props.match.params.id)
                })
                .then(result => {
                    this.setState({
                        parentPostDetails: result
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
            API.editDetailsOfExistingComment(target.id, this.state.editChildBody)
                .then(() => {
                    this.setState({
                        editChildEnabled: false,
                        editChildId: '',
                        editChildBody: ''
                    });
                    return API.getCommentsForPost(this.props.match.params.id);
                })
                .then(result => {
                    this.setState({
                        comments: result
                    });
                });
        } else {
            this.setState({
                editChildEnabled: true,
                editChildId: target.id,
                editChildBody: target[0].defaultValue
            });
        }
    }

    onDeleteTopCommentButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        API.deletePost(this.props.match.params.id)
            .then(result => {
                this.setState({
                    parentPostDeleted: true
                });
            });
    }

    onDeleteChildCommentClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.deleteComment(target.id)
            .then(result => {
                return API.getCommentsForPost(this.props.match.params.id);
            })
            .then(result => {
                this.setState({
                    comments: result
                });
            });
    }

    voteOnComment = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.voteOnComment(target.id, target.name)
            .then(result => {
                return API.getCommentsForPost(this.props.match.params.id);
            })
            .then(result => {
                this.setState({
                    comments: result
                });
            });
    }

    voteOnPost = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.voteOnPost(target.id, target.name)
            .then(result => {
                return API.getDetailsForOnePost(this.props.match.params.id)
            })
            .then(result => {
                this.setState({
                    parentPostDetails: result
                });
            });
    }

    render() {
        if (this.state.parentPostDeleted) {
            return (
                <Redirect to={'/'}/>
            );
        }

        let comments = this.state.comments.map((comment, index) => {
                const commentBeingEdited = this.state.editChildId === comment.id;
                return (
                    <form key={index} className="comment" onSubmit={this.onEditChildCommentButtonClicked} id={comment.id}>
                        <div>Author: {comment.author}</div>
                        {commentBeingEdited ? (
                            <input value={this.state.editChildBody} readOnly={false} type="text" name="editChildBody" onChange={this.handleChange}/>
                        ) : (
                            <input value={comment.body} readOnly={true} type="text"/>
                        )}
                        <div>Timestamp: {moment(comment.timestamp).fromNow()}</div>
                        <div>VoteScore: {comment.voteScore}</div>
                        {commentBeingEdited ? (
                            <button type="submit">Submit changes</button>
                        ) : (
                            <button type="submit">Edit this comment</button>
                        )}
                        <button type="submit" id={comment.id} onClick={this.onDeleteChildCommentClicked}>Delete this comment</button>
                        <button name="upVote" id={comment.id} onClick={this.voteOnComment}>upvote</button>
                        <button name="downVote" id={comment.id} onClick={this.voteOnComment}>downvote</button>
                    </form>
                );
            }
        );

        let fakeBody = [];
        for (let i = 0; i < 10; i++) {
            fakeBody.push(<div key={i}>{this.state.parentPostDetails.body}</div>);
        }
        const parentBeingEdited = this.state.editParentEnabled;
        return (
            <div>
                <div className="upper">
                    <div className="post-vote-score">{this.state.parentPostDetails.voteScore}</div>
                    <div className="not-post-vote-score">
                        <input
                            name="parent_title"
                            value={this.state.parentPostDetails.title}
                            onChange={this.handleChange}
                            readOnly={!parentBeingEdited}
                        />
                        <div className="post-submitted-by">
                            Submitted {moment(this.state.parentPostDetails.timestamp).fromNow()} by {this.state.parentPostDetails.author}
                        </div>
                        <div className="post-body">
                            <textarea
                                name="parent_comment"
                                value={this.state.parentPostDetails.body}
                                onChange={this.handleChange}
                                readOnly={!parentBeingEdited}
                            />
                        </div>
                    </div>
                    <div>
                        {this.state.editParentEnabled ? (
                            <button onClick={this.onEditTopCommentButtonClicked}>Submit changes</button>
                        ) : (
                            <button onClick={this.onEditTopCommentButtonClicked}>Edit this post</button>
                        )}
                        <button onClick={this.onDeleteTopCommentButtonClicked}>Delete this post</button>
                        <button name="upVote" id={this.props.match.params.id} onClick={this.voteOnPost}>upvote</button>
                        <button name="downVote" id={this.props.match.params.id} onClick={this.voteOnPost}>downvote</button>
                    </div>
                </div>

                <div className="lower">
                    <div className="comment">COMMENT SECTION</div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Your comment:
                            <textarea
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

                    {comments}
                </div>
            </div>
        );
    }
}
