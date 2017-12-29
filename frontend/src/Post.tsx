import * as React from 'react'
import * as API from "./api";
import "./App.css"

interface IState {
    comments: any,
    comment: string
}

interface IMappedProps {

}

interface IOwnProps {
    post: any
}

type IProps = IOwnProps & IMappedProps;

export class Post extends React.Component<IProps, IState> {
    state = {
        comments: [],
        comment: ''
    }

    componentDidMount() {
        const b = 2;
        const k = 3;
        const r = 2;
        API.getCommentsForPost(this.props.post.id)
            .then(result => {
                this.setState({
                    comments: result
                });
            })
    }

    componentWillReceiveProps(nextProps) {
        const a = 2
    }

    handleSubmit = () => {
        event.preventDefault();
    }

    handleChange = (event) => {
        this.setState({comment: event.target.value});
    }

    render() {
        let comments;
        if (this.state.comments.length > 0) {
            comments = this.state.comments.map((comment, index) => {
                return (
                    <div className="comment">
                        <div>Author: {comment.author}</div>
                <div>Body: {comment.body}</div>
                <div>Timestamp: {comment.timestamp}</div>
                <div>VoteScore: {comment.voteScore}</div>
                </div>
            )
            })
        }

        return (
            <div>
                <div className="upper">
            <div className="post-vote-score">{this.props.post.voteScore}</div>
        <div className="not-post-vote-score">
        <div className="post-title">{this.props.post.title}</div>
        <div className="post-submitted-by">Submitted {this.props.post.timestamp} days ago by {this.props.post.author}</div>
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
            <textarea name="name" className="input-box" value={this.state.comment} onChange={this.handleChange}/>
        </label>
        <input type="submit" value="Submit" />
            </form>

        {comments}
        </div>
        </div>

    )
    }
}