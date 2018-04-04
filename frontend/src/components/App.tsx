import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Component } from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { IPost, PageType } from '../types/types';
import { RootState } from '../reducers/top';
import { Redirect, RouteComponentProps } from 'react-router';
import '../styles/App.scss';
import TemplateCollection from './TemplateCollection';

interface IState {

}

interface IMappedProps {
    posts: IPost[];
}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}> & RouteComponentProps<{}>;

class App extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <TemplateCollection
                pageType={PageType.LISTED_POST}
                itemsList={this.props.posts}
            />
        );
    }
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => {
    return {
        posts: state.posts.posts,
    };
};

export default withRouter<any>(connect(mapStateToProps)(App));
