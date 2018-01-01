import { Link } from 'react-router-dom';
import * as React from 'react';
import { Component } from 'react';
import { IModifiedPost } from './App';
import { RouteComponentProps } from 'react-router';

interface IState {

}

interface IMappedProps {

}

interface IOwnProps {
    posts: IModifiedPost[];
}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<{}>;

class PostList extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const VOTE_SCORE = 'VOTE_SCORE';
        const TIME_STAMP = 'TIME_STAMP';
        this.state = {
            sortMethod: VOTE_SCORE
        };
    }
    render() {
        return (
            <div>
                <h2>Posts</h2>
                {this.props.posts &&
                <ul>
                    {this.props.posts
                        .filter(post => (this.props.location.pathname === '/' ?
                            true : post.path.match(/(\/.+)\//)[1] === this.props.location.pathname))
                        .map((post, index) => {
                            return (
                                <li key={post.id}>
                                    <Link to={post.path}>
                                        {post.title}
                                    </Link>
                                </li>
                            );
                        })}
                </ul>
                }
            </div>
        );
    }
}

export default PostList;
