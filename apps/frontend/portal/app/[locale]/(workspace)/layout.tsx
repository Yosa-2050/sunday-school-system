import { Box } from '@mantine/core';
import type React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <Box>{children}</Box>;
};

export default Layout;
