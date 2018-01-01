import * as React from 'react';
import { NavLink, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import PostList from './PostList';
import * as API from '../api/api';
import { getPosts } from '../actions/actions';
import { Post } from './Post';
import { Component } from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { ICategory, IPost } from '../types/types';
import { RootState } from '../reducers/top';
import { RouteComponentProps } from 'react-router';

interface IState {
    categories: ICategory[];
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
    constructor(props: IProps) {
        super(props);
        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        API.fetchPosts()
            .then(result => {
                this.props.dispatch(getPosts(result));
            });
        API.fetchCategories()
            .then(result => {
                this.setState({
                    categories: result
                });
            });
    }

    render() {
        let categoryLinks;
        if (this.state.categories.length > 0) {
            categoryLinks = this.state.categories.map((category, index) => (
                <NavLink
                    to={`${this.props.match.path}${category.name}`}
                    key={index}
                    activeStyle={{
                        fontWeight: 'bold',
                        color: 'red'
                    }}
                >{category.name}
                </NavLink>
            ));
        }

        let routesForSpecificPost;
        let modifiedPosts: IModifiedPost[];
        if (this.props.posts) {
            modifiedPosts = this.props.posts.map(post => {
                const url = post.title.replace(/ /g, '_');
                return {
                    ...post,
                    path: `${this.props.match.path}${post.category}/${url}`
                };
            });
            routesForSpecificPost = modifiedPosts.map((post, index) => (
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
                {categoryLinks}
                {routesForSpecificPost}

                {/*this route is rendered on the default page load "/". It will list the posts*/}
                <Route
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

export default withRouter<any>(connect(mapStateToProps)(App));
