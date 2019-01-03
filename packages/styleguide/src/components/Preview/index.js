import React from 'react';
import './style';

import { ThemeConsumer } from 'styled-components';

import Preview from './Preview';

export default props => (
  <ThemeConsumer>
    {theme => <Preview bgThemeColors={theme.previewBackgrounds} {...props} />}
  </ThemeConsumer>
);
