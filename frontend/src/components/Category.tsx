import { Link } from 'react-router-dom';
import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/top';
import * as moment from 'moment';
import { IPost } from '../types/types';
import '../styles/App.scss';

interface IState {
    sortMethod: string;
}

interface IMappedProps {
    posts: IPost[];
}

interface IOwnProps {

}

interface ICategoryPageUrl {
    category: string;
}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<ICategoryPageUrl>;

class Category extends Component<IProps, IState> {
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
                <Link to={`/new`}>
                    Submit new post
                </Link>
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
                                .sort((a, b) => this.state.sortMethod === this.VOTE_SCORE ? b.voteScore - a.voteScore : b.timestamp - a.timestamp)
                                .map((post, index) => {
                                    return (
                                        <div key={index}>
                                            <Link
                                                to={`/${post.category}/posts/${post.id}`}
                                                key={index}
                                            >
                                                {post.title}
                                            </Link>
                                            <div>{`submitted ${moment(post.timestamp).fromNow()} to ${post.category}`}</div>
                                            <div>{`${post.commentCount} comments`}</div>
                                        </div>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
                }
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts.filter(post => {
        return post.category === props.match.params.category
    })
});

export default withRouter<any>(connect(mapStateToProps)(Category));
