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
import { RouteComponentProps, Switch } from 'react-router';
import { AddNewPost } from './AddNewPost';

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
                {this.renderCategoryLinks()}
                <div>
                    <Switch>
                        {/*these routes are for the individual post*/}
                        {routesForSpecificPost}

                        {/*this route is rendered on the default page load "/". It will list the posts*/}
                        <Route
                            path={`${this.props.match.path}submit`}
                            exact={true}
                            component={AddNewPost}
                        />
                        <Route
                            path={this.props.match.path}
                            exact={false}
                            render={(routeProps) => (
                                <PostList {...routeProps} posts={modifiedPosts}/>
                            )}
                        />
                    </Switch>
                </div>
            </div>
        );
    }

    renderCategoryLinks() {
        let categoryLinks = [];
        if (this.state.categories.length > 0) {
            categoryLinks.push(
                <NavLink
                    to={`${this.props.match.path}`}
                    exact={true}
                    key="all"
                    activeStyle={{
                        fontWeight: 'bold',
                        color: 'red'
                    }}
                >All
                </NavLink>
            );

            this.state.categories.forEach((category, index) => (
                categoryLinks.push(
                    <NavLink
                        to={`${this.props.match.path}${category.name}`}
                        key={index}
                        activeStyle={{
                            fontWeight: 'bold',
                            color: 'red'
                        }}
                    >{category.name}
                    </NavLink>
                )
            ));
        }
        return categoryLinks;
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts
});

export default withRouter<any>(connect(mapStateToProps)(App));
