import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/App.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import store from './store/store';
import { Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { NewPost } from './components/NewPost';
import { NotFoundPage } from './components/NotFoundPage';
import Category from './components/Category';
import { EditComment } from './components/EditComment';
import { NewComment } from './components/NewComment';
import PostPage from "./components/PostPage";

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact={true} path={'/new'} component={NewPost}/>
                <Route exact={true} path={'/'} component={App}/>
                <Route exact={true} path={'/404'} component={NotFoundPage}/>
                <Route exact={true} path={'/:category/posts'} component={Category}/>
                <Route exact={true} path={'/:category/posts/:id'} component={PostPage}/>
                {/*<Route exact={true} path={'/comments/:comment_id/edit'} component={EditComment}/>*/}
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
