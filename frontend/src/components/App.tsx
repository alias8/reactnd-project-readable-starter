import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import { IPost, TemplateType } from '../types/types';
import { RootState } from '../reducers/TopReducer';
import { RouteComponentProps } from 'react-router';
import '../styles/App.scss';
import TemplateCollection from './TemplateCollection';

interface IMappedProps {
	posts: IPost[];
}

type IProps = IMappedProps;

const App: React.SFC<IProps> = (props) => (
	<TemplateCollection
		pageType={TemplateType.LIST_OF_POSTS}
		listOfPosts={props.posts}
	/>
);

const mapStateToProps: MapStateToProps<IMappedProps, {}, RootState> = (state: RootState, props: IProps) => ({
	posts: state.posts.posts,
});

export default connect(mapStateToProps)(App);
