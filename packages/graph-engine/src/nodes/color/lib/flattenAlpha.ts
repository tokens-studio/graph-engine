import Color from "colorjs.io";

export function flattenAlpha(
  foreground: Color,
  background: Color,
) {

    // Decompose the foreground color to RGBA
    const [r1, g1, b1] = foreground.to('srgb').coords;  // Default alpha to 1 if undefined
    const a1 = foreground.alpha || 1;

    if (a1 === 1) {
        // If alpha is 1, output the foreground color directly
        this.setOutput("value", foreground.toString({ format: 'hex' }));
    } else {
        // Decompose the background color to RGB (assume opaque)
        const [r2, g2, b2] = background.to('srgb').coords;

        // Perform alpha blending formula
        const alpha = 1 - a1;
        const r = r2 * alpha + r1 * a1;
        const g = g1 * a1 + g2 * alpha;
        const b = b1 * a1 + b2 * alpha;

        // Convert blended color back to Color object and then to hex string
        const resultColor = new Color("sRGB", [r, g, b]);
        return resultColor.to('srgb') as Color;
    }
}