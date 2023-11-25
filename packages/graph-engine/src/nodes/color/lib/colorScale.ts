import Color from "colorjs.io";

export function createLightnessScale({baseColor, steps, min, max}: {
        baseColor: string;
        steps: number;
        min: number;
        max: number;
}) {
    const base = new Color(baseColor).to("oklch");
    const basecolorLightness = base.oklch.l;
    const numberOfSteps = steps;
    const lightnessStart = min / 100; // 10
    const lightnessEnd = max / 100; // 90
    let scale = [];
    const lightnessStep = (lightnessEnd - lightnessStart) / numberOfSteps; // 8
    let closestDistance = Infinity;
    let closestStepIndex = -1;

    for (let i = 0; i <= numberOfSteps; i++) {
        let targetLightness = lightnessStart + lightnessStep * i;
        const adjustedColor = base.clone();
        adjustedColor.oklch.l = targetLightness;
        const distanceToBaseLightness = Math.abs(adjustedColor.oklch.l - basecolorLightness);
        if (distanceToBaseLightness <= closestDistance) {
            closestDistance = distanceToBaseLightness;
            closestStepIndex = i; // Update the closest step index
        }
    }
    return closestStepIndex; // Return the closest step index
}

export function redistributeScale({closestStepIndex, baseColor, min, max, steps}) {
    const baseLightness = new Color(baseColor).oklch.l;
    const scale = [
        min / 100
    ]
    for (let i = 1; i < closestStepIndex - 1; i++) {
        const lightness = baseLightness - (closestStepIndex - i) * (baseLightness - min / 100) / closestStepIndex
        if (lightness > min / 100 && lightness > baseLightness) scale.push(lightness)
    }
    if (baseLightness > min || baseLightness < max) scale.push(baseLightness)
    for (let i = closestStepIndex + 1; i < steps; i++) {
        const lightness = baseLightness + (i - closestStepIndex) * (max / 100 - baseLightness) / (steps - closestStepIndex)
        if (lightness < max / 100) scale.push(lightness)
    }
    return  [...scale, max / 100]
}

export function generateScale({lightnessScale, baseColor, steps, min, max}: {
    lightnessScale: number[];
    baseColor: string;
    steps: number;
    min: number;
    max: number;
}) {

    const newScale = lightnessScale.map(lightness => {
        const color = new Color(baseColor)
        color.oklch.l = lightness
        return color.toString()
    })
    return newScale
    
}

export function scaleGenerator({baseColor, steps, min, max}: {
    baseColor: string;
    steps: number;
    min: number;
    max: number;
}) {
    const closestStepIndex = createLightnessScale({baseColor, steps, min, max})
    const redistributedScale = redistributeScale({closestStepIndex, baseColor, min, max, steps})
    const scale = generateScale({lightnessScale: redistributedScale, baseColor, steps, min, max})
    return {scale, closestStepIndex}
}


