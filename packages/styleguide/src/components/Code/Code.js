import React, { Component } from 'react';
import { string, bool, oneOf } from 'prop-types';
import styled from 'styled-components';
import { stripUnit, em } from 'polished';

import Highlight, { defaultProps } from 'prism-react-renderer';
import 'prism-theme-one-dark/prism-onedark.css';
import 'firacode/distr/fira_code.css';

import { rem } from '../../style/utils';

export default class PreviewCode extends Component {
  static displayName = 'Code';

  static propTypes = {
    /** Code to highlight. */
    children: string,
    /** Suppored languages. */
    language: oneOf([
      'markup',
      'javascript',
      'jsx',
      'css',
      'scss',
      'bash',
      'json',
      'diff',
    ]),
    /** Inline code preview with text. */
    inline: bool,
  };

  static defaultProps = {
    children: '',
    inline: true,
    language: 'markup',
  };

  render() {
    const { children, language, inline } = this.props;

    if (!children) {
      return null;
    }

    const Tag = inline ? 'span' : 'div';

    return (
      <StyledHighlight
        {...defaultProps}
        code={children}
        language={language}
        theme={undefined}
      >
        {({ tokens, getLineProps, getTokenProps }) => {
          const highlight = tokens.map((line, i) => (
            <Tag {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </Tag>
          ));

          return inline ? (
            <code
              className={`code code--inline prism-code language-${language}`}
            >
              {highlight}
            </code>
          ) : (
            <StyledPre className={`prism-code language-${language}`}>
              {highlight}
            </StyledPre>
          );
        }}
      </StyledHighlight>
    );
  }
}

const StyledHighlight = styled(Highlight).attrs(props => ({
  className: `code language-${props.language}`,
}))`
  &[class*='language-'] {
    font-feature-settings: 'calt' 1;
    text-rendering: optimizeLegibility;

    font-family: 'Fira Code', monospace;
    font-size: ${props =>
      em(props.theme.fontSizes.small, props.theme.fontSizes.base)}
    line-height: ${props =>
      (stripUnit(props.theme.fontSizes.base) * props.theme.lineHeights.base) /
      stripUnit(props.theme.fontSizes.small)};
    white-space: pre-wrap;
    max-height: ${rem('300px')};
  }

  *:not(pre) > code&[class*='language-'] {
    padding: ${em(3.5)} ${em(5)};
    font-size: ${props =>
      em(props.theme.fontSizes.small, props.theme.fontSizes.base)}
  }
`;

const StyledPre = styled.pre`
  pre[class*='language-']& {
    margin: 0 0 ${props => rem(props.theme.spaces.medium)};
  }
`;
