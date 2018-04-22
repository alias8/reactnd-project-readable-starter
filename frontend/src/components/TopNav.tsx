import * as React from 'react';
import { connect, DispatchProp, MapStateToProps } from 'react-redux';
import { RootState } from '../reducers/TopReducer';
import { ICategory, ShouldDisplayTopNav, TemplateType } from '../types/types';
import { NavLink } from 'react-router-dom';

interface IMappedProps {
    categories: ICategory[];
}

interface IOwnProps {
    pageType: TemplateType
}

type IProps = IOwnProps & IMappedProps & DispatchProp<{}>;

export const TopNav: React.SFC<IProps> = (props) => {
    const formLinksFromCategories = () => {
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

        props.categories.forEach((category, index) => (
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
    };

    return ShouldDisplayTopNav[props.pageType] ? (
        <div>
            <div className={'top-navlink-container'}>
                {formLinksFromCategories()}
            </div>
        </div>
    ) : (
        <div/>
    );


};

const mapStateToProps: MapStateToProps<IMappedProps, IOwnProps, RootState> = (state: RootState, props: IProps) => ({
    categories: state.categories.categories,
});

export default connect(mapStateToProps)(TopNav);
