import * as React from 'react';
import { Component } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/TopReducer';
import { IPost, TemplateType } from '../types/types';
import '../styles/App.scss';
import TemplateCollection from './TemplateCollection';

interface IState {

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
		if (this.props.wrongRoute) {
			return <Redirect to={'/404'}/>;
		} else {
			return <TemplateCollection
				pageType={TemplateType.LIST_OF_POSTS}
				listOfPosts={this.props.posts}
			/>;
		}
	}
}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => {
	const wrongRoute = state.categories.fetching
		? false
		: !state.categories.categories
			.map((category) => category.name)
			.includes(props.match.params.category);
	return {
		posts: state.posts.posts.filter(post => post.category === props.match.params.category),
		wrongRoute
	}
};

export default withRouter<any>(connect(mapStateToProps)(Category));
