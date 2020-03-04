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
});
