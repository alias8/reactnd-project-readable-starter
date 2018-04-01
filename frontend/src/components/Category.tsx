import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/top';
import { IPost, PageType } from '../types/types';
import '../styles/App.scss';
import TopSection from './TopSection';

interface IState {
    sortMethod: string;
}

interface IMappedProps {
    posts: IPost[];
}

interface IOwnProps {

}

interface ICategoryPageUrl {
    category: string;
}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}> & RouteComponentProps<ICategoryPageUrl>;

class Category extends Component<IProps, IState> {
    render() {
        return (
            <TopSection
                pageType={PageType.LISTED_POST}
                posts={this.props.posts}
            />
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    posts: state.posts.posts.filter(post => {
        return post.category === props.match.params.category;
    }),
});

export default withRouter<any>(connect(mapStateToProps)(Category));
