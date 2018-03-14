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
import { Redirect, RouteComponentProps, Switch } from 'react-router';
import { NewPost } from './NewPost';
import * as moment from 'moment';

interface IState {
    categories: ICategory[];
    editPostClicked: boolean;
    editPostId: string;
    editPostCategory: string;
    sortMethod: string;
}

interface IMappedProps {
    posts: IPost[];
}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}> & RouteComponentProps<{}>;

class App extends Component<IProps, IState> {
    private TIME_STAMP: string;
    private VOTE_SCORE: string;
    constructor(props: IProps) {
        super(props);
        this.VOTE_SCORE = 'VOTE_SCORE';
        this.TIME_STAMP = 'TIME_STAMP';
        this.state = {
            categories: [],
            editPostClicked: false,
            editPostId: '',
            editPostCategory: '',
            sortMethod: this.VOTE_SCORE
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

    onDeletePostClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.deletePost(target.id)
            .then(() => {
                return API.fetchPosts();
            })
            .then(result => {
                this.props.dispatch(getPosts(result));
            });
    }

    voteOnPost = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.voteOnPost(target.id, target.name)
            .then(() => {
                return API.fetchPosts();
            })
            .then(result => {
                this.props.dispatch(getPosts(result));
            });
    }

    onEditPostClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        this.setState({
            editPostClicked: true,
            editPostId: target.id,
            editPostCategory: target.name
        });
    }

    handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            sortMethod: e.currentTarget.value
        });
    }

    renderCategoryLinks() {
        return this.props.posts
            .sort((a, b) => this.state.sortMethod === this.VOTE_SCORE ? b.voteScore - a.voteScore : a.timestamp - b.timestamp)
            .map((post, index) => (
            <div key={index}>
                <Link
                    to={`${post.category}/posts/${post.id}`}
                >
                    {post.title}
                </Link>
                <div>{`submitted ${moment(post.timestamp).fromNow()} by ${post.author} to ${post.category}`}</div>
                <div>{`${post.commentCount} comments`}</div>
                <div>Vote score: {post.voteScore}</div>
                <button type="submit" id={post.id} name={post.category} onClick={this.onEditPostClicked}>Edit this comment</button>
                <button type="submit" id={post.id} onClick={this.onDeletePostClicked}>Delete this comment</button>
                <button name="upVote" id={post.id} onClick={this.voteOnPost}>upvote</button>
                <button name="downVote" id={post.id} onClick={this.voteOnPost}>downvote</button>
            </div>
        ));
    }

    render() {
        if (this.state.editPostClicked) {
            return (
                <Redirect to={`/${this.state.editPostCategory}/posts/${this.state.editPostId}`}/>
            );
        }
        return (
            <div>
                <div>{this.formLinksFromCategories()}</div>
                <Link to={`/new`}>
                    Submit new post
                </Link>
                <div>sort by:</div>
                <select value={this.state.sortMethod} onChange={this.handleChange}>
                    <option value={this.VOTE_SCORE}>Score (highest first)</option>
                    <option value={this.TIME_STAMP}>Time (newest first)</option>
                </select>
                <div>{this.renderCategoryLinks()}</div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts
});

export default withRouter<any>(connect(mapStateToProps)(App));
