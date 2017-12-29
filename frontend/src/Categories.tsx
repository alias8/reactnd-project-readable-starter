import { Link } from 'react-router-dom'
import * as React from 'react'
import { Component } from "react";

interface IState {

}

interface IMappedProps {

}

interface IOwnProps {
    posts: any
}

type IProps = IOwnProps & IMappedProps;

class Categories extends Component<IProps, IState> {
    componentWillReceiveProps(nextProps) {
        const b = 2;
    }

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
            )
            })}
            </ul>
        }
        </div>
    )
    }
}

export default Categories
