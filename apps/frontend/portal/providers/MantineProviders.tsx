'use client';

import { generateColors } from '@mantine/colors-generator';
import { MantineProvider, type MantineThemeOverride } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function MantineThemeProvider({
    color,
    radius,
    children,
}: {
    color: string;
    radius: string;
    children: React.ReactNode;
}) {
    const theme: Partial<MantineThemeOverride> = baseTheme({
        primaryColor: color,
        radius: radius,
    });
    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            <ModalsProvider>{children}</ModalsProvider>
            <ProgressBar
                height="4px"
                color={color}
                options={{ showSpinner: false }}
                shallowRouting
            />
        </MantineProvider>
    );
}

const backgroundColor = 'var(--primary-color-background)';

const baseTheme = ({
    primaryColor,
    radius,
}: {
    primaryColor: string;
    radius: string;
}): Partial<MantineThemeOverride> => {
    return {
        defaultRadius: radius ?? '8px',
        primaryColor: 'primary',
        primaryShade: {
            light: 8,
            dark: 9,
        },
        fontFamily: 'var(--font-inter)',
        white: '#FEFEFE',

        headings: {
            fontFamily: 'var(--font-inter)',
        },

        breakpoints: {
            xs: '36rem',
            sm: '48rem',
            md: '62rem',
            lg: '75rem',
            xl: '87.5rem',
        },

        colors: {
            primary: generateColors(primaryColor),
        },

        components: {
            Container: {
                defaultProps: {
                    sizes: {
                        xs: 540,
                        sm: 720,
                        md: 960,
                        lg: 1140,
                        xl: 1320,
                    },
                },
            },
            Button: {
                defaultProps: {
                    size: 'sm',
                },
            },
            Card: {
                defaultProps: {
                    withBorder: true,
                },
                // styles: {
                //   root: {
                //     backgroundColor,
                //   },
                // },
            },
            Paper: {
                defaultProps: {
                    withBorder: true,
                    radius: 'none',
                },
            },
            Input: {
                defaultProps: {
                    size: 'sm',
                },
                // styles: {
                //   input: {
                //     backgroundColor,
                //   },
                // },
            },
            TextInput: {
                defaultProps: {
                    size: 'sm',
                },
            },
            Textarea: {
                defaultProps: {
                    size: 'sm',
                    minRows: 3,
                },
            },
            NumberInput: {
                defaultProps: {
                    size: 'sm',
                },
            },
            Select: {
                defaultProps: {
                    size: 'sm',
                },
            },
            PasswordInput: {
                defaultProps: {
                    size: 'sm',
                },
            },
            Breadcrumbs: {
                styles: {
                    breadcrumb: {
                        fontSize: '14px',
                    },
                },
            },
            Modal: {
                defaultProps: {
                    closeOnClickOutside: false,
                },
                styles: {
                    body: {
                        paddingTop: 16,
                        // backgroundColor,
                    },
                },
            },
            AppShell: {
                styles: {
                    main: {
                        backgroundColor: '#F3F4F6',
                    },
                    header: {
                        height: 40,
                    },
                },
            },
        },
    };
};
