import * as React from 'react';
import { Component } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/TopReducer';
import { IPost, PageType } from '../types/types';
import '../styles/App.scss';
import TemplateCollection from './TemplateCollection';

interface IState {
    sortMethod: string;
}

interface IMappedProps {
    posts: IPost[];
    wrongRoute: boolean;
}

interface IOwnProps {

}

interface ICategoryPageUrl {
    category: string;
}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}> & RouteComponentProps<ICategoryPageUrl>;

class Category extends Component<IProps, IState> {
    render() {
        return this.props.wrongRoute ? (
            <Redirect to={'/404'}/>
        ) : (
            <TemplateCollection
                pageType={PageType.LISTED_POST}
                itemsList={this.props.posts}
            />
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => {
    const filteredPosts = state.posts.posts.filter(post => post.category === props.match.params.category);
    const wrongRoute = state.posts.posts.length > 0 && filteredPosts.length === 0;
    return {
        posts: filteredPosts,
        wrongRoute: wrongRoute
    }
};

export default withRouter<any>(connect(mapStateToProps)(Category));
