import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class Categories extends Component {
    componentWillReceiveProps(nextProps) {
        const b = 2;
    }

    render() {
        return (
            <div>
                <h2>Posts</h2>
                {this.props.posts &&
                <ul>
                    {this.props.posts.map((post, index) => {
                        return (
                            <li key={post.id}>
                                <Link to={post.path}>
                                    {post.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                }
            </div>
        )
    }
}

export default withRouter(connect()(Categories))

// export class Child extends React.Component {
//     constructor() {
//         super()
//     }
//
//     render() {
//         const a = 2;
//         return (<div className="fullscreen">dsad</div>)
//     }
//
// }



