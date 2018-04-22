This folder contains the frontend code, written in React with Redux and [Typescript](https://github.com/wmonk/create-react-app-typescript). It will require the server
to be running.

The marking criteria for this project did not require fancy CSS styling
which is why the CSS looks very basic.
This is more of a demonstration of how to use React with Redux.
In a real reddit-like app, we would not be storing posts and categories
in the store, and we would not allow editing and deleting of posts by
anyone.

Information such as categories and posts are stored in the Redux store,
and comments are stored as state variables. I have tried to put all
API requests that handle posts and categories in action creators
(using redux-thunk library). API requests that handle comments are
not inside action creators.


Instructions:
in the terminal, type:
1. `yarn` to install all the dependencies
2. `yarn start` to start the server and frontend. Keep this running in a terminal window
