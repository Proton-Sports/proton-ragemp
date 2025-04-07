/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          1: 'hsl(var(--theme-accent-1) / <alpha-value>)',
          2: 'hsl(var(--theme-accent-2) / <alpha-value>)',
          3: 'hsl(var(--theme-accent-3) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--theme-primary) / <alpha-value>)',
          fg: 'hsl(var(--theme-primary-fg) / <alpha-value>)',
          hover: 'hsl(var(--theme-primary-hover) / <alpha-value>)',
          active: 'hsl(var(--theme-primary-active) / <alpha-value>)',
          disabled: 'hsl(var(--theme-primary-disabled) / <alpha-value>)',
        },
        fg: {
          1: 'hsl(var(--theme-fg-1) / <alpha-value>)',
          2: 'hsl(var(--theme-fg-2) / <alpha-value>)',
          3: 'hsl(var(--theme-fg-3) / <alpha-value>)',
          DEFAULT: 'hsl(var(--theme-fg) / <alpha-value>)',
          hover: 'hsl(var(--theme-fg-hover) / <alpha-value>)',
          active: 'hsl(var(--theme-fg-active) / <alpha-value>)',
          disabled: 'hsl(var(--theme-fg-disabled) / <alpha-value>)',
        },
        bg: {
          1: 'hsl(var(--theme-bg-1) / <alpha-value>)',
          2: 'hsl(var(--theme-bg-2) / <alpha-value>)',
          3: 'hsl(var(--theme-bg-3) / <alpha-value>)',
          DEFAULT: 'hsl(var(--theme-bg-1) / <alpha-value>)',
          hover: 'hsl(var(--theme-bg-hover) / <alpha-value>)',
          active: 'hsl(var(--theme-bg-active) / <alpha-value>)',
          disabled: 'hsl(var(--theme-bg-disabled) / <alpha-value>)',
          border: 'hsl(var(--theme-bg-border) / <alpha-value>)',
        },
      },
      fontFamily: {
        number: 'var(--font-family-number)',
      },
      fontSize: {
        xs: '0.694rem',
        sm: '0.833rem',
        base: '1rem',
        md: '1.2rem',
        lg: '1.44rem',
        xl: '1.728rem',
        '2xl': '2.074rem',
        '3xl': '2.488rem',
        '4xl': '2.986rem',
      },
      borderRadius: {
        none: '0',
        sm: '0.3vh',
        md: '0.8vh',
        lg: '1.2vh',
        xl: '1.8vh',
        full: '999999vh',
      },
    },
  },
  plugins: [],
};
