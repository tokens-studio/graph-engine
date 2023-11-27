import { createLightnessScale, generateScale, redistributeScale, scaleGenerator } from "#/nodes/color/lib/colorScale.js";

describe("colorScale2", () => {
  it("SHOULD RETURN a cool function", async () => {
    const input = {
     baseColor: '#ffffff',
     steps: 10,
     min: 0,
     max: 100
    };

    
    
    const closestStepIndex = createLightnessScale(input);
    expect(closestStepIndex).toEqual(10);
    const redistr = redistributeScale({closestStepIndex, baseColor: input.baseColor, min: input.min, max: input.max, steps: input.steps})
    expect(redistr).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    }
    );
}
);