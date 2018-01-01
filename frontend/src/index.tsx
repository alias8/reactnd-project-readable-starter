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

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path="/" component={App}/>
        </Router>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
