import { HexColorPicker } from "react-colorful";
import React from "react";

export function ColorPicker({ value, onChange }) {  
    return <HexColorPicker color={value} onChange={onChange} style={{flexShrink: 0}} />;
  }