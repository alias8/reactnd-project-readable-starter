import * as React from 'react'
import { Route, } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import Categories from "./Categories";
import * as API from './api'
import { getPosts } from './actions'
import { Post } from "./Post";
import { Component } from "react";
import { connect, DispatchProp, MapStateToProps } from "react-redux";
import { IPost } from "./types";
import { RootState } from './reducers/top';

interface IState {

}

interface IMappedProps {
    posts: IPost[],
    match: any
}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps;

interface IModifiedPost extends IPost {
    path: string
}


class App extends Component<IProps, IState> {
    componentDidMount() {
        API.fetchPosts()
            .then(result => {
                this.props.dispatch(getPosts(result))
            })
    }

    render() {
        let routes;
        let posts: IModifiedPost[];
        if (this.props.posts) {
            posts = this.props.posts.map(post => {
                const url = post.title.replace(/ /g, "_");
                return {
                    ...post,
                    path: `${this.props.match.path}${post.category}/${url}`
                };
            });
            routes = posts.map((post, index) => <Route key={post.id} exact path={post.path} render={(routeProps) => (
                <Post {...routeProps} post={posts[index]}/>
            )}/>)
        }
        return (
            <div>
                {routes}
                <Route exact path={this.props.match.path} render={(routeProps) => (
                    <Categories {...routeProps} posts={posts}/>
                )}/>
            </div>
        )
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts
});

export default withRouter(connect(mapStateToProps)(App))
