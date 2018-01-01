import * as React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import PostList from './PostList';
import * as API from '../api/api';
import { getPosts } from '../actions/actions';
import { Post } from './Post';
import { Component } from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { IPost } from '../types/types';
import { RootState } from '../reducers/top';
import { RouteComponentProps } from 'react-router';

interface IState {

}

interface IMappedProps {
    posts: IPost[];
}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}> & RouteComponentProps<{}>;

export interface IModifiedPost extends IPost {
    path: string;
}

class App extends Component<IProps, IState> {
    componentDidMount() {
        API.fetchPosts()
            .then(result => {
                this.props.dispatch(getPosts(result));
            });
    }

    render() {
        let routes;
        let modifiedPosts: IModifiedPost[];
        if (this.props.posts) {
            modifiedPosts = this.props.posts.map(post => {
                const url = post.title.replace(/ /g, '_');
                return {
                    ...post,
                    path: `${this.props.match.path}${post.category}/${url}`
                };
            });
            routes = modifiedPosts.map((post, index) => (
                <Route
                    key={post.id}
                    exact={true}
                    path={post.path}
                    render={(routeProps) => (
                        <Post {...routeProps} post={modifiedPosts[index]}/>
                    )}
                />));
        }
        return (
            <div>
                {routes}
                {/*this route is rendered on the default page load "/". It will list the posts*/}
                <Route
                    exact={true}
                    path={this.props.match.path}
                    render={(routeProps) => (
                        <PostList {...routeProps} posts={modifiedPosts}/>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts
});

export default withRouter(connect(mapStateToProps)(App));
