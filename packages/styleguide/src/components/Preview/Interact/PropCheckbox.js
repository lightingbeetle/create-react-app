import React from 'react';

import InteractContext from './state';

import Input from './Input';
import PropLabelWithTooltip from './PropLabelWithTooltip';

import { Bar, BarItem } from '../../Bar';

const PropCheckbox = ({ inputProps, componentInfo }) => {
  const { id, name } = componentInfo;

  return (
    <InteractContext.Consumer>
      {({ state, handleCheckboxChange }) => (
        <Bar>
          <BarItem>
            <Input
              {...inputProps}
              type="checkbox"
              checked={state.liveProps[id][name] ? 'checked' : false}
              onChange={handleCheckboxChange}
            />{' '}
          </BarItem>
          <BarItem>
            <PropLabelWithTooltip
              inputProps={inputProps}
              componentInfo={componentInfo}
            />
          </BarItem>
        </Bar>
      )}
    </InteractContext.Consumer>
  );
};

export default PropCheckbox;
