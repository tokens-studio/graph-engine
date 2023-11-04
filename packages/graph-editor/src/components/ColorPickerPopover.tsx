import { Box } from "@tokens-studio/ui";
import { ColorPicker } from "./ColorPicker";
import InputPopover from "./InputPopover";
import React from "react";

export function ColorPickerPopover({ value, onChange }) {
    return (
    <InputPopover trigger={<Box as="button" css={{all: 'unset', cursor: 'pointer', borderRadius: '$small', backgroundColor: value, width: 16, height: 16, border: '1px solid $borderMuted'}} type="button" />}>
      <ColorPicker value={value} onChange={onChange} />
      {value}
    </InputPopover>)
  }