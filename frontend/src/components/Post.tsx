import * as React from 'react';
import * as API from '../api/api';
import '../styles/App.css';
import { ChangeEvent } from 'react';
import { Redirect } from 'react-router';
import { IComment, IPost } from '../types/types';

interface IState {
    comments: IComment[];
    comment: string;
    author: string;
}

interface IMappedProps {

}

interface IOwnProps {
    post: IPost;
}

type IProps = IOwnProps & IMappedProps;

export class Post extends React.Component<IProps, IState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = {
            comments: [],
            comment: '',
            author: ''
        };
    }

    componentDidMount() {
        API.getCommentsForPost(this.props.post.id)
            .then(result => {
                this.setState({
                    comments: result
                });
            });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        API.postCommentToPost(this.state.author, this.state.comment, this.props.post.id)
            .then( (result: IComment) => {
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

    render() {
        let comments;
        if (this.state.comments.length > 0) {
            comments = this.state.comments.map((comment, index) => {
                return (
                    <div key={index} className="comment">
                        <div>Author: {comment.author}</div>
                        <div>Body: {comment.body}</div>
                        <div>Timestamp: {comment.timestamp}</div>
                        <div>VoteScore: {comment.voteScore}</div>
                    </div>
                );
            });
        }

        return (
            <div>
                <div className="upper">
                    <div className="post-vote-score">{this.props.post.voteScore}</div>
                    <div className="not-post-vote-score">
                        <div className="post-title">{this.props.post.title}</div>
                        <div className="post-submitted-by">Submitted {this.props.post.timestamp} days ago
                            by {this.props.post.author}</div>
                        <div className="post-body">
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                            {this.props.post.body}
                        </div>
                    </div>
                </div>

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
