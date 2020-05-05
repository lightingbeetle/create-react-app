import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Preview from '.';

describe('rendering', () => {
  it('Preview', () => {
    const { getByText } = render(<Preview>Preview</Preview>);
    expect(getByText('Preview')).toBeInTheDocument();
  });

  it('HTML preview renders more than 1 child', () => {
    const { getByText, getByTestId } = render(
      <Preview>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </Preview>
    );

    fireEvent.click(getByText('SHOW CODE'));

    fireEvent.click(getByText('HTML'));

    expect(getByTestId('html')).toBeInTheDocument();
  });

  it('at least one tab is rendered by default', () => {
    const { queryAllByTestId, getByText } = render(<Preview>preview</Preview>);

    fireEvent.click(getByText('SHOW CODE'));

    const toggleButtons = queryAllByTestId('code-type-toggle');

    expect(toggleButtons).not.toHaveLength(0);
  });

  it('order of tabs is same as order of codeTypes', () => {
    const codeTypes = ['html', 'jsx'];

    const { queryAllByTestId, getByText } = render(
      <Preview codeTypes={codeTypes}>preview</Preview>
    );

    fireEvent.click(getByText('SHOW CODE'));

    const toggleButtons = queryAllByTestId('code-type-toggle');

    const buttonTypesArray = toggleButtons.map(button =>
      button?.innerHTML?.toLowerCase()
    );

    expect(buttonTypesArray).toEqual(codeTypes);
  });

  it('render only one tab when html property is set', () => {
    const { queryAllByTestId, getByText } = render(
      <Preview html={`<div>preview</div>`}>preview</Preview>
    );

    fireEvent.click(getByText('SHOW CODE'));

    const toggleButtons = queryAllByTestId('code-type-toggle');

    expect(toggleButtons).toHaveLength(1);
  });
});
