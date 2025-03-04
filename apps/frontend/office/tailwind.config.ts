import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './_components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        '../../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
        fontFamily: {
            sans: ['var(--font-inter)'],
        },
        extend: {
            colors: {
                primary: {
                    '0': 'var(--primary-color-0)',
                    '1': 'var(--primary-color-1)',
                    '2': 'var(--primary-color-2)',
                    '3': 'var(--primary-color-3)',
                    '4': 'var(--primary-color-4)',
                    '5': 'var(--primary-color-5)',
                    '6': 'var(--primary-color-6)',
                    '7': 'var(--primary-color-7)',
                    '8': 'var(--primary-color-8)',
                    '9': 'var(--primary-color-9)',
                    default: 'var(--primary-color-default)',
                    text: 'var(--primary-color-text)',
                    body: 'var(--primary-color-body)',
                    background: 'var(--primary-color-background)',
                    border: 'var(--primary-color-border)',
                },
            },
        },
    }
};
export default config;
