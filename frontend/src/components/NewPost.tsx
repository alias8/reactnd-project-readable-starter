import * as React from 'react';
import { ChangeEvent } from 'react';
import { Redirect } from 'react-router';
import { ICategory, TemplateType } from '../types/types';
import '../styles/App.scss';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import TopNav from './TopNav';
import { APIAddNewPost } from '../actions/postActions';
import { RootState } from '../reducers/TopReducer';

interface IState {
    title: string;
    text: string;
    author: string;
    chosenCategory: string;
    postSubmitted: boolean;
}

interface IMappedProps {
    categories: ICategory[];
}

type IProps = IMappedProps & DispatchProp<{}>;

export class NewPost extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            title: '',
            text: '',
            author: '',
            chosenCategory: '',
            postSubmitted: false
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.state.chosenCategory !== '') {
            this.props.dispatch(APIAddNewPost(this.state.title, this.state.text, this.state.author, this.state.chosenCategory));
            this.setState({
                postSubmitted: true
            });
        }
    };

    handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: event.currentTarget.value
        });
    };

    handleAuthorChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            author: event.currentTarget.value
        });
    };

    handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            text: event.currentTarget.value
        });
    };

    handleCategoryChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            chosenCategory: event.currentTarget.innerHTML
        });
    };

    render() {
        const categories =
            this.props.categories.map(category => {
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
                    <TopNav
						pageType={TemplateType.LIST_OF_POSTS}
					/>
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

const mapStateToProps: MapStateToProps<IMappedProps, {}, RootState> = (state: RootState, props: IProps) => ({
    categories: state.categories.categories,
});

export default connect(mapStateToProps)(NewPost);
