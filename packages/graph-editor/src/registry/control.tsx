import {
  BOOLEAN,
  COLOR,
  CURVE,
  NUMBER,
  STRING,
  VEC2,
  VEC3,
  ANY,
  Port,
} from '@tokens-studio/graph-engine';
import { CurveField } from '@/components/controls/curve';
import { BooleanField } from '@/components/controls/boolean';
import { ColorField } from '@/components/controls/color';
import { NumericField } from '@/components/controls/numeric';
import { Textfield } from '@/components/controls/string';
import { EnumeratedTextfield } from '@/components/controls/enumerated';
import { DefaultField } from '@/components/controls/default';
import { AnyField } from '@/components/controls/any';
import { Vec2field } from '@/components/controls/vec2';
import { Vec3field } from '@/components/controls/vec3';
import { TextArea } from '@/components/controls/text';
import { SliderField } from '@/components/controls/slider';

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
    matcher: (port: Port) => port.type.$id === STRING && port.annotations['ui.control'] === 'textarea',
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
    matcher: () => true,
    component: DefaultField,
  },
];
