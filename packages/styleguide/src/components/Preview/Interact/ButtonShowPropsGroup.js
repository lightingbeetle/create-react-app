import React from 'react';

import Button from '../../Button';

import InteractContext from './state';

const ButtonShowPropsGroup = ({ id, componentName, deepness }) => (
  <InteractContext.Consumer>
    {({ handleShowProps, state }) => (
      <Button
        fontSize="base"
        onClick={e => {
          handleShowProps(e, id);
        }}
        style={{ paddingLeft: 0 }}
      >
        {deepness > 0 && '↳'} {componentName} {state.showProps[id] ? '▲' : '▼'}
      </Button>
    )}
  </InteractContext.Consumer>
);

export default ButtonShowPropsGroup;
