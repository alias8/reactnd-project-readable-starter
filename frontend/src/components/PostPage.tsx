import * as React from 'react';
import { ICategory, IComment, IPost, PageType } from '../types/types';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/top';
import '../styles/App.scss';
import TemplateCollection from './TemplateCollection';
import * as API from '../api/api';
import { NavLink } from 'react-router-dom';
import { Template } from './Template';

interface IState {
    sortMethod: string;
}

interface IMappedProps {
    originalParentPost: IPost[];
    categories: ICategory[];
}

interface IOwnProps {

}

interface IPostPageUrl {
    category: string;
    id: string;
}

type IProps = IOwnProps & IMappedProps & RouteComponentProps<IPostPageUrl>;

export class PostPage extends React.Component<IProps, IState> {
    private TIME_STAMP: string;
    private VOTE_SCORE: string;

    constructor(props: IProps) {
        super(props);
        this.VOTE_SCORE = 'VOTE_SCORE';
        this.TIME_STAMP = 'TIME_STAMP';
        this.state = {
            sortMethod: this.VOTE_SCORE
        };
    }

    formLinksFromCategories() {
        let categoryLinks: any = [];
        categoryLinks.push(
            <NavLink
                className={'top-navlink'}
                to={`/`}
                exact={true}
                key={'all'}
                activeStyle={{
                    fontWeight: 'bold',
                    color: 'red'
                }}
            >{'All'.toUpperCase()}
            </NavLink>
        );

        this.props.categories.forEach((category, index) => (
            categoryLinks.push(
                <NavLink
                    className={'top-navlink'}
                    to={`/${category.name}/posts`}
                    key={category.name}
                    activeStyle={{
                        fontWeight: 'bold',
                        color: 'red'
                    }}
                >{category.name.toUpperCase()}
                </NavLink>
            )
        ));
        return categoryLinks;
    }

    render() {
        return (
            <div>
                <TemplateCollection
                    pageType={PageType.POST}
                    itemsList={this.props.originalParentPost}
                />
                <TemplateCollection
                    pageType={PageType.COMMENT}
                    parentPostID={this.props.originalParentPost[0].id}
                    itemsList={[]}
                />
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    originalParentPost: state.posts.posts.filter(post => {
        return post.id === props.match.params.id;
    }),
    categories: state.categories.categories,
});

export default withRouter<any>(connect(mapStateToProps)(PostPage));
