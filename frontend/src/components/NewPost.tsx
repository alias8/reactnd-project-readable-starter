import * as React from 'react';
import * as API from '../api/api';
import '../styles/App.css';
import { ChangeEvent } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { ICategory, IComment } from '../types/types';

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

type IProps = IOwnProps & IMappedProps & RouteComponentProps<{}>;

export class NewPost extends React.Component<IProps, IState> {
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
        API.addNewPost(this.state.title, this.state.text, this.state.author, this.state.chosenCategory)
            .then((result: IComment) => {
                this.setState({
                    postSubmitted: true
                });
            });
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
                    Submit a new post:
                    <form onSubmit={this.handleSubmit}>
                        <label className="add-new-post-input">
                            Title:
                            <input
                                name="title"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </label>
                        <label className="add-new-post-input">
                            Text:
                            <textarea
                                name="text"
                                onChange={this.handleTextChange}
                            />
                        </label>
                        <label className="add-new-post-input">
                            Author:
                            <input
                                name="author"
                                onChange={this.handleAuthorChange}
                            />
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                    <div>Choose a category to post to:</div>
                    {categories}
                </div>
            );
        }
    }
}
