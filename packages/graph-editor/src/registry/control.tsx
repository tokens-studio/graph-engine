import {
  ANY,
  BOOLEAN,
  COLOR,
  CURVE,
  DataFlowPort,
  FLOATCURVE,
  Input,
  NUMBER,
  STRING,
  VEC2,
} from '@tokens-studio/graph-engine';
import { AnyField } from '@/components/controls/any.js';
import { ArrayField } from '@/components/controls/array.js';
import { BooleanField } from '@/components/controls/boolean.js';
import { ColorField } from '@/components/controls/color.js';
import { CurveField } from '@/components/controls/curve.js';
import { DefaultField } from '@/components/controls/default.js';
import { EnumeratedTextfield } from '@/components/controls/enumerated.js';
import { FloatCurveField } from '@/components/controls/floatCurve.js';
import { NumericField } from '@/components/controls/numeric.js';
import { SliderField } from '@/components/controls/slider.js';
import { TextArea } from '@/components/controls/text.js';
import { Textfield } from '@/components/controls/string.js';
import { VariadicAny } from '@/components/controls/variadicAny.js';
import { VariadicColor } from '@/components/controls/variadicColor.js';
import { VariadicNumber } from '@/components/controls/variadicNumber.js';
import { Vec2field } from '@/components/controls/vec2.js';

export const variadicMatcher = (id) => (port: DataFlowPort) =>
  port.type.type === 'array' &&
  port.type.items.$id === id &&
  (port as Input).variadic;

/**
 * Default controls for the graph editor
 */
export const defaultControls = [
  {
    matcher: (port: DataFlowPort) => port.annotations['ui.control'] === 'slider',
    component: SliderField,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === FLOATCURVE,
    component: FloatCurveField,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === CURVE,
    component: CurveField,
  },

  {
    matcher: (port: DataFlowPort) => port.type.$id === BOOLEAN,
    component: BooleanField,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === COLOR,
    component: ColorField,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === NUMBER,
    component: NumericField,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === STRING && port.type.enum,
    component: EnumeratedTextfield,
  },
  {
    matcher: (port: DataFlowPort) =>
      port.type.$id === STRING && port.annotations['ui.control'] === 'textarea',
    component: TextArea,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === STRING,
    component: Textfield,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === VEC2,
    component: Vec2field,
  },
  {
    matcher: (port: DataFlowPort) => port.type.$id === ANY,
    component: AnyField,
  },
  {
    matcher: (port: DataFlowPort) =>
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
