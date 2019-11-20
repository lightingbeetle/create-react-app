import React from 'react';
import styled from 'styled-components';
import { bool } from 'prop-types';
import cx from 'classnames';

import { sizes } from '../../style/theme';

const propTypes = {
  isActive: bool,
};

let previousScrollPosition = window.pageYOffset;

window.onscroll = function() {
  const currentScrollPosition = window.pageYOffset;
  const navigationBar = document.querySelector('.navigation-bar');

  if (!navigationBar) {
    return;
  }

  if (
    previousScrollPosition > currentScrollPosition ||
    currentScrollPosition === 0
  ) {
    navigationBar.style.top = 0;
  } else {
    navigationBar.style.top = `-${sizes.headerHeight}`;
  }

  previousScrollPosition = currentScrollPosition;
};

const NavigationBar = ({ className, isActive, ...other }) => {
  const classes = cx({ 'is-active': isActive }, 'navigation-bar', className);

  return (
    <StyledMenuButtonWrapper className={classes} {...other}>
      <StyledMenuButton>
        <StyledButtonLine />
        <StyledButtonLine />
        <StyledButtonLine />
      </StyledMenuButton>
    </StyledMenuButtonWrapper>
  );
};

const StyledMenuButtonWrapper = styled.a`
  display: inline-block;
  position: fixed;
  width: 100%;
  top: 0;
  padding: ${props => props.theme.spaces.default};
  z-index: 100;
  background: ${props => props.theme.colors.white};
  transition: top 0.3s;

  &.is-active {
    > span {
      transform: rotate(180deg);
    }
    > span > span {
      opacity: 0;
      &:first-child {
        opacity: 1;
        transform: rotate(45deg);
      }
      &:last-child {
        opacity: 1;
        transform: rotate(-45deg);
      }
    }

    &:hover {
      > span > span {
        &:first-child,
        &:last-child {
          width: 25px;
        }
      }
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.l}) {
    display: none;
  }
`;

const StyledMenuButton = styled.span`
  width: 25px;
  height: 25px;
  position: relative;
  display: block;
  border: none;
  background-clip: padding-box;
  transition: transform 0.2s ease-in-out 0s;
  transform: rotate(0deg);

  &:hover {
    > span:first-child {
      transform: translateY(8px);
    }
    > span:last-child {
      transform: translateY(-8px);
    }
  }
`;

const StyledButtonLine = styled.span`
  display: block;
  width: 18px;
  height: 3px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.greyDark};
  transition: all 0.2s ease-in-out 0s;
  transition-property: transform, opacity, width;

  &:first-child {
    transform: translateY(6px);
  }

  &:last-child {
    transform: translateY(-6px);
  }
`;

NavigationBar.displayName = 'NavigationBar';
NavigationBar.propTypes = propTypes;

export default NavigationBar;
