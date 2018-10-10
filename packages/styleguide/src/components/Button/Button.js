import React from 'react';
import { oneOf } from 'prop-types';
import styled from 'styled-components';

import { rem } from './../../style/utils';

const propTypes = {
  variant: oneOf(['code-toggle'])
};

/* Styles have to be on the top because of Tag and TagTitle */
const StyledButton = styled.button`
  display: inline-block;
  min-height: ${rem(24)};
  margin-bottom: ${props => props.theme.spaces.small};
  padding: 0 ${props => props.theme.spaces.small};
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  appearance: none;
  border: 0px solid transparent;
  background: transparent;
  font-family: ${props => props.theme.fontFamily};
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.black};

  &.code-toggle {
    margin-bottom: 0;
    border-top-left-radius: ${props => props.theme.borderRadius.default};
    border-top-right-radius: ${props => props.theme.borderRadius.default};

    &:hover {
      background: ${props => props.theme.colors.grey};
    }

    &.is-active {
      background-color: ${props => props.theme.colors.black};
      color: ${props => props.theme.colors.white};
    }
  }

  .icon {
    margin-right: 1em;
    margin-top: -2px;
  }
`;

const Button = ({ children, variant, ...other }) => {
  return <StyledButton {...other}>{children}</StyledButton>;
};

Button.displayName = 'Button';
Button.propTypes = propTypes;

export default Button;
