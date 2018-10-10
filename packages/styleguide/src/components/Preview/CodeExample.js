import React from 'react';
import { object, arrayOf, oneOf } from 'prop-types';

import styled from 'styled-components';

import unescape from 'unescape-html';
import reactElementToJSXString from 'react-element-to-jsx-string';
import pretty from 'pretty';
import { renderToStaticMarkup } from 'react-dom/server';

import { CodeBlock } from '../Code/';

import { ButtonBaseCSS } from '../../style/common';

const getJSXAsStringFromMarkup = (markup, options) => {
  const reactElementToJSXStringOptions = {
    ...options,
    showFunctions: true,
    functionValue: () => ''
  };

  // valid element can be passed to reactElementToJSXString directly
  if (React.isValidElement(markup)) {
    return reactElementToJSXString(markup, reactElementToJSXStringOptions);
  }

  // if it's array, we need to pass elemenets one by one
  if (Array.isArray(markup)) {
    return markup
      .map(markupItem =>
        reactElementToJSXString(markupItem, reactElementToJSXStringOptions)
      )
      .join('\n');
  }

  return '';
};

export default class CodeExample extends React.Component {
  static displayName = 'CodeExample';

  static propTypes = {
    codeJSXOptions: object,
    codeTypes: arrayOf(oneOf(['jsx', 'html']))
  };

  static defaultProps = {
    codeTypes: ['jsx', 'html']
  };

  state = {
    codePreviewType: this.props.codeTypes && this.props.codeTypes[0],
    copyButtonText: 'Copy to clipboard'
  };

  handleCodePreviewTypeToggle(e, type) {
    this.setState({
      codePreviewType: type
    });
  }

  handleCopyCode(e, selector) {
    const selection = window.getSelection();
    const range = document.createRange();
    const element = document.querySelector(selector);
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);

    const button = e.target;
    let newText = 'Copied!';
    let newClass = 'success';

    try {
      document.execCommand('copy');
      // selection.removeAllRanges();
    } catch (e) {
      newText = 'Error! Press Ctrl + C';
      newClass = 'error';
    }

    button.classList.add(newClass);

    const original = this.state.copyButtonText;

    this.setState(
      {
        copyButtonText: newText
      },
      () => {
        setTimeout(() => {
          this.setState({
            copyButtonText: original
          });
          button.classList.remove(newClass);
        }, 1200);
      }
    );
  }

  render() {
    const { children, codeJSXOptions, codeTypes, ...other } = this.props;

    let codeToShow;
    switch (this.state.codePreviewType) {
      case 'html':
        codeToShow = pretty(
          typeof children === 'string'
            ? unescape(children)
            : renderToStaticMarkup(children),
          {
            ocd: true
          }
        );
        break;
      case 'jsx':
        codeToShow = getJSXAsStringFromMarkup(children, codeJSXOptions);
        break;
      default:
        codeToShow = '';
    }

    return (
      <StyledWrapper {...other}>
        {codeTypes.map(codeType => (
          <StyledCodeTypeToggle
            key={codeType}
            role="button"
            onClick={e => this.handleCodePreviewTypeToggle(e, codeType)}
            className={this.state.codePreviewType === codeType && 'is-active'}
          >
            {codeType.toUpperCase()}
          </StyledCodeTypeToggle>
        ))}
        <StyledCopyButton onClick={e => this.handleCopyCode(e, '#code-block')}>
          {this.state.copyButtonText}
        </StyledCopyButton>
        <CodeBlock id="code-block" language={this.state.codePreviewType}>
          {codeToShow}
        </CodeBlock>
      </StyledWrapper>
    );
  }
}

const StyledCopyButton = styled.button`
  ${ButtonBaseCSS};

  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(100%);
  margin-bottom: 0;

  background: ${props => props.theme.colors.white};

  &:hover {
    background: ${props => props.theme.colors.grey};
  }

  &.success {
    background: ${props => props.theme.colors.success};
  }
`;

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledCodeTypeToggle = styled.button`
  ${ButtonBaseCSS};

  margin-bottom: 0;
  border-top-left-radius: ${props => props.theme.borderRadius.default};
  border-top-right-radius: ${props => props.theme.borderRadius.default};

  &:hover {
    background: ${props => props.theme.colors.grey};
  }

  &.is-active {
    background-color: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
  }
`;
