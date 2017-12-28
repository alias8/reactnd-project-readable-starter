import React, { Component } from 'react'
import { Route, } from 'react-router-dom'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import Categories from "./Categories";
import * as API from './api'
import { getPosts } from './actions'
import { Post } from "./Post";

class App extends Component {
    componentDidMount() {
        API.fetchPosts()
            .then(result => {
                this.props.dispatch(getPosts(result))
            })
    }

    render() {
        let routes;
        let posts;
        let titles;
        if (this.props.posts) {
            posts = this.props.posts.map(post => {
                const url = post.title.replace(/ /g, "_");
                return {
                    ...post,
                    path: `${this.props.match.path}${post.category}/${url}`
                }
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


const mapStateToProps = (state, props) => ({
    posts: state.posts.posts
});

export default withRouter(connect(mapStateToProps)(App))
