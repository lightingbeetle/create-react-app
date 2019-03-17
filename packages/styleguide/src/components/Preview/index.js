import React from 'react';
import './style';

import { ThemeConsumer } from 'styled-components';

import Preview from './Preview';
import Interact from './Interact';

const ThemedPreview = props => (
  <ThemeConsumer>
    {theme => <Preview bgThemeColors={theme.previewBackgrounds} {...props} />}
  </ThemeConsumer>
);

export default ThemedPreview;
export { Interact };
