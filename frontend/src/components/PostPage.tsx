import * as React from 'react';
import { ICategory, IComment, IPost, PageType } from '../types/types';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/TopReducer';
import '../styles/App.scss';
import TemplateCollection from './TemplateCollection';
import * as API from '../api/api';
import { NavLink } from 'react-router-dom';
import { Template } from './Template';

interface IState {
    sortMethod: string;
    originalParentPostId: string;
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
            sortMethod: this.VOTE_SCORE,
            originalParentPostId: ''
        };
    }

    componentWillReceiveProps(nextProps: IProps) {
        if(nextProps.originalParentPost.length > 0) {
            this.setState({
                originalParentPostId: nextProps.originalParentPost[0].id
            });
        }
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
                    parentPostID={this.state.originalParentPostId}
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
