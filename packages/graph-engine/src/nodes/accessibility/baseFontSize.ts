/**
 * Calculates the base font size
 *
 * @packageDocumentation
 */
import { Node } from "@/programmatic/node/index.js";
import { NodeDefinition, NodeTypes, Type } from "../../types.js";
import { Input } from "@/programmatic/input/index.js";
import z from 'zod';
import { Output } from "@/programmatic/output/index.js";
;


const NumberSchema = z.number();

class BaseFontsizeNode extends Node {
  type = NodeTypes.BASE_FONT_SIZE;
  description: "Base Font node allows you to calculate the base font size with DIN 1450.";

  inputs = {
    visualAcuity: new Input<typeof NumberSchema>({
      type: NumberSchema,
      defaultValue: 0.7,
    }),
    correctionFactor: new Input<typeof NumberSchema>({
      type: NumberSchema,
      defaultValue: 13,
    }),
    lightingCondition: new Input<typeof NumberSchema>({
      type: NumberSchema,
      defaultValue: 0.83,
    }),
    distance: new Input<typeof NumberSchema>({
      type: NumberSchema,
      defaultValue: 30,
    }),
    xHeightRatio: new Input<typeof NumberSchema>({
      type: NumberSchema,
      defaultValue: 0.53,
    }),
    ppi: new Input<typeof NumberSchema>({
      type: NumberSchema,
      defaultValue: 458,
    }),
    pixelDensity: new Input<typeof NumberSchema>({
      type: NumberSchema,
      defaultValue: 3,
    }),
  }
  outputs = {
    output: new Output<typeof NumberSchema>({
      type: NumberSchema,
      description: "The generated font size"
    })
  }

  process(): void {


    const {
      visualAcuity,
      lightingCondition,
      distance,
      xHeightRatio,
      ppi,
      pixelDensity,
      correctionFactor,
    } = this.getAllInputs();

    const visualCorrection =
      correctionFactor * (lightingCondition / visualAcuity);
    const xHeightMM =
      Math.tan((visualCorrection * Math.PI) / 21600) * (distance * 10) * 2;
    const xHeightPX = (xHeightMM / 25.4) * (ppi / pixelDensity);
    // const fontSizePT = (2.83465 * xHeightMM * 1) / xHeightRatio;
    const fontSizePX = (1 * xHeightPX) / xHeightRatio;

    this.outputs.output.set(fontSizePX);
  }
}

