import chroma from 'chroma-js';

const LIGHTNESS_MAP = [
    1, 0.907, 0.805, 0.697, 0.605, 0.547, 0.518, 0.445, 0.395, 0.34,
];
const SATURATION_MAP = [0.4, 0.16, 0.08, 0.04, 0, 0, 0.04, 0.08, 0.16, 0.32];

function getClosestLightness(colorObject: chroma.Color) {
    const lightnessGoal = colorObject.get('hsl.l');
    return LIGHTNESS_MAP.reduce(
        (prev: number, curr: number): number =>
            Math.abs(curr - lightnessGoal) < Math.abs(prev - lightnessGoal)
                ? curr
                : prev,
        LIGHTNESS_MAP[0]!,
    );
}

export function generateColorsMap(color: string) {
    const colorObject = chroma(color);
    const closestLightness = getClosestLightness(colorObject);
    const baseColorIndex = LIGHTNESS_MAP.findIndex(
        (l) => l === closestLightness,
    );

    const colors = LIGHTNESS_MAP.map((l) => colorObject.set('hsl.l', l))
        .map((c) => chroma(c))
        .map((c, i) => {
            const saturationDelta =
                (SATURATION_MAP[i] ?? 0) -
                (SATURATION_MAP[baseColorIndex] ?? 0);
            return saturationDelta >= 0
                ? c.saturate(saturationDelta)
                : c.desaturate(saturationDelta * -1);
        });

    return { baseColorIndex, colors };
}

export type MantineColorsTuple = readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    ...string[],
];

export function generateColors(color: string) {
    return generateColorsMap(color).colors.map((c) =>
        c.hex(),
    ) as unknown as MantineColorsTuple;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Remove the leading '#' if present
    let hexWithoutHash = hex.replace(/^#/, '');

    // Convert 3-digit hex to 6-digit hex
    if (hexWithoutHash.length === 3) {
        hexWithoutHash = hexWithoutHash
            .split('')
            .map((char) => char + char)
            .join('');
    }

    // Parse r, g, b values from the hex string
    const bigint = Number.parseInt(hexWithoutHash, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}
function lightenColor(
    r: number,
    g: number,
    b: number,
    percentage: number,
): { r: number; g: number; b: number } {
    const lightenValue = (component: number) =>
        Math.round(component + ((255 - component) * percentage) / 100);

    return {
        r: lightenValue(r),
        g: lightenValue(g),
        b: lightenValue(b),
    };
}
function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (component: number) =>
        component.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
export function lightenHexColor(hex: string, percentage: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return hex;
    }

    const lightenedRgb = lightenColor(rgb.r, rgb.g, rgb.b, percentage);
    return rgbToHex(lightenedRgb.r, lightenedRgb.g, lightenedRgb.b);
}
