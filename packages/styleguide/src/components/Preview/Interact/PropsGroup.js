import React from 'react';
import styled from 'styled-components';

import InteractContext from './state';

import PropFormField from './PropFormField';

const PropsGroup = ({ id }) => (
  <InteractContext.Consumer>
    {({ state, props, docgen }) => {
      const statePropNames = Object.keys(docgen.liveProps[id]);
      const propCount = statePropNames.length;

      return (
        state.showProps[id] && (
          <StyledGroup>
            {propCount ? (
              statePropNames.map(name => {
                return props.filterProps.find(
                  filtered => filtered === name
                ) ? null : (
                  <PropFormField {...{ id, name }} />
                );
              })
            ) : (
              <p>There are no props to edit, try another component!</p>
            )}
          </StyledGroup>
        )
      );
    }}
  </InteractContext.Consumer>
);

const StyledGroup = styled.div`
  width: 90%;
  box-sizing: border-box;
  padding: ${props => props.theme.spaces.small};
  position: relative;
  margin-bottom: 0.5em;

  & > * + * {
    margin-top: 1em;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: -20px;
    left: -1px;
    height: 20px;
    width: 0;
  }
`;

export default PropsGroup;
