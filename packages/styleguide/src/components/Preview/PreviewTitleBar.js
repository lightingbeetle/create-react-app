import React from 'react';
import { string, array } from 'prop-types';
import cx from 'classnames';

import styled from 'styled-components';

import * as theme from './../../style/theme';

import { Bar, BarItem } from './../Bar';

const propTypes = {
  title: string,
  actions: array,
};

const CLASS_ROOT = '';

const PreviewTitleBar = ({ className, title, actions = [], ...other }) => {
  const classes = cx(CLASS_ROOT, className);

  return (
    <StyledBar className={classes} {...other}>
      <BarItem isFilling />
      {actions && (
        <BarItem>
          <Bar>
            {actions.map((action, actionIndex) => (
              <BarItem key={actionIndex}>{action}</BarItem>
            ))}
          </Bar>
        </BarItem>
      )}
    </StyledBar>
  );
};

PreviewTitleBar.displayName = 'PreviewTitleBar';
PreviewTitleBar.propTypes = propTypes;

const StyledBar = styled(Bar)`
  margin-bottom: ${(props) => props.theme.spaces.small};
`;

StyledBar.defaultProps = {
  theme,
};

export default PreviewTitleBar;
