import { Link } from 'react-router-dom';
import * as React from 'react';
import { Component } from 'react';
import { IModifiedPost } from './App';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, MapStateToProps } from "react-redux";
import { RootState } from "../reducers/top";

interface IState {
    sortMethod: string;
}

interface IMappedProps {
    posts: IModifiedPost[];
}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<{}>;

class PostList extends Component<IProps, IState> {
    VOTE_SCORE: string;
    TIME_STAMP: string;

    constructor(props: IProps) {
        super(props);
        this.VOTE_SCORE = 'VOTE_SCORE';
        this.TIME_STAMP = 'TIME_STAMP';
        this.state = {
            sortMethod: this.VOTE_SCORE
        };
    }

    handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            sortMethod: e.currentTarget.value
        });
    }

    render() {
        return (
            <div>
                <h2>Posts</h2>
                {this.props.posts &&
                <div>
                    <div className="list-of-posts">
                        <div>sort by:</div>
                        <select value={this.state.sortMethod} onChange={this.handleChange}>
                            <option value={this.VOTE_SCORE}>Score (highest first)</option>
                            <option value={this.TIME_STAMP}>Time (newest first)</option>
                        </select>
                        <ul>
                            {this.props.posts
                                .filter(post => (this.props.location.pathname === '/' ?
                                    true : post.path.match(/(\/.+)\//)[1] === this.props.location.pathname))
                                .sort((a, b) => this.state.sortMethod === this.VOTE_SCORE ? b.voteScore - a.voteScore : a.timestamp - b.timestamp)
                                .map((post, index) => {
                                    return (
                                        <li key={post.id}>
                                            <Link to={post.path}>
                                                {post.title}
                                            </Link>
                                            <div>submitted {(new Date(post.timestamp)).toLocaleString()} hours ago by {post.author} to {post.category}</div>
                                            <div>{post.voteScore} upvotes</div>
                                            <div>{post.commentCount} comments</div>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                    <Link
                        to={`${this.props.match.path}submit`}
                        className="list-of-posts submit-post-button"
                    >
                        Submit post
                    </Link>
                </div>
                }
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts
});

export default withRouter<any>(connect(mapStateToProps)(PostList));
