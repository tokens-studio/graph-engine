module.exports = {
  // Color mappings
  colors: {
    $accentBg: "var(--color-accent-surface-minimal-idle-bg)",
    $accentBorder: "var(--color-accent-stroke-base)",
    $accentDefault: "var(--color-accent-surface-base-idle-fg-default)",
    $accentEmphasis: "var(--color-accent-surface-heavy-idle-bg)",
    $accentMuted: "var(--color-accent-surface-base-idle-fg-subtle)",
    $accentOnAccent: "var(--color-accent-surface-base-idle-fg-default)",
    $bgCanvas: "var(--color-neutral-canvas-minimal-bg)",
    $bgDefault: "var(--color-neutral-canvas-default-bg)",
    $bgEmphasis: "var(--color-neutral-canvas-minimal-bg)",
    $bgSubtle: "var(--color-neutral-canvas-subtle-bg)",
    $bgSurface: "var(--color-neutral-canvas-default-bg)",
    $borderDefault: "var(--color-neutral-stroke-default)",
    $borderMuted: "var(--color-neutral-stroke-subtle)",
    $borderSubtle: "var(--color-neutral-stroke-subtle)",
    $buttonPrimaryBgHover: "var(--color-accent-surface-base-hover-bg)",
    $buttonPrimaryBgRest: "var(--color-accent-surface-base-idle-bg)",
    $buttonPrimaryBorderRest: "transparent",
    $buttonPrimaryFg: "var(--color-accent-surface-base-idle-fg-default)",
    $buttonPrimaryMuted: "var(--color-accent-surface-base-idle-fg-subtle)",
    $buttonSecondaryBgHover: "var(--color-neutral-surface-subtle-hover-bg)",
    $buttonSecondaryBgRest: "var(--color-neutral-surface-subtle-idle-bg)",
    $buttonSecondaryBorderRest: "",
    $buttonSecondaryFg: "var(--color-neutral-surface-subtle-idle-fg-default)",
    $dangerBg: "var(--color-danger-surface-base-idle-bg)",
    $dangerBorder: "var(--color-danger-stroke-base)",
    $dangerFg: "var(--color-danger-surface-base-idle-fg-default)",
    $fgDefault: "var(--color-neutral-canvas-default-fg-default)",
    $fgDisabled: "var(--color-neutral-canvas-default-fg-subtle)",
    $fgMuted: "var(--color-neutral-canvas-default-fg-subtle)",
    $fgOnEmphasis: "var(--color-neutral-canvas-minimal-fg-default)",
    $fgSubtle: "var(--color-neutral-canvas-subtle-fg-subtle)",
    $focus: "var(--color-accent-surface-base-idle-bg)",
    $interactionBg: "var(--color-accent-surface-base-idle-bg)",
    $interactionHandle: "var(--color-accent-surface-base-idle-fg-default)",
    $interactionHandleInactive: "var(--color-neutral-canvas-default-fg-subtle)",
    $modalBackdrop: "rgba(30, 30, 30, 0.75)",
    $shadowDefault: "rgba(0, 0, 0, 0.05)",
    $successBg: "var(--color-success-surface-base-idle-bg)",
    $successBorder: "var(--color-success-stroke-base)",
    $successFg: "var(--color-success-surface-base-idle-fg-default)",
    "var(--color-bgDefault)": "var(--color-neutral-canvas-default-bg)",
    "var(--color-fgMuted)": "var(--color-neutral-canvas-default-fg-subtle)",
    "var(--color-accentBg)": "var(--color-accent-surface-base-idle-bg)",
    "var(--color-accentBorder)": "var(--color-accent-stroke-base)",
    "var(--color-accentDefault)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--color-accentEmphasis)": "var(--color-accent-surface-heavy-idle-bg)",
    "var(--color-accentMuted)": "var(--color-accent-surface-base-idle-fg-subtle)",
    "var(--color-accentOnAccent)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--color-bgCanvas)": "var(--color-neutral-canvas-minimal-bg)",
    "var(--color-bgEmphasis)": "var(--color-neutral-canvas-minimal-bg)",
    "var(--color-bgSubtle)": "var(--color-neutral-canvas-subtle-bg)",
    "var(--color-bgSurface)": "var(--color-neutral-canvas-default-bg)",
    "var(--color-borderDefault)": "var(--color-neutral-stroke-default)",
    "var(--color-borderMuted)": "var(--color-neutral-stroke-subtle)",
    "var(--color-borderSubtle)": "var(--color-neutral-stroke-subtle)",
    "var(--color-buttonPrimaryBgHover)":
      "var(--color-accent-surface-base-hover-bg)",
    "var(--color-buttonPrimaryBgRest)":
      "var(--color-accent-surface-base-idle-bg)",
    "var(--color-buttonPrimaryBorderRest)": "transparent",
    "var(--color-buttonPrimaryFg)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--color-buttonPrimaryMuted)":
      "var(--color-accent-surface-base-idle-fg-subtle)",
    "var(--color-buttonSecondaryBgHover)":
      "var(--color-neutral-surface-subtle-hover-bg)",
    "var(--color-buttonSecondaryBgRest)":
      "var(--color-neutral-surface-subtle-idle-bg)",
    "var(--color-buttonSecondaryBorderRest)": "",
    "var(--color-buttonSecondaryFg)":
      "var(--color-neutral-surface-subtle-idle-fg-default)",
    "var(--color-dangerBg)": "var(--color-danger-surface-base-idle-bg)",
    "var(--color-dangerBorder)": "var(--color-danger-stroke-base)",
    "var(--color-dangerFg)": "var(--color-danger-surface-base-idle-fg-default)",
    "var(--color-fgDefault)": "var(--color-neutral-canvas-default-fg-default)",
    "var(--color-fgDisabled)": "var(--color-neutral-canvas-default-fg-subtle)",
    "var(--color-fgOnEmphasis)": "var(--color-neutral-canvas-minimal-fg-default)",
    "var(--color-fgSubtle)": "var(--color-neutral-canvas-subtle-fg-subtle)",
    "var(--color-focus)": "var(--color-accent-surface-base-idle-bg)",
    "var(--color-interactionBg)": "var(--color-accent-surface-base-idle-bg)",
    "var(--color-interactionHandle)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--color-interactionHandleInactive)":
      "var(--color-neutral-canvas-default-fg-subtle)",
    "var(--color-modalBackdrop)": "rgba(30, 30, 30, 0.75)",
    "var(--color-shadowDefault)": "rgba(0, 0, 0, 0.05)",
    "var(--color-successBg)": "var(--color-success-surface-base-idle-bg)",
    "var(--color-successBorder)": "var(--color-success-stroke-base)",
    "var(--color-successFg)": "var(--color-success-surface-base-idle-fg-default)",
    // Same with colors as stitches exported it like that and we used it
    "var(--colors-bgDefault)": "var(--color-neutral-canvas-default-bg)",
    "var(--colors-fgMuted)": "var(--color-neutral-canvas-default-fg-subtle)",
    "var(--colors-accentBg)": "var(--color-accent-surface-minimal-idle-bg)",
    "var(--colors-accentBorder)": "var(--color-accent-stroke-base)",
    "var(--colors-accentDefault)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--colors-accentEmphasis)": "var(--color-accent-surface-heavy-idle-bg)",
    "var(--colors-accentMuted)": "var(--color-accent-surface-base-idle-fg-subtle)",
    "var(--colors-accentOnAccent)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--colors-bgCanvas)": "var(--color-neutral-canvas-minimal-bg)",
    "var(--colors-bgEmphasis)": "var(--color-neutral-canvas-minimal-bg)",
    "var(--colors-bgSubtle)": "var(--color-neutral-canvas-subtle-bg)",
    "var(--colors-bgSurface)": "var(--color-neutral-canvas-default-bg)",
    "var(--colors-borderDefault)": "var(--color-neutral-stroke-default)",
    "var(--colors-borderMuted)": "var(--color-neutral-stroke-subtle)",
    "var(--colors-borderSubtle)": "var(--color-neutral-stroke-subtle)",
    "var(--colors-buttonPrimaryBgHover)":
      "var(--color-accent-surface-base-hover-bg)",
    "var(--colors-buttonPrimaryBgRest)":
      "var(--color-accent-surface-base-idle-bg)",
    "var(--colors-buttonPrimaryBorderRest)": "transparent",
    "var(--colors-buttonPrimaryFg)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--colors-buttonPrimaryMuted)":
      "var(--color-accent-surface-base-idle-fg-subtle)",
    "var(--colors-buttonSecondaryBgHover)":
      "var(--color-neutral-surface-subtle-hover-bg)",
    "var(--colors-buttonSecondaryBgRest)":
      "var(--color-neutral-surface-subtle-idle-bg)",
    "var(--colors-buttonSecondaryBorderRest)": "",
    "var(--colors-buttonSecondaryFg)":
      "var(--color-neutral-surface-subtle-idle-fg-default)",
    "var(--colors-dangerBg)": "var(--color-danger-surface-base-idle-bg)",
    "var(--colors-dangerBorder)": "var(--color-danger-stroke-base)",
    "var(--colors-dangerFg)": "var(--color-danger-surface-base-idle-fg-default)",
    "var(--colors-fgDefault)": "var(--color-neutral-canvas-default-fg-default)",
    "var(--colors-fgDisabled)": "var(--color-neutral-canvas-default-fg-subtle)",
    "var(--colors-fgOnEmphasis)": "var(--color-neutral-canvas-minimal-fg-default)",
    "var(--colors-fgSubtle)": "var(--color-neutral-canvas-subtle-fg-subtle)",
    "var(--colors-focus)": "var(--color-accent-surface-base-idle-bg)",
    "var(--colors-interactionBg)": "var(--color-accent-surface-base-idle-bg)",
    "var(--colors-interactionHandle)":
      "var(--color-accent-surface-base-idle-fg-default)",
    "var(--colors-interactionHandleInactive)":
      "var(--color-neutral-canvas-default-fg-subtle)",
    "var(--colors-modalBackdrop)": "rgba(30, 30, 30, 0.75)",
    "var(--colors-shadowDefault)": "rgba(0, 0, 0, 0.05)",
    "var(--colors-successBg)": "var(--color-success-surface-base-idle-bg)",
    "var(--colors-successBorder)": "var(--color-success-stroke-base)",
    "var(--colors-successFg)": "var(--color-success-surface-base-idle-fg-default)",
    "var(--sizes-1)": "var(--size-10)",
    "var(--sizes-2)": "var(--size-25)",
    "var(--sizes-3)": "var(--size-50)",
    "var(--sizes-4)": "var(--size-75)",
    "var(--sizes-5)": "var(--size-100)",
    "var(--sizes-6)": "var(--size-150)",
    "var(--sizes-7)": "var(--size-200)",
    "var(--space-1)": "var(--component-spacing-3xs)",
    "var(--space-2)": "var(--component-spacing-2xs)",
    "var(--space-3)": "var(--component-spacing-sm)",
    "var(--space-4)": "var(--component-spacing-md)",
    "var(--space-5)": "var(--component-spacing-lg)",
    "var(--space-6)": "var(--component-spacing-xl)",
    "var(--space-7)": "var(--ui-spacing-lg)",
    "var(--space-8)": "var(--ui-spacing-xl)",
    "var(--space-9)": "var(--ui-spacing-2xl)"
  },

  // Space mappings
  spaces: {
    "$1": "var(--component-spacing-3xs)",
    "$2": "var(--component-spacing-2xs)", 
    "$3": "var(--component-spacing-sm)",
    "$4": "var(--component-spacing-md)",
    "$5": "var(--component-spacing-lg)",
    "$6": "var(--component-spacing-xl)",
    "$7": "var(--ui-spacing-lg)",
    "$8": "var(--ui-spacing-xl)",
    "$9": "var(--ui-spacing-2xl)",
    "var(--space-1)": "var(--component-spacing-3xs)",
    "var(--space-2)": "var(--component-spacing-2xs)",
    "var(--space-3)": "var(--component-spacing-sm)",
    "var(--space-4)": "var(--component-spacing-md)",
    "var(--space-5)": "var(--component-spacing-lg)",
    "var(--space-6)": "var(--component-spacing-xl)",
    "var(--space-7)": "var(--ui-spacing-lg)",
    "var(--space-8)": "var(--ui-spacing-xl)",
    "var(--space-9)": "var(--ui-spacing-2xl)"
  },

  // Size mappings
  sizes: {
    "$1": "var(--size-10)",
    "$2": "var(--size-25)",
    "$3": "var(--size-50)", 
    "$4": "var(--size-75)",
    "$5": "var(--size-100)",
    "$6": "var(--size-150)",
    "$7": "var(--size-200)",
    "$8": "var(--size-300)",
    "$9": "var(--size-400)",
    "var(--sizes-1)": "var(--size-10)",
    "var(--sizes-2)": "var(--size-25)",
    "var(--sizes-3)": "var(--size-50)",
    "var(--sizes-4)": "var(--size-75)",
    "var(--sizes-5)": "var(--size-100)",
    "var(--sizes-6)": "var(--size-150)",
    "var(--sizes-7)": "var(--size-200)",
    "var(--sizes-controlSmall)": "var(--size-control-small)",
    "var(--sizes-controlMedium)": "var(--size-control-medium)",
    "var(--sizes-controlLarge)": "var(--size-control-large)"
  },

  // Border radius mappings
  borderRadius: {
    "$small": "var(--component-radii-sm)",
    "$medium": "var(--component-radii-md)",
    "var(--radii-small)": "var(--component-radii-sm)",
    "var(--radii-medium)": "var(--component-radii-md)"
  },

  // Box shadow mappings
  boxShadow: {
    "$small": "var(--box-shadow-small)",
    "$medium": "var(--box-shadow-medium)",
    "$large": "var(--box-shadow-large)",
    "$focus": "var(--box-shadow-focus)",
    "$contextMenu": "var(--box-shadow-context-menu)"
  },

  // Font size mappings
  fontSize: {
    "$xxsmall": "var(--font-size-xxsmall)",
    "$xsmall": "var(--font-size-xsmall)",
    "$small": "var(--font-size-small)",
    "$medium": "var(--font-size-medium)",
    "$large": "var(--font-size-large)",
    "$xlarge": "var(--font-size-xlarge)"
  }
}; 