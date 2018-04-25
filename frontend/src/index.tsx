import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles/App.scss';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import store from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import NewPost from './components/NewPost';
import { NotFoundPage } from './components/NotFoundPage';
import Category from './components/Category';
import PostPage from './components/PostPage';

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route exact={true} path={'/'} component={App}/>
				<Route exact={true} path={'/404'} component={NotFoundPage}/>
				<Route exact={true} path={'/:category/'} component={Category}/>
				<Route exact={true} path={'/:category/:id'} component={PostPage}/>
				<Route exact={true} path={'/new'} component={NewPost}/>
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root'));
registerServiceWorker();

// todo:
// use this library to make this more visually appealing http://www.material-ui.com/#/
// have a loading symbol while API calls are being made
