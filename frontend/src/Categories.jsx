import {
    Route,
    Link
} from 'react-router-dom'
import React from 'react'

export class Categories extends React.Component {
    constructor() {
        super();
        this.state = ({
            categories: []
        });
    }

    async componentDidMount() {
        const categories = await fetchCategoriesAPI();
        const posts = await fetchAllPostsAPI();
        this.setState({
            categories: categories.categories, // redux. udacity, react
            posts: posts // for redux, react
        })
    }

    render() {
        const categoriesReceived = this.state.categories.length > 0;

        return (
            <div>
                {categoriesReceived ? (
                    <div>
                        <h2>Posts</h2>
                        <ul>
                            {this.state.posts.map((post, index) => {
                                const url = post.title.replace(/ /g, '_');
                                const path = `${this.props.match.url}/${url}`
                              const props = post;
                                return (
                                    <li key={index}>
                                        <Link to={path}>
                                            {post.title}
                                        </Link>
                                        <Route path={path} render={(routeProps) => (
                                          <Child {...routeProps} {...props} />
                                        )}/>
                                    </li>
                                )
                            })}
                        </ul>
                        <Route exact path={this.props.match.url} render={() => (
                            <h3>Please select a topic.</h3>
                        )}/>
                    </div>
                ) : (
                    <div>not received yet</div>
                )}
            </div>
        );
    }
}

export class Child extends React.Component {
    constructor() {
        super()
    }

    render() {
        const a = 2;
        return (<div>dsad</div>)
    }

}



const api = 'http://localhost:3001';
const header = {
    Accept: 'application/json',
    Authorization: 'jameskirk75701',
    'Content-Type': 'application/json',
};

const fetchCategoriesAPI = async () => {
    try {
        const response = await fetch(`${api}/categories`, {
            method: 'GET',
            headers: header
        });
        return await response.json();
    } catch (e) {
        return e;
    }
};

const fetchAllPostsAPI = async () => {
    try {
        const response = await fetch(`${api}/posts`, {
            method: 'GET',
            headers: header
        });
        return await response.json();
    } catch (e) {
        return e;
    }
};
