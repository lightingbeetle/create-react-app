import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { rem } from './../../style/utils';

const propTypes = {};

const CLASS_ROOT = 'sg-sidebar';

const Sidebar = ({ className, children, ...other }) => {
  const classes = cx(CLASS_ROOT, className);

  return (
    <StyledSidebar className={classes} {...other}>
      {children}
    </StyledSidebar>
  );
};

const StyledSidebar = styled.div`
  min-width: ${props => rem(props.theme.sizes.sidebarWidth)};
  background-color: ${props => props.theme.colors.white};
`;

Sidebar.displayName = 'Sidebar';
Sidebar.propTypes = propTypes;

export default Sidebar;
