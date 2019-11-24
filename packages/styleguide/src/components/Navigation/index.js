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

  const [activeLinks, setActiveLinks] = useState([]);

  const copyActiveLinks = depthLevel => {
    const activeLinksCopy = activeLinks.slice(0);

    for (let i = 0; i <= depthLevel; i += 1) {
      activeLinksCopy[i] = activeLinksCopy[i] || [];
    }

    return activeLinksCopy;
  };

  const updateActiveLinks = () => {
    const path = location.pathname;

    const pathArray = path.split('/').filter(e => String(e).trim());

    const activeLinksCopy = copyActiveLinks(pathArray.length - 1);

    pathArray.forEach((element, i) => {
      const elementPath = `/${element}`;
      if (activeLinksCopy[i].indexOf(elementPath) === -1) {
        activeLinksCopy[i] = [...activeLinksCopy[i], elementPath];
      }
    });

    return activeLinksCopy;
  };

  useEffect(
    () => {
      setActiveLinks(updateActiveLinks());
    },
    [location.pathname]
  );

  // eslint-disable-next-line class-methods-use-this
  const removeActive = (arr, element) => {
    return arr.filter(e => e !== element);
  };

  const handleClick = (activeLink, depthLevel) => {
    const activeLinksCopy = copyActiveLinks(depthLevel);

    if (activeLinksCopy[depthLevel].indexOf(activeLink) === -1) {
      activeLinksCopy[depthLevel].push(activeLink);
    } else {
      activeLinksCopy[depthLevel] = removeActive(
        activeLinksCopy[depthLevel],
        activeLink
      );
    }
    setActiveLinks(activeLinksCopy);
  };

  const isActive = (element, depthLevel) => {
    const activeLinks = copyActiveLinks(depthLevel);

    return Array.isArray(activeLinks) || activeLinks.length
      ? activeLinks[depthLevel].includes(element)
      : false;
  };

  const getNavList = (nodes = [], path = '', depthLevel = 0) => (
    <StyledNavList isMain={depthLevel === 0}>
      {nodes.map(node => {
        let item = null;
        let nestedList = null;

        if (node.nodes) {
          item = (
            <Category
              onClick={() => handleClick(node.path, depthLevel)}
              isActive={isActive(node.path, depthLevel)}
            >
              {node.title}
            </Category>
          );

          const depthLevelUpdated = depthLevel + 1;
          nestedList = getNavList(
            node.nodes,
            path + node.path,
            depthLevelUpdated
          );
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
