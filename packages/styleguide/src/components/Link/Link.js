import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';

const CLASS_ROOT = 'link';

/* Styles have to be on the top because of Tag and TagTitle */
const StyledLink = styled.a`
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.accent};
  line-height: ${props => props.theme.lineHeights.base};

  &:focus,
  &:hover {
    text-decoration: none;
  }
`;

const Link = ({ className, children, ...other }) => {
  const classes = cx(CLASS_ROOT, className);

  return (
    <StyledLink className={classes} {...other}>
      {children}
    </StyledLink>
  );
};

Link.displayName = 'Link';

export default Link;
