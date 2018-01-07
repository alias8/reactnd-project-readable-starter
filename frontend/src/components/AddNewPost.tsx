import * as React from 'react';
import * as API from '../api/api';
import '../styles/App.css';
import { ChangeEvent } from 'react';
import { Redirect } from 'react-router';
import { ICategory, IComment, IPost } from '../types/types';

interface IState {
    title: string;
    text: string;
    author: string;
    category: string;
    categories: ICategory[];
}

interface IMappedProps {

}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps;

export class AddNewPost extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            title: '',
            text: '',
            author: '',
            category: '',
            categories: []
        };
    }

    componentDidMount() {
        const categories =
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
        API.addNewPost(this.state.title, this.state.text, this.state.author, this.state.category)
            .then((result: IComment) => {
                const a = 2;
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

    handleCategoryChange = (event: MouseEvent<HTMLButtonElement>) => {
        this.setState({
            text: event.currentTarget.value
        });
    }

    render() {
        this.state.categories.map(category => (
            <button onClick={this.handleCategoryChange}>{category.name}</button>
        ))

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
                            type="text"
                            name="author"
                            onChange={this.handleAuthorChange}
                        />
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                <div>Choose a category to post to:</div>

            </div>

        );
    }
}
