import {
    Container,
    Divider,
    Grid,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
} from '@tabler/icons-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-20">
            <Container size="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="md">
                            <Title order={3} className="text-white">
                                Shega Jobs
                            </Title>
                            <Text size="sm" c="gray.3">
                                Find your dream job or hire the perfect
                                candidate. Shega Jobs connects talented
                                professionals with amazing opportunities.
                            </Text>
                            <Group gap="xs">
                                <Link
                                    href="https://twitter.com"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    <IconBrandTwitter size={20} />
                                </Link>
                                <Link
                                    href="https://linkedin.com"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    <IconBrandLinkedin size={20} />
                                </Link>
                                <Link
                                    href="https://github.com"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    <IconBrandGithub size={20} />
                                </Link>
                            </Group>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="md">
                            <Title order={4} className="text-white">
                                Quick Links
                            </Title>
                            <Stack gap="xs">
                                <Link
                                    href="/jobs"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Browse Jobs
                                </Link>
                                <Link
                                    href="/companies"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Companies
                                </Link>
                                <Link
                                    href="/terms-and-conditions"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Terms and Conditions
                                </Link>
                                <Link
                                    href="/privacy-policy"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                            </Stack>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="md">
                            <Title order={4} className="text-white">
                                Contact Us
                            </Title>
                            <Stack gap="xs">
                                <Text size="sm" c="gray.3">
                                    Email: support@shegajobs.com
                                </Text>
                                <Text size="sm" c="gray.3">
                                    Phone: +251 911 123 456
                                </Text>
                                <Text size="sm" c="gray.3">
                                    Address: Addis Ababa, Ethiopia
                                </Text>
                            </Stack>
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Divider my="xl" color="gray.7" />

                <Group justify="space-between" align="center">
                    <Text size="sm" c="gray.3">
                        © {new Date().getFullYear()} Shega Jobs. All rights
                        reserved.
                    </Text>
                    <Group gap="xs">
                        <Link
                            href="/privacy"
                            className="text-gray-300 hover:text-white transition-colors text-sm"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-gray-300 hover:text-white transition-colors text-sm"
                        >
                            Terms of Service
                        </Link>
                    </Group>
                </Group>
            </Container>
        </footer>
    );
}
