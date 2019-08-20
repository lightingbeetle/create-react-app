import React from 'react';

import InteractContext from './state';

import PropLabelWithTooltip from './PropLabelWithTooltip';

import { cleanValue } from './helpers';

const PropSelect = ({ inputProps, componentInfo }) => {
  const { id, name } = componentInfo;

  return (
    <InteractContext.Consumer>
      {({ state, docgen, handleSelectChange }) => {
        const propInfo = docgen.liveProps[id][name];

        return (
          <React.Fragment>
            <PropLabelWithTooltip
              inputProps={inputProps}
              componentInfo={componentInfo}
            />
            <select
              {...inputProps}
              value={state.liveProps[id][name]}
              onChange={handleSelectChange}
            >
              <option value="null">None</option>
              {Object.values(propInfo.type.value).map((option, index) => {
                const optionValue = cleanValue(option.value);
                return (
                  <option key={index.toString()} value={optionValue}>
                    {optionValue}
                  </option>
                );
              })}
            </select>
          </React.Fragment>
        );
      }}
    </InteractContext.Consumer>
  );
};

export default PropSelect;
