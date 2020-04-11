import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ColorPallete from '.';

const color = '#ff5722';
const colorWithShades = {
  100: '#fff',
  500: '#ff5722',
};

describe('ColorPallete', () => {
  it('should render color as string', () => {
    const { getByText } = render(<ColorPallete name="primary" color={color} />);
    expect(getByText('primary')).toBeInTheDocument();
    expect(getByText(color)).toBeInTheDocument();
  });

  it('should render color with shades', () => {
    const { getByText, getAllByRole } = render(
      <ColorPallete name="primary" color={colorWithShades} />
    );
    expect(getByText('primary')).toBeInTheDocument();
    expect(getAllByRole('button').length).toBe(
      Object.entries(colorWithShades).length
    );
  });

  it('should change shade on click', () => {
    const { getByText, getByRole } = render(
      <ColorPallete name="primary" color={colorWithShades} />
    );

    fireEvent.click(getByRole('button', { name: '100' }));

    expect(getByText(colorWithShades['100'])).toBeInTheDocument();
  });
});
