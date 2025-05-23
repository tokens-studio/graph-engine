import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ColorField } from './color';
import { Input } from '@tokens-studio/graph-engine';

// Mock the graph engine utilities
jest.mock('@tokens-studio/graph-engine', () => ({
  Input: jest.fn(),
  toColor: jest.fn((color) => ({ to: () => ({ toString: () => color.hex || '#ff0000' }) })),
  toHex: jest.fn((color) => color.hex || '#ff0000'),
  hexToColor: jest.fn((hex) => ({ hex, space: 'srgb', channels: [1, 0, 0] })),
}));

// Mock the ColorPickerPopover component
jest.mock('../colorPicker/index.js', () => ({
  ColorPickerPopover: ({ value, textValue, onChange }) => (
    <div data-testid="color-picker-popover">
      <button 
        data-testid="color-ball" 
        style={{ background: value }}
        aria-label={`Color ball with value ${value}`}
      />
      <input 
        data-testid="color-input"
        value={textValue || value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

// Mock Redux selectors
jest.mock('@/redux/selectors/index.js', () => ({
  delayedUpdateSelector: (state) => state.ui.useDelayed,
}));

// Mock icons
jest.mock('@tokens-studio/icons/FloppyDisk.js', () => () => <div>Save</div>);

describe('ColorField', () => {
  const createMockStore = (useDelayed = false) => {
    return configureStore({
      reducer: {
        ui: (state = { useDelayed }, action) => state,
      },
    });
  };

  const createMockPort = (initialValue = { hex: '#ff0000' }) => {
    const port = {
      value: initialValue,
      setValue: jest.fn(),
    };
    return port;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show the same color in ball and input when delayed updates are disabled', () => {
    const store = createMockStore(false);
    const port = createMockPort();

    render(
      <Provider store={store}>
        <ColorField port={port} readOnly={false} />
      </Provider>
    );

    const colorBall = screen.getByTestId('color-ball');
    const colorInput = screen.getByTestId('color-input');

    expect(colorBall.style.background).toBe('#ff0000');
    expect(colorInput.value).toBe('#ff0000');
  });

  it('should show port value in color ball but allow different text input when delayed updates are enabled', () => {
    const store = createMockStore(true);
    const port = createMockPort({ hex: '#ff0000' });

    render(
      <Provider store={store}>
        <ColorField port={port} readOnly={false} />
      </Provider>
    );

    const colorBall = screen.getByTestId('color-ball');
    const colorInput = screen.getByTestId('color-input');

    // Initially both should show the port value
    expect(colorBall.style.background).toBe('#ff0000');
    expect(colorInput.value).toBe('#ff0000');

    // When user types a new hex value
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });

    // Color ball should still show the original port value (delayed update behavior)
    expect(colorBall.style.background).toBe('#ff0000');
    // But input should show the new value
    expect(colorInput.value).toBe('#00ff00');

    // Port setValue should not have been called yet (delayed)
    expect(port.setValue).not.toHaveBeenCalled();
  });

  it('should show save button when delayed updates are enabled', () => {
    const store = createMockStore(true);
    const port = createMockPort();

    render(
      <Provider store={store}>
        <ColorField port={port} readOnly={false} />
      </Provider>
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should not show save button when delayed updates are disabled', () => {
    const store = createMockStore(false);
    const port = createMockPort();

    render(
      <Provider store={store}>
        <ColorField port={port} readOnly={false} />
      </Provider>
    );

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('should update port value immediately when delayed updates are disabled', () => {
    const store = createMockStore(false);
    const port = createMockPort();

    render(
      <Provider store={store}>
        <ColorField port={port} readOnly={false} />
      </Provider>
    );

    const colorInput = screen.getByTestId('color-input');
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });

    // Port setValue should be called immediately
    expect(port.setValue).toHaveBeenCalledWith({ hex: '#00ff00', space: 'srgb', channels: [1, 0, 0] });
  });
});
