import React from 'react';
import { oneOf, string } from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';

const propTypes = {
  title: string,
  /* variant influences set styles */
  variant: oneOf(['warning', 'success', 'error', 'info'])
};

const CLASS_ROOT = 'note';

/* Styles have to be on the top because of Tag and TagTitle */
const StyledNote = styled.div`
  font-family: ${props => props.theme.fontFamily};
  font-weight: ${props => props.theme.fontWeights.normal};
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.black};
  width: 100%;
  margin: 0 0 ${props => props.theme.spaces.medium};
  padding: ${props => props.theme.spaces.small}
    ${props => props.theme.spaces.medium};
  border-left-width: 2px;
  border-left-style: solid;
  border-left-color: ${props => props.theme.colors.greyDarker};
`;

const StyledTitle = styled.div`
  margin: 0 0 ${props => props.theme.spaces.small};
  color: ${props =>
    (props.variant === 'success' && props.theme.colors.success) ||
    (props.variant === 'warning' && props.theme.colors.warning) ||
    (props.variant === 'error' && props.theme.colors.error) ||
    (props.variant === 'info' && props.theme.colors.info) ||
    props.theme.colors.greyText};
  text-transform: uppercase;
  font-weight: 700;
`;

const Note = ({ className, children, title, variant, ...other }) => {
  const classes = cx(CLASS_ROOT, className);

  return (
    <StyledNote className={classes} variant={variant} {...other}>
      <StyledTitle variant={variant}>{title}</StyledTitle>
      {children}
    </StyledNote>
  );
};

Note.displayName = 'Note';
Note.propTypes = propTypes;

export default Note;
