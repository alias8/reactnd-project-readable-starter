import * as React from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/TopReducer';
import { ICategory, IComment, IPost, PageType } from '../types/types';
import { NavLink } from 'react-router-dom';
import { Component } from 'react';

interface IMappedProps {
    categories: ICategory[];
}

interface IState {

}

interface IOwnProps {

}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}>;

class TopNav extends Component<IProps, IState> {
    formLinksFromCategories() {
        let categoryLinks: any = [];
        categoryLinks.push(
            <NavLink
                className={'top-navlink'}
                to={`/`}
                exact={true}
                key={'all'}
                activeStyle={{
                    fontWeight: 'bold',
                    color: 'red'
                }}
            >{'All'.toUpperCase()}
            </NavLink>
        );

        this.props.categories.forEach((category, index) => (
            categoryLinks.push(
                <NavLink
                    className={'top-navlink'}
                    to={`/${category.name}`}
                    key={category.name}
                    activeStyle={{
                        fontWeight: 'bold',
                        color: 'red'
                    }}
                >{category.name.toUpperCase()}
                </NavLink>
            )
        ));
        return categoryLinks;
    }

    render() {
        return (
            <div>
                <div className={'top-navlink-container'}>
                    {this.formLinksFromCategories()}
                </div>
            </div>
        );
    }

}

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    categories: state.categories.categories,
});

export default connect(mapStateToProps)(TopNav);
