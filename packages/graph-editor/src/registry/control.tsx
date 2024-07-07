import {
  ANY,
  BOOLEAN,
  COLOR,
  CURVE,
  Input,
  NUMBER,
  Port,
  STRING,
  VEC2,
  VEC3,
} from '@tokens-studio/graph-engine';
import { AnyField } from '@/components/controls/any.js';
import { ArrayField } from '@/components/controls/array.js';
import { BooleanField } from '@/components/controls/boolean.js';
import { ColorField } from '@/components/controls/color.js';
import { CurveField } from '@/components/controls/curve.js';
import { DefaultField } from '@/components/controls/default.js';
import { EnumeratedTextfield } from '@/components/controls/enumerated.js';
import { NumericField } from '@/components/controls/numeric.js';
import { SliderField } from '@/components/controls/slider.js';
import { TextArea } from '@/components/controls/text.js';
import { Textfield } from '@/components/controls/string.js';
import { VariadicAny } from '@/components/controls/variadicAny.js';
import { VariadicColor } from '@/components/controls/variadicColor.js';
import { VariadicNumber } from '@/components/controls/variadicNumber.js';
import { Vec2field } from '@/components/controls/vec2.js';
import { Vec3field } from '@/components/controls/vec3.js';

export const variadicMatcher = (id) => (port: Port) =>
  port.type.type === 'array' &&
  port.type.items.$id === id &&
  (port as Input).variadic;

/**
 * Default controls for the graph editor
 */
export const defaultControls = [
  {
    matcher: (port: Port) => port.annotations['ui.control'] === 'slider',
    component: SliderField,
  },
  {
    matcher: (port: Port) => port.type.$id === CURVE,
    component: CurveField,
  },
  {
    matcher: (port: Port) => port.type.$id === BOOLEAN,
    component: BooleanField,
  },
  {
    matcher: (port: Port) => port.type.$id === COLOR,
    component: ColorField,
  },
  {
    matcher: (port: Port) => port.type.$id === NUMBER,
    component: NumericField,
  },
  {
    matcher: (port: Port) => port.type.$id === STRING && port.type.enum,
    component: EnumeratedTextfield,
  },
  {
    matcher: (port: Port) =>
      port.type.$id === STRING && port.annotations['ui.control'] === 'textarea',
    component: TextArea,
  },
  {
    matcher: (port: Port) => port.type.$id === STRING,
    component: Textfield,
  },
  {
    matcher: (port: Port) => port.type.$id === VEC2,
    component: Vec2field,
  },
  {
    matcher: (port: Port) => port.type.$id === VEC3,
    component: Vec3field,
  },
  {
    matcher: (port: Port) => port.type.$id === ANY,
    component: AnyField,
  },
  {
    matcher: (port: Port) =>
      port.type.type === 'array' && !(port as Input).variadic,
    component: ArrayField,
  },
  {
    matcher: variadicMatcher(NUMBER),
    component: VariadicNumber,
  },
  {
    matcher: variadicMatcher(COLOR),
    component: VariadicColor,
  },
  {
    matcher: variadicMatcher(ANY),
    component: VariadicAny,
  },
  {
    matcher: () => true,
    component: DefaultField,
  },
];
