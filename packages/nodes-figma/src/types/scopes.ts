export type FigmaScope =
  | "ALL_SCOPES"
  | "TEXT_CONTENT"
  | "CORNER_RADIUS"
  | "WIDTH_HEIGHT"
  | "GAP"
  | "ALL_FILLS"
  | "FRAME_FILL"
  | "SHAPE_FILL"
  | "TEXT_FILL"
  | "STROKE_COLOR"
  | "EFFECT_COLOR"
  | "STROKE_FLOAT"
  | "EFFECT_FLOAT"
  | "OPACITY"
  | "FONT_FAMILY"
  | "FONT_STYLE"
  | "FONT_WEIGHT"
  | "FONT_SIZE"
  | "LINE_HEIGHT"
  | "LETTER_SPACING"
  | "PARAGRAPH_SPACING"
  | "PARAGRAPH_INDENT";

export const FLOAT_SCOPES: FigmaScope[] = [
  "ALL_SCOPES",
  "TEXT_CONTENT",
  "CORNER_RADIUS",
  "WIDTH_HEIGHT",
  "GAP",
  "OPACITY",
  "STROKE_FLOAT",
  "EFFECT_FLOAT",
  "FONT_WEIGHT",
  "FONT_SIZE",
  "LINE_HEIGHT",
  "LETTER_SPACING",
  "PARAGRAPH_SPACING",
  "PARAGRAPH_INDENT",
];

export const COLOR_SCOPES: FigmaScope[] = [
  "ALL_SCOPES",
  "ALL_FILLS",
  "FRAME_FILL",
  "SHAPE_FILL",
  "TEXT_FILL",
  "STROKE_COLOR",
  "EFFECT_COLOR",
];

export const STRING_SCOPES: FigmaScope[] = [
  "ALL_SCOPES",
  "TEXT_CONTENT",
  "FONT_FAMILY",
  "FONT_STYLE",
];
