import * as React from 'react';
import * as API from '../api/api';
import '../styles/App.css';
import { ChangeEvent } from 'react';
import { IComment, IPost } from '../types/types';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

interface IState {
    comments: IComment[];
    comment: string;
    author: string;
    editParentEnabled: boolean;
    editChildEnabled: boolean;
    postDetails: IPost;
    editChildId: string;
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
            comment: '',
            author: '',
            editParentEnabled: false,
            editChildEnabled: false,
            editChildId: '',
            postDetails: {
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
                    postDetails: result
                });
            });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            comment: '',
            author: ''
        });
        API.postCommentToPost(this.state.author, this.state.comment, this.state.postDetails.id)
            .then((result: IComment) => {
                this.setState(prevState => ({
                    comments: [...prevState.comments, result]
                }));
            });
    }

    handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        switch (event.currentTarget.name) {
            case 'new_author':
                this.setState({
                    author: event.currentTarget.value
                });
                break;
            case "new_comment":
                this.setState({
                    comment: event.currentTarget.value
                });
                break;
            case "original_title":
                this.setState(previousState => {
                    const newPostDetails = {
                        ...previousState.postDetails,
                        title: event.currentTarget.value
                    };
                    return {
                        postDetails: newPostDetails
                    }
                });
                break;
            case "original_comment":
                this.setState(previousState => {
                    const newPostDetails = {
                        ...previousState.postDetails,
                        body: event.currentTarget.value
                    };
                    return {
                        postDetails: newPostDetails
                    }
                });
                break;
            default:
                break;
        }
    }

    onEditTopCommentButtonClicked = () => {
        if (this.state.editParentEnabled) {
            API.editDetailsOfExistingPost(this.props.match.params.id, this.state.postDetails.title, this.state.postDetails.body)
                .then((result) => {
                    this.setState({
                        editParentEnabled: false
                    });
                })
        } else {
            this.setState({
                editParentEnabled: true
            });
        }
    }

    onEditChildCommentButtonClicked = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.state.editChildEnabled) {
            API.editDetailsOfExistingComment(event.currentTarget.name, this.state.postDetails.body)
                .then((result) => {
                    this.setState({
                        editChildEnabled: false,
                        editChildId: ''
                    });
                })
        } else {
            this.setState({
                editChildEnabled: true,
                editChildId: event.target.id
            });
        }
    }

    render() {
        let comments = this.state.comments.map((comment, index) => (
                <form key={index} className="comment" onSubmit={this.onEditChildCommentButtonClicked} id={comment.id}>
                    <div>Author: {comment.author}</div>
                    <input value={`Body: ${comment.body}`} readOnly={this.state.editChildId !== comment.id} type="text" name="new_body"/>
                    <div>Timestamp: {moment(comment.timestamp).fromNow()}</div>
                    <div>VoteScore: {comment.voteScore}</div>
                    <input type="submit" value={this.state.editChildId === comment.id ? 'Submit changes' : 'Edit this comment'}/>
                </form>
            )
        );

        let fakeBody = [];
        for (let i = 0; i < 10; i++) {
            fakeBody.push(<div key={i}>{this.state.postDetails.body}</div>);
        }

        return (
            <div>
                {!this.state.editParentEnabled &&
                <div className="upper">
                    <div className="post-vote-score">{this.state.postDetails.voteScore}</div>
                    <div className="not-post-vote-score">
                        <div className="post-title">{this.state.postDetails.title}</div>
                        <div className="post-submitted-by">
                            Submitted {moment(this.state.postDetails.timestamp).fromNow()} by {this.state.postDetails.author}
                        </div>
                        <div className="post-body">
                            {fakeBody}
                        </div>
                    </div>
                    <div>
                        <button onClick={this.onEditTopCommentButtonClicked}>Edit this post</button>
                    </div>
                </div>
                }

                {this.state.editParentEnabled &&
                <div className="upper">
                    <div className="post-vote-score">{this.state.postDetails.voteScore}</div>
                    <div className="not-post-vote-score">
                        <input
                            name="original_title"
                            value={this.state.postDetails.title}
                            onChange={this.handleChange}
                        />
                        <div className="post-submitted-by">
                            Submitted {moment(this.state.postDetails.timestamp).fromNow()} by {this.state.postDetails.author}
                        </div>
                        <div className="post-body">
                            <textarea
                                name="original_comment"
                                value={this.state.postDetails.body}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <button onClick={this.onEditTopCommentButtonClicked}>Edit this post</button>
                    </div>
                </div>
                }

                <div className="lower">
                    <div className="comment">COMMENT SECTION</div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Your comment:
                            <textarea
                                name="new_comment"
                                className="input-box"
                                value={this.state.comment}
                                onChange={this.handleChange}
                            />
                        </label>
                        <label>
                            Your name:
                            <input
                                type="text"
                                name="new_author"
                                value={this.state.author}
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
