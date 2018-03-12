import * as React from 'react';
import * as API from '../api/api';
import '../styles/App.css';
import { ChangeEvent } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { ICategory, IComment, IPost } from '../types/types';

interface IState {
    postDetails: IPost;
    title: string;
    text: string;
    postSubmitted: boolean;
}

interface IMappedProps {

}

interface IOwnProps {

}

interface IPostPageUrl {
    category: string;
    id: string;
}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<IPostPageUrl>;

export class EditPost extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            postSubmitted: false,
            postDetails: {
                author: '',
                body: '',
                category: '',
                commentCount: 0,
                deleted: false,
                id: '',
                timestamp: 0,
                title: '',
                voteScore: 0
            }
        };
    }

    componentDidMount() {
        API.getDetailsForOnePost(this.props.match.params.id)
            .then(result => {
                this.setState({
                    postDetails: result
                });
            });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

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
                <Redirect to={`/${this.state.chosenCategory}/${this.state.title.replace(/ /g, '_')}`}/>
            );
        } else {
            return (
                <div>
                    Edit an existing post:
                    <form onSubmit={this.handleSubmit}>
                        <label className="add-new-post-input">
                            Title:
                            <input
                                name="title"
                                value={this.state.postDetails.title}
                                onChange={this.handleTitleChange}
                            />
                        </label>
                        <label className="add-new-post-input">
                            Text:
                            <textarea
                                name="text"
                                value={this.state.postDetails.body}
                                onChange={this.handleTextChange}
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
