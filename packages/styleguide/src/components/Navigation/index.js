import React, { useState, useEffect } from 'react';
import { array, bool, func } from 'prop-types';
import cx from 'classnames';
import styled from 'styled-components';

import { withRouter, useLocation } from 'react-router-dom';

import { rem } from './../../style/utils';

import Search from './../Search';
import Category from './Category';
import NavLink from './NavLink';

const CLASS_ROOT = 'sg-nav';

const Navigation = ({
  className,
  routes = [],
  isMain,
  onNavLinkClick,
  ...other
}) => {
  const classes = cx(CLASS_ROOT, className);
  let location = useLocation();

  const [activeCategories, setActiveCategories] = useState({});

  /**
   * Set category active state
   */
  const setCategoryActiveState = (id, value = true) => {
    setActiveCategories({
      ...activeCategories,
      [id]: value,
    });
  };

  /**
   * This method sets every category active state
   * from first parent to current category to true
   */
  const setActiveCategoriesFromPathname = () => {
    let id = '';
    const l = location.pathname;
    const categories = l
      .substring(1, l.lastIndexOf('/'))
      .split('/')
      .reduce((acc, curr) => {
        id += '/' + curr;
        return { ...acc, [id]: true };
      }, {});
    setActiveCategories({ ...activeCategories, ...categories });
  };

  useEffect(
    () => {
      setActiveCategoriesFromPathname();
    },
    [location.pathname]
  );

  const getNavList = (nodes = [], path = '') => (
    <StyledNavList isMain={path === ''}>
      {nodes.map(node => {
        let item = null;
        let nestedList = null;

        if (node.nodes) {
          const id = path + node.path;
          item = (
            <Category
              onClick={() => {
                setCategoryActiveState(id, !activeCategories[id]);
              }}
              isActive={activeCategories[id]}
            >
              {node.title}
            </Category>
          );

          nestedList = getNavList(node.nodes, path + node.path);
        } else {
          item = (
            <NavLink href={path + node.path} onClick={onNavLinkClick}>
              {node.title}
            </NavLink>
          );
        }

        return (
          <ListItem key={path + node.path}>
            {item}
            {nestedList}
          </ListItem>
        );
      })}
    </StyledNavList>
  );

  // div has to wrapp Nav because of nice layout
  return (
    <StyledNav className={classes} {...other}>
      <Search list={routes} />
      {getNavList(routes)}
    </StyledNav>
  );
};

Navigation.displayName = 'Navigation';

Navigation.propTypes = {
  isMain: bool,
  routes: array,
  onNavLinkClick: func,
};

const StyledNav = styled.nav`
  width: ${props => rem(props.theme.sizes.menuWidth)};
  box-sizing: content-box;
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => rem(props.theme.fontSizes.base)};
  line-height: ${props => props.theme.lineHeights.base};

  padding: ${props => rem(props.theme.spaces.default)}
    ${props => rem(props.theme.spaces.medium)}
    ${props => rem(props.theme.spaces.medium)};
`;

const StyledNavList = styled.ul`
  max-height: ${props => (props.isMain ? '100%' : '0')};
  overflow: ${props => (props.isMain ? 'visible' : 'hidden')};
  padding: 0;
  box-shadow: ${props =>
    props.isMain ? 'none' : '-2px 0px 0px 0px rgba(0,0,0,0.1)'};
  list-style: none;
  font-weight: 700;
  transition: max-height 0.1s cubic-bezier(0, 1, 0.01, 0.98) 0s,
    padding 0.25s cubic-bezier(0, 1, 0.01, 0.98) 0s;
`;

const ListItem = styled.li`
  margin: 0 0 0 ${props => rem(props.theme.spaces.medium)};
`;

export default withRouter(
  ({ location, match, history, staticContext, ...other }) => (
    <Navigation {...other} />
  )
);
