import Bun from 'bun';
import FluentTheme from './fluent-theme.json';

function hexToRgb(hex: string) {
    hex = hex.substring(1);
    if (hex.length === 3) {
        hex = expand(hex);
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r} ${g} ${b}`;
}

function expand(hex: string) {
    return hex
        .split('')
        .map((a) => `${a}${a}`)
        .join('');
}

Bun.write(
    'theme.gen.css',
    `:root {
    --color-base-bg-1: ${hexToRgb(FluentTheme.colorNeutralBackground1)};
    --color-base-bg-1-hover: ${hexToRgb(FluentTheme.colorNeutralBackground1Hover)};
    --color-base-bg-1-active: ${hexToRgb(FluentTheme.colorNeutralBackground1Pressed)};
    --color-base-bg-1-disabled: ${hexToRgb(FluentTheme.colorNeutralBackgroundDisabled)};
    --color-base-bg-2: ${hexToRgb(FluentTheme.colorNeutralBackground2)};
    --color-base-bg-3: ${hexToRgb(FluentTheme.colorNeutralBackground3)};
    --color-base-bg-4: ${hexToRgb(FluentTheme.colorNeutralBackground4)};
    --color-base-bg-5: ${hexToRgb(FluentTheme.colorNeutralBackground5)};
    --color-base-bg-6: ${hexToRgb(FluentTheme.colorNeutralBackground6)};
    --color-base-fg-1: ${hexToRgb(FluentTheme.colorNeutralForeground1)};
    --color-base-fg-1-hover: ${hexToRgb(FluentTheme.colorNeutralForeground1Hover)};
    --color-base-fg-1-active: ${hexToRgb(FluentTheme.colorNeutralForeground1Pressed)};
    --color-base-fg-1-selected: ${hexToRgb(FluentTheme.colorNeutralForeground1Selected)};
    --color-base-fg-1-disabled: ${hexToRgb(FluentTheme.colorNeutralForegroundDisabled)};
    --color-base-fg-2: ${hexToRgb(FluentTheme.colorNeutralForeground2)};
    --color-base-fg-2-hover: ${hexToRgb(FluentTheme.colorNeutralForeground2Hover)};
    --color-base-fg-2-active: ${hexToRgb(FluentTheme.colorNeutralForeground2Pressed)};
    --color-base-fg-3: ${hexToRgb(FluentTheme.colorNeutralForeground3)};
    --color-base-fg-4: ${hexToRgb(FluentTheme.colorNeutralForeground4)};
    --color-base-border-1: ${hexToRgb(FluentTheme.colorNeutralStroke1)};
    --color-base-border-1-disabled: ${hexToRgb(FluentTheme.colorNeutralStrokeDisabled)};
    --color-base-border-2: ${hexToRgb(FluentTheme.colorNeutralStroke2)};
    --color-base-border-3: ${hexToRgb(FluentTheme.colorNeutralStroke3)};

    --color-brand-bg-1: ${hexToRgb(FluentTheme.colorBrandBackground)};
    --color-brand-bg-1-hover: ${hexToRgb(FluentTheme.colorBrandBackgroundHover)};
    --color-brand-bg-1-active: ${hexToRgb(FluentTheme.colorBrandBackgroundPressed)};
    --color-brand-bg-1-disabled: ${hexToRgb(FluentTheme.colorNeutralBackgroundDisabled)};
    --color-brand-bg-2: ${hexToRgb(FluentTheme.colorBrandBackground2)};
    --color-brand-bg-3: ${hexToRgb(FluentTheme.colorBrandBackground3Static)};
    --color-brand-bg-4: ${hexToRgb(FluentTheme.colorBrandBackground4Static)};
    --color-brand-on-bg-1: ${hexToRgb(FluentTheme.colorNeutralForegroundOnBrand)};
    --color-brand-on-bg-1-disabled: ${hexToRgb(FluentTheme.colorNeutralForegroundDisabled)};
    --color-brand-fg-1: ${hexToRgb(FluentTheme.colorBrandForeground1)};
    --color-brand-fg-2: ${hexToRgb(FluentTheme.colorBrandForeground2)};
    --color-brand-border-1: ${hexToRgb(FluentTheme.colorBrandStroke1)};
    --color-brand-border-2: ${hexToRgb(FluentTheme.colorBrandStroke2)};

    --color-subtle-bg-hover: ${hexToRgb(FluentTheme.colorSubtleBackgroundHover)};
    --color-subtle-bg-active: ${hexToRgb(FluentTheme.colorSubtleBackgroundPressed)};
}
`,
);
