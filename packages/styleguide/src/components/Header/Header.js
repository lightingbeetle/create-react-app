import React from 'react';
import styled, { withTheme } from 'styled-components';
import { string, node, object } from 'prop-types';
import cx from 'classnames';
import MediaQuery from 'react-responsive';
import { NavLink as Link } from 'react-router-dom';

import { Bar, BarItem } from './../Bar';

import { rem } from '../../style/utils';

const CLASS_ROOT = 'sg-header';

const propTypes = {
  pageTitle: string,
  project: node,
  projectSmall: node,
  infoText: node,
  theme: object
};

const Header = ({
  className,
  pageTitle,
  project,
  projectSmall,
  infoText,
  children,
  theme,
  ...other
}) => {
  const classes = cx(CLASS_ROOT, className);

  const getLogo = matches => (
    <StyledLink to="/">{matches ? project : projectSmall}</StyledLink>
  );

  return (
    <StyledBar className={classes} {...other}>
      <BarItem shrink>{children}</BarItem>
      <BarItem isFilling shrink>
        <MediaQuery minDeviceWidth={theme.breakpoints.m}>
          {matches =>
            typeof project === 'string' ? (
              <StyledProjectText>{getLogo(matches)}</StyledProjectText>
            ) : (
              <StyledProjectLogo>{getLogo(matches)}</StyledProjectLogo>
            )
          }
        </MediaQuery>
      </BarItem>
      <StyledProjectInfo>{infoText}</StyledProjectInfo>
    </StyledBar>
  );
};

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.black};
  text-decoration: none;

  &:visited {
    ${props => props.theme.colors.black};
  }
`;

const StyledBar = styled(Bar)`
  font-family: ${props => props.theme.fontFamily};
`;

const StyledProjectText = styled('div')`
  font-size: ${rem(24)};
  font-weight: 700;

  @media (min-width: ${props => props.theme.breakpoints.s}) {
    font-size: ${rem(36)};
  }
`;

const StyledProjectLogo = styled('div')`
  img {
    height: ${rem(35)};
    margin-bottom: ${props => rem(props.theme.spaces.tiny)};

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      height: ${rem(50)};
      margin-bottom: 0;
    }
  }
`;

const StyledProjectInfo = styled(BarItem)`
  color: ${props => props.theme.colors.greyText};
  font-size: ${rem(12)};
`;

Header.displayName = 'Header';
Header.propTypes = propTypes;

export default withTheme(Header);
