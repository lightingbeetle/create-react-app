import React, { useState } from 'react';
import { string, object, oneOfType } from 'prop-types';
import styled from 'styled-components';

import * as theme from './../../style/theme';

import Swatch from './Swatch';

const defaultShade = '500';

const ColorPalette = ({ children, name, color, ...other }) => {
  const [currentShade, setCurrentShade] = useState(getDefaultShade());

  function getDefaultShade() {
    if (typeof color === 'object') {
      let shade = defaultShade;
      if (!Object.prototype.hasOwnProperty.call(color, defaultShade)) {
        [shade] = Object.keys(color.value);
      }
      return shade;
    }

    return null;
  }

  function getBackroundColor(shade = currentShade) {
    if (shade) {
      return color[shade];
    }
    return color;
  }

  function handleColorChange(e, shade) {
    setCurrentShade(shade);
  }

  let swatches;
  if (typeof color === 'object') {
    swatches = Object.entries(color).map(([shade]) => (
      <Swatch
        key={shade}
        shade={shade}
        color={getBackroundColor(shade)}
        isActive={shade === currentShade}
        onClick={(e) => handleColorChange(e, shade)}
      />
    ));
  }

  return (
    <StyledColorPalette
      {...other}
      style={{ backgroundColor: getBackroundColor() }}
    >
      <StyledColorInfo>
        {name}&nbsp;
        {swatches ? (
          <>
            <div>{currentShade}</div>&nbsp;
            <div>{color[currentShade]}</div>
          </>
        ) : (
          <div>{color}</div>
        )}
      </StyledColorInfo>

      {swatches && (
        <StyledSwatches>
          <StyledSwatchSpacer />
          {swatches}
          <StyledSwatchSpacer />
        </StyledSwatches>
      )}
    </StyledColorPalette>
  );
};

ColorPalette.displayName = 'ColorPalette';

ColorPalette.propTypes = {
  /** 
   * Color could be string
   * ```js
"#ff5722"
   * ```
   * or object of multiple shades with shade number as key
   * ```js
{
  '300': "#ff6b6b",
  '500': "#fa5252",
}
   * ```
   */
  color: oneOfType([string, object]).isRequired,
  /** Name of the color */
  name: string.isRequired,
};

export default ColorPalette;

const StyledColorPalette = styled.div`
  position: relative;
  width: 100%;
  margin: 0;
  padding: 150px 0 0;
  list-style-type: none;
  transition: background ease-out 200ms;
  font-family: ${(props) => props.theme.fontFamily};

  &:last-of-type {
    margin-bottom: ${(props) => props.theme.spaces.default};
  }
`;

StyledColorPalette.defaultProps = {
  theme,
};

const StyledColorInfo = styled.div`
  position: absolute;
  top: ${(props) => props.theme.spaces.medium};
  left: ${(props) => props.theme.spaces.medium};
  display: inline-flex;
  background: white;
  padding: ${(props) => props.theme.spaces.tiny};
`;

StyledColorInfo.defaultProps = {
  theme,
};

const StyledSwatches = styled.div`
  display: flex;
  padding: ${(props) => props.theme.spaces.large} 0 0 0;
  overflow-x: auto;
  overflow-y: visible;
`;

StyledSwatches.defaultProps = {
  theme,
};

const StyledSwatchSpacer = styled.div`
  height: 1px;
  flex: 0 0 ${(props) => props.theme.spaces.medium};
`;

StyledSwatchSpacer.defaultProps = {
  theme,
};
