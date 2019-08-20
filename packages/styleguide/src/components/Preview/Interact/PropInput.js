import React from 'react';

import { is } from './helpers';

import Input from './Input';
import PropLabelWithTooltip from './PropLabelWithTooltip';

import InteractContext from './state';

const PropInput = ({ type, isDisabled, inputProps, componentInfo }) => (
  <InteractContext.Consumer>
    {({ state, handleInputChange }) => {
      const { id, name } = componentInfo;
      let value = state.liveProps[id][name];

      return (
        <React.Fragment>
          <PropLabelWithTooltip
            isDisabled={isDisabled}
            inputProps={inputProps}
            componentInfo={componentInfo}
          />
          {isDisabled ? (
            <Input
              {...inputProps}
              disabled
              value={
                is(typeof value, 'object')
                  ? JSON.stringify(value)
                  : value.toString()
              }
            />
          ) : (
            <Input
              {...inputProps}
              value={value}
              onChange={e => {
                handleInputChange(type, e);
              }}
            />
          )}
        </React.Fragment>
      );
    }}
  </InteractContext.Consumer>
);

export default PropInput;
