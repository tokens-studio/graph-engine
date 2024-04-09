import {
  BOOLEAN,
  COLOR,
  CURVE,
  NUMBER,
  STRING,
  SchemaObject,
  TOKEN_SET,
  VEC2,
  VEC3,
  ANY,
  TOKEN_ARRAY,
  TEXT,
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
import { TokenArrayField } from '@/components/controls/tokenArray';
import { TextArea } from '@/components/controls/text';

export const controls = [
  {
    matcher: (schema: SchemaObject) => schema.$id === CURVE,
    component: CurveField,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === BOOLEAN,
    component: BooleanField,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === COLOR,
    component: ColorField,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === NUMBER,
    component: NumericField,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === STRING && schema.enum,
    component: EnumeratedTextfield,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === TEXT,
    component: TextArea,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === STRING,
    component: Textfield,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === TOKEN_SET,
    component: DefaultField,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === TOKEN_SET,
    component: DefaultField,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === VEC2,
    component: Vec2field,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === VEC3,
    component: Vec3field,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === TOKEN_ARRAY,
    component: TokenArrayField,
  },
  {
    matcher: (schema: SchemaObject) => schema.$id === ANY,
    component: AnyField,
  },
  {
    matcher: () => true,
    component: DefaultField,
  },
];
