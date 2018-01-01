import { Link } from 'react-router-dom';
import * as React from 'react';
import { Component } from 'react';
import { IModifiedPost } from './App';

interface IState {

}

interface IMappedProps {

}

interface IOwnProps {
    posts: IModifiedPost[];
}

type IProps = IOwnProps & IMappedProps;

class PostList extends Component<IProps, IState> {
    render() {
        return (
            <div>
                <h2>Posts</h2>
        {this.props.posts &&
        <ul>
            {this.props.posts.map((post, index) => {
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
