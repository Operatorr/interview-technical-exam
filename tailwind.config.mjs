/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Mono"', 'monospace'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        cockpit: {
          dark: '#0a0e17',
          surface: '#111827',
          elevated: '#1f2937',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        neon: {
          green: '#22c55e',
          red: '#ef4444',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-slide-in': 'fadeSlideIn 0.35s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'score-reveal': 'scoreReveal 1s ease-out forwards',
        'ring-glow': 'ringGlow 2s ease-in-out infinite',
        'progress-glow': 'progressGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.4))' },
          '50%': { filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.7))' },
        },
        scoreReveal: {
          '0%': { strokeDasharray: '0 440' },
          '100%': { strokeDasharray: 'var(--score-dash) 440' },
        },
        ringGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.6))' },
        },
        progressGlow: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 12px rgba(245,158,11,0.5)' },
        },
      },
    },
  },
  plugins: [],
};
