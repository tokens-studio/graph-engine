import { updateGraph } from "../../src/index.js";
import basic from "../data/raw/basic.json";
import expectedBasic from "../data/processed/basic.json";

describe("basic", () => {
  it("updates from 0.0.0 to 0.12.0 ", async () => {
    //@ts-ignore
    const result = await updateGraph(basic, { verbose: false });

    expect(result).toEqual(expectedBasic);
  });
});
