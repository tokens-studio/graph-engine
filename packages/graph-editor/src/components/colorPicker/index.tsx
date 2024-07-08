import { Box, Button, Select, TextInput } from '@tokens-studio/ui';
import { PopoverClose } from '@radix-ui/react-popover';
import { styled } from '@/lib/stitches/index.js';
import { toColor, toColorObject } from '@tokens-studio/graph-engine';
import Color from 'colorjs.io';
import InputPopover from './InputPopover.js';
import React, { useEffect, useState } from 'react';

type ColorPickerProps = {
  value: Color;
  onChange: (value: Color) => void;
};

type ColorPickerPopoverProps = ColorPickerProps & {
  defaultOpen?: boolean;
  showRemoveButton?: boolean;
  onRemove?: () => void;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [spaceId, setSpaceId] = useState('lch');
  const [coords, setCoords] = useState<number[]>([0, 0, 0]);
  const [alpha, setAlpha] = useState(100);

  useEffect(() => {

    console.log('line27:', value);
    try {
      const color = toColor(value);
      console.log('line30:', color);
      const converted = color.to(spaceId);
      setCoords(converted.coords);
      setAlpha(converted.alpha * 100);
    } catch (e) {
      console.error('Invalid color value:', e);
    }
  }, [value, spaceId]);

  const handleCoordChange = (index: number, newValue: number) => {
    const newCoords = [...coords];
    newCoords[index] = newValue;
    setCoords(newCoords);
    updateColor(newCoords, alpha);
  };

  const handleAlphaChange = (newAlpha: number) => {
    setAlpha(newAlpha);
    updateColor(coords, newAlpha);
  };

  const updateColor = (newCoords: number[], newAlpha: number) => {
    const newColor = new Color(spaceId, newCoords, newAlpha / 100);
    console.log('newColor:', newColor);
    onChange(toColorObject(newColor));
  };

  const handleSpaceChange = (newSpaceId) => {
    const currentColor = new Color(spaceId, coords, alpha / 100);
    const convertedColor = currentColor.to(newSpaceId);
    setSpaceId(newSpaceId);
    setCoords(convertedColor.coords);
    onChange(toColorObject(convertedColor));
  };

  const getSliderBackground = (index: number) => {
    const steps = 10;
    const gradientStops:string[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const stepCoords = [...coords];
      const coordMeta = currentSpace.coords[Object.keys(currentSpace.coords)[index]];
      const min = coordMeta.min ?? 0;
      const max = coordMeta.max ?? 100;
      stepCoords[index] = min + (i / steps) * (max - min);
      const stepColor = new Color(spaceId, stepCoords, alpha / 100).to("srgb");
      gradientStops.push(`${stepColor} ${(i / steps) * 100}%`);
    }

    return `linear-gradient(to right, ${gradientStops.join(', ')})`;
  };

  const getAlphaSliderBackground = () => {
    const baseColor = new Color(spaceId, coords, 1).to("srgb");
    const alphaColor = new Color(spaceId, coords, 0).to("srgb");
    return `linear-gradient(to right, ${alphaColor} 0%, ${baseColor} 100%)`;
  };

  const colorSpaces = Color.Space.all;
  const currentSpace = Color.Space.get(spaceId);

  return (
    <ColorPickerWrapper>
      <Select value={spaceId} onValueChange={handleSpaceChange}>
        <Select.Trigger label="space" value={spaceId} />
        <Select.Content>
          {colorSpaces.map((space) => (
            <Select.Item key={space.id} value={space.id}>
              {space.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      {coords.map((coord, index) => {
        const coordMeta = currentSpace.coords[Object.keys(currentSpace.coords)[index]];
        const min = coordMeta.min ?? 0;
        const max = coordMeta.max ?? 100;
        return (
          <CoordWrapper key={index}>
            <CoordLabel>{coordMeta.name || `Coordinate ${index + 1}`}</CoordLabel>
            <CoordInputWrapper>
              <CoordInput
                type="range"
                min={min}
                max={max}
                step={(max - min) / 100}
                value={coord}
                onChange={(e) => handleCoordChange(index, Number(e.target.value))}
                style={{background: getSliderBackground(index)}}
              />
            </CoordInputWrapper>
            <CoordValue>{coord.toFixed(2)}</CoordValue>
          </CoordWrapper>
        );
      })}
      <CoordWrapper>
        <CoordLabel>Alpha</CoordLabel>
        <CoordInputWrapper>
          <CoordInput
            type="range"
            min={0}
            max={100}
            value={alpha}
            onChange={(e) => handleAlphaChange(Number(e.target.value))}
            style={{background: getAlphaSliderBackground()}}
          />
        </CoordInputWrapper>
        <CoordValue>{(alpha / 100).toFixed(2)}</CoordValue>
      </CoordWrapper>
      <ColorPreview style={{ backgroundColor: new Color(spaceId, coords, alpha / 100).to("srgb").toString() }} />
    </ColorPickerWrapper>
  );
};

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  value,
  defaultOpen = false,
  onChange,
  showRemoveButton = false,
  onRemove,
}) => {
  return (
    <InputPopover
      defaultOpen={defaultOpen}
      trigger={
        <ColorTrigger
          as="button"
          style={{ background: value }}
          type="button"
        />
      }
    >
      <ColorPicker value={value} onChange={onChange} />
      <TextInput
        value={value ? value.toString() : ''}
        onChange={(event) => onChange(event.target.value)}
      />
      {showRemoveButton && (
        <PopoverCloseRemoveButton>
          <Button onClick={onRemove} variant="danger">
            Remove color
          </Button>
        </PopoverCloseRemoveButton>
      )}
    </InputPopover>
  );
};

const ColorPickerWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  padding: '$3',
});

const CoordWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
});

const CoordLabel = styled('span', {
  minWidth: '80px',
});

const CoordInputWrapper = styled('div', {
  flex: 1,
  position: 'relative',
});

const CoordInput = styled('input', {
  width: '100%',
  WebkitAppearance: 'none',
  appearance: 'none',
  height: '10px',
  borderRadius: '5px',
  outline: 'none',
  opacity: '0.7',
  transition: 'opacity .2s',
  '&:hover': {
    opacity: '1',
  },
  '&::-webkit-slider-thumb': {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'white',
    cursor: 'pointer',
    border: '2px solid #444',
  },
  '&::-moz-range-thumb': {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'white',
    cursor: 'pointer',
    border: '2px solid #444',
  },
});

const CoordValue = styled('span', {
  minWidth: '50px',
  textAlign: 'right',
});

const ColorPreview = styled('div', {
  width: '100%',
  height: '30px',
  borderRadius: '$small',
  marginTop: '$2',
});

const ColorTrigger = styled(Box, {
  all: 'unset',
  cursor: 'pointer',
  borderRadius: '$small',
  width: 26,
  height: 26,
  outline: '1px solid $borderDefault',
  flexShrink: 0,
  '&:hover': {
    outline: '1px solid $borderDefault',
  },
});

const PopoverCloseRemoveButton = styled(PopoverClose, {
  all: 'unset',
  margin: '$3',
});

export default ColorPickerPopover;