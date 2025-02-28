import PageWrapper from './_components/PageWrapper';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <PageWrapper>{children}</PageWrapper>;
}
