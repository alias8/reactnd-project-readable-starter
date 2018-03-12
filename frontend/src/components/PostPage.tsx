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
    editEnabled: boolean;
    postDetails: IPost;
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
            editEnabled: false,
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
        this.setState({
            comment: '',
            author: ''
        })
        event.preventDefault();
        event.stopPropagation();
        API.postCommentToPost(this.state.author, this.state.comment, this.state.postDetails.id)
            .then((result: IComment) => {
                this.setState(prevState => ({
                    comments: [...prevState.comments, result]
                }));
            });
    }

    handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            comment: event.currentTarget.value
        });
    }

    handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            author: event.currentTarget.value
        });
    }

    handleOriginalTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState(previousState => ({
            postDetails: {
                ...previousState.postDetails,
                title: event.currentTarget.value
            }
        }));
    }

    handleOriginalBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState(previousState => ({
            postDetails: {
                ...previousState.postDetails,
                body: event.currentTarget.value
            }
        }));
    }

    onEditButtonClicked = () => {
        if(this.state.editEnabled) {
            API.editDetailsOfExistingPost(this.props.match.params.id, this.state.postDetails.title, this.state.postDetails.body)
                .then((result) => {
                    const a = 2;
                })
                .then((result) => {
                    this.setState(previousState => ({
                        editEnabled: !previousState.editEnabled
                    }));
                })
        } else {
            this.setState(previousState => ({
                editEnabled: !previousState.editEnabled
            }));
        }
    };

    render() {
        let comments = this.state.comments.map((comment, index) => (
                <div key={index} className="comment">
                    <div>Author: {comment.author}</div>
                    <div>Body: {comment.body}</div>
                    <div>Timestamp: {moment(comment.timestamp).fromNow()}</div>
                    <div>VoteScore: {comment.voteScore}</div>
                </div>
            )
        );

        let fakeBody = [];
        for (let i = 0; i < 10; i++) {
            fakeBody.push(<div key={i}>{this.state.postDetails.body}</div>);
        }

        return (
            <div>
                {!this.state.editEnabled &&
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
                            <button onClick={this.onEditButtonClicked}>Edit this post</button>
                        </div>
                    </div>
                }

                {this.state.editEnabled &&
                <div className="upper">
                    <div className="post-vote-score">{this.state.postDetails.voteScore}</div>
                    <div className="not-post-vote-score">
                        <input
                            name="title"
                            value={this.state.postDetails.title}
                            onChange={this.handleOriginalTitleChange}
                        />
                        <div className="post-submitted-by">
                            Submitted {moment(this.state.postDetails.timestamp).fromNow()} by {this.state.postDetails.author}
                        </div>
                        <div className="post-body">
                            <textarea
                                name="body"
                                value={this.state.postDetails.body}
                                onChange={this.handleOriginalBodyChange}
                            />
                        </div>
                    </div>
                    <div>
                        <button onClick={this.onEditButtonClicked}>Edit this post</button>
                    </div>
                </div>
                }


                <div className="lower">
                    <div className="comment">COMMENT SECTION</div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Your comment:
                            <textarea
                                name="comment"
                                className="input-box"
                                value={this.state.comment}
                                onChange={this.handleCommentChange}
                            />
                        </label>
                        <label>
                            Your name:
                            <input
                                type="text"
                                name="name"
                                value={this.state.author}
                                onChange={this.handleNameChange}
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
