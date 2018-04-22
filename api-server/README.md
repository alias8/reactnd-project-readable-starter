# API Server

This server code was provided as part of the project, and shouldn't have
to be modified.
To install and start the API server, run the following
commands from the directory one level above this one:

* `yarn run install`
* `yarn run server`

## Using The Server

### Include An Authorization Header

All requests should use an **Authorization header** to work with your own data:

```js
fetch(
    url,
    {
        headers: { 'Authorization': 'whatever-you-want' }
    }
)
```

### Comment Counts
Posts retrieved in a list or individually now contain comment counts in the format `post: { commentCount: 0 }`.  This should make it easier to display the number of comments a post has without having to call the comments endpoint for each post.   This count is updated whenever a comment is added or deleted via the `POST /comments` or `DELETE /comments/:id` endpoints.

### API Endpoint

The following endpoints are available:

| Endpoints       | Usage          | Params         |
|-----------------|----------------|----------------|

| 1`GET /categories` | Get all of the categories available for the app. List is found in `categories.js`. Feel free to extend this list as you desire. |  |

| 2`GET /:category/posts` | Get all of the posts for a particular category. |  |

| 3`GET /posts` | Get all of the posts. Useful for the main page when no category is selected. |  |

| 4`POST /posts` | Add a new post. | **id** - UUID should be fine, but any unique id will work <br> **timestamp** - [Timestamp] Can in whatever format you like, you can use `Date.now()` if you like. <br> **title** - [String] <br> **body** - [String] <br> **author** - [String] <br> **category** -  Any of the categories listed in `categories.js`. Feel free to extend this list as you desire. |

| 5`GET /posts/:id` | Get the details of a single post. | |

| 6`POST /posts/:id` | Used for voting on a post. | **option** - [String]: Either `"upVote"` or `"downVote"`. |

| 7`PUT /posts/:id` | Edit the details of an existing post. | **title** - [String] <br> **body** - [String] |

| 8`DELETE /posts/:id` | Sets the deleted flag for a post to 'true'. <br> Sets the parentDeleted flag for all child comments to 'true'. | |

| 9`GET /posts/:id/comments` | Get all the comments for a single post. | |

| 10`POST /comments` | Add a comment to a post. | **id** - Any unique ID. As with posts, UUID is probably the best here. <br> **timestamp** - [Timestamp] Get this however you want. <br> **body** - [String] <br> **author** - [String] <br> **parentId** - Should match a post id in the database. |

| 11`GET /comments/:id` | Get the details for a single comment. | |

| 12`POST /comments/:id` | Used for voting on a comment. | **option** - [String]: Either `"upVote"` or `"downVote"`.  |

| 13`PUT /comments/:id` | Edit the details of an existing comment. | **timestamp** - timestamp. Get this however you want. <br> **body** - [String] |

| 14`DELETE /comments/:id` | Sets a comment's deleted flag to `true`. | &nbsp; |
