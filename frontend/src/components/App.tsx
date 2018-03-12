import * as React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import PostList from './Category';
import * as API from '../api/api';
import { getPosts } from '../actions/actions';
import { PostPage } from './PostPage';
import { Component } from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { ICategory, IPost } from '../types/types';
import { RootState } from '../reducers/top';
import { RouteComponentProps, Switch } from 'react-router';
import { NewPost } from './NewPost';
import * as moment from 'moment';

interface IState {
    categories: ICategory[];
}

interface IMappedProps {
    posts: IPost[];
}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}> & RouteComponentProps<{}>;

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

    formLinksFromCategories() {
        let categoryLinks: any = [];
        categoryLinks.push(
            <NavLink
                to={`/`}
                exact={true}
                key={'all'}
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
                    to={`/${category.name}/posts`}
                    key={category.name}
                    activeStyle={{
                        fontWeight: 'bold',
                        color: 'red'
                    }}
                >{category.name}
                </NavLink>
            )
        ));
        return categoryLinks;
    }

    renderCategoryLinks() {
        return this.props.posts.map((post, index) => (
            <div key={index}>
                <Link
                    to={`${post.category}/posts/${post.id}`}
                >
                    {post.title}
                </Link>
                <div>{`submitted ${moment(post.timestamp).fromNow()} to ${post.category}`}</div>
                <div>{`${post.commentCount} comments`}</div>
            </div>
        ));
    }

    render() {
        return (
            <div>
                <div>{this.formLinksFromCategories()}</div>
                <Link to={`/new`}>
                    Submit new post
                </Link>
                <div>{this.renderCategoryLinks()}</div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts
});

export default withRouter<any>(connect(mapStateToProps)(App));
