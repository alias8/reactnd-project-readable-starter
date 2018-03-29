import * as React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import * as API from '../api/api';
import { changeEditedID, deletePostAction, updateCategoriesAction, updatePostsAction, voteOnPostAction } from '../actions/actions';
import { Component, FormEvent } from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { ICategory, IPost, PageType } from '../types/types';
import { RootState } from '../reducers/top';
import { Redirect, RouteComponentProps } from 'react-router';
import * as moment from 'moment';
import '../styles/App.scss';
import Textarea from 'react-textarea-autosize';
import { eventActions, IEvent, Template } from './Template';

interface IState {
    editPostClicked: boolean;
    editPostId: string;
    editPostCategory: string;
    sortMethod: string;
}

interface IMappedProps {
    posts: IPost[];
    categories: ICategory[];
    beingEdited: string;
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
            editPostClicked: false,
            editPostId: '',
            editPostCategory: '',
            sortMethod: this.VOTE_SCORE
        };
    }

    componentDidMount() {
        API.fetchPosts()
            .then(result => {
                this.props.dispatch(updatePostsAction(result));
            });
        API.fetchCategories()
            .then(result => {
                this.props.dispatch(updateCategoriesAction(result));
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

        this.props.categories.forEach((category, index) => (
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
            .then((result) => {
                this.props.dispatch(deletePostAction(result));
            });
    }

    voteOnPost = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLButtonElement;
        API.voteOnPost(target.id, target.name)
            .then((result) => {
                this.props.dispatch(voteOnPostAction(result));
            });
    }

    onEditPostClicked = (event: FormEvent<EventTarget>) => {
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

    newOnSubmit = (event: IEvent) => {
        switch (event.action) {
            case eventActions.UPVOTE:
            case eventActions.DOWNVOTE:
                API.voteOnPost(event.ID, event.action)
                    .then((result) => {
                        this.props.dispatch(voteOnPostAction(result));
                    });
                break;
            case eventActions.EDIT:
                this.props.dispatch(changeEditedID(event.ID));
                break;
            default:
        }
    }

    renderCategoryLinks() {
        return this.props.posts
            .sort((a, b) => this.state.sortMethod === this.VOTE_SCORE ? b.voteScore - a.voteScore : b.timestamp - a.timestamp)
            .map((post, index) => {
                return (
                    <Template
                        ID={post.id}
                        category={post.category}
                        title={post.title}
                        body={post.body}
                        timestamp={post.timestamp}
                        author={post.author}
                        type={PageType.LISTED_POST}
                        beingEdited={this.props.beingEdited === post.id}
                        voteScore={post.voteScore}
                        onSubmit={this.newOnSubmit}
                        key={index}
                    />
                );
            });
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
    posts: state.posts.posts,
    categories: state.categories.categories,
    beingEdited: state.beingEdited.beingEdited
});

export default withRouter<any>(connect(mapStateToProps)(App));
