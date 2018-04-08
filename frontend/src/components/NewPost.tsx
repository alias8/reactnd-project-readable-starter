import * as React from 'react';
import * as API from '../api/api';
import { ChangeEvent } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { ICategory, IComment, IPost, PageType } from '../types/types';
import '../styles/App.scss';
import { addOnePostAction, updatePostsAction } from '../actions/actions';
import { connect, DispatchProp } from 'react-redux';
import TopNav from './TopNav';

interface IState {
    title: string;
    text: string;
    author: string;
    chosenCategory: string;
    categories: ICategory[];
    postSubmitted: boolean;
}

interface IMappedProps {

}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<{}> & DispatchProp<{}>;

class NewPost extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            title: '',
            text: '',
            author: '',
            chosenCategory: '',
            categories: [],
            postSubmitted: false
        };
    }

    componentDidMount() {
        API.fetchCategories()
            .then(result => {
                this.setState({
                    categories: result
                });
            });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.state.chosenCategory !== '') {
            API.addNewPost(this.state.title, this.state.text, this.state.author, this.state.chosenCategory)
                .then((result: IPost) => {
                    this.props.dispatch(addOnePostAction(result));
                    this.setState({
                        postSubmitted: true
                    });
                });
        }
    }

    handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: event.currentTarget.value
        });
    }

    handleAuthorChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            author: event.currentTarget.value
        });
    }

    handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            text: event.currentTarget.value
        });
    }

    handleCategoryChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            chosenCategory: event.currentTarget.innerHTML
        });
    }

    render() {
        const categories =
            this.state.categories.map(category => {
                return (
                    <button
                        className={category.name === this.state.chosenCategory ? 'clicked-category' : ''}
                        onClick={this.handleCategoryChange}
                        key={category.name}
                    >{category.name}
                    </button>
                );
            });

        if (this.state.postSubmitted) {
            return (
                <Redirect to={'/'}/>
            );
        } else {
            return (
                <div>
                    <TopNav/>
                    <div className={'top-buffer'}/>
                    <hr className={'thick-hr'}/>
                    <div className={'new-post-container'}>
                        Submit a new post:
                        <form onSubmit={this.handleSubmit}>
                            <input
                                placeholder={'start typing your post\'s title'}
                                name="title"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                                required={true}
                                className={'input-field'}
                            />
                            <textarea
                                placeholder={'start typing the body of your new post'}
                                name="text"
                                onChange={this.handleTextChange}
                                required={true}
                                className={'input-field'}
                            />
                            <input
                                placeholder={'post author name'}
                                name="author"
                                onChange={this.handleAuthorChange}
                                required={true}
                                className={'input-field'}
                            />
                            <input type="submit" value="Submit"/>
                        </form>
                        <div>Choose a category to post to:</div>
                        {categories}
                    </div>
                </div>
            );
        }
    }
}

export default connect()(NewPost);
