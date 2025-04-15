import { createTheme } from '@mantine/core';

export const theme = createTheme({
    fontFamily: 'Inter, sans-serif',
    primaryColor: 'blue',
    colors: {
        blue: [
            '#e6f7ff',
            '#bae7ff',
            '#91d5ff',
            '#69c0ff',
            '#40a9ff',
            '#1890ff',
            '#096dd9',
            '#0050b3',
            '#003a8c',
            '#002766',
        ],
        dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#101113',
        ],
    },
    shadows: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    defaultRadius: 'md',
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Card: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
                withBorder: true,
                p: 'lg',
            },
        },
        Paper: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
                withBorder: true,
                p: 'lg',
            },
        },
        Avatar: {
            defaultProps: {
                radius: 'xl',
            },
        },
        TextInput: {
            styles: {
                input: {
                    '&:focus': {
                        borderColor: '#1890ff',
                    },
                },
            },
        },
        Textarea: {
            styles: {
                input: {
                    '&:focus': {
                        borderColor: '#1890ff',
                    },
                },
            },
        },
    },
    other: {
        transitionDuration: '200ms',
    },
});
