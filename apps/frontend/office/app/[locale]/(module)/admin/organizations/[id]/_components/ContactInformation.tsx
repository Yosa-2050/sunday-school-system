import {
    Anchor,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import type { Contact, Organization } from 'model/Organization';
import { getContactIcon } from 'utilities/get-contact-info';

const ContactInformation = ({
    organizationData,
}: { organizationData: Organization }) => {
    const uniqueContacts =
        organizationData?.contacts?.reduce((acc: Contact[], contact) => {
            const key = `${contact.contactType}-${contact.value}-${contact.type}`;
            if (
                !acc.find(
                    (c) => `${c.contactType}-${c.value}-${c.type}` === key,
                )
            ) {
                acc.push(contact);
            }
            return acc;
        }, [] as Contact[]) ?? [];

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
            <Title order={4} mb="md">
                Contact Information
            </Title>
            <Stack gap="sm">
                {organizationData.corporateEmail && (
                    <Paper p="xs" withBorder radius="sm">
                        <Group gap="xs">
                            <ThemeIcon
                                size="sm"
                                variant="light"
                                radius="xl"
                                color="blue"
                            >
                                <IconMail size={14} />
                            </ThemeIcon>
                            <div style={{ flex: 1 }}>
                                <Text size="sm" fw={500}>
                                    Corporate Email
                                </Text>
                                <Anchor
                                    href={`mailto:${organizationData.corporateEmail}`}
                                    size="xs"
                                >
                                    {organizationData.corporateEmail}
                                </Anchor>
                            </div>
                        </Group>
                    </Paper>
                )}
                {uniqueContacts.map((contact) => (
                    <Paper key={contact.id} p="xs" withBorder radius="sm">
                        <Group gap="xs">
                            <ThemeIcon size="sm" variant="light" radius="xl">
                                {getContactIcon(contact.contactType)}
                            </ThemeIcon>
                            <div style={{ flex: 1 }}>
                                <Text size="sm" fw={500}>
                                    {contact.type} {contact.contactType}
                                </Text>
                                {contact.contactType === 'Email' ? (
                                    <Anchor
                                        href={`mailto:${contact.value}`}
                                        size="xs"
                                    >
                                        {contact.value}
                                    </Anchor>
                                    // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                ) : contact.contactType === 'Phone' ? (
                                    <Anchor
                                        href={`tel:${contact.value}`}
                                        size="xs"
                                    >
                                        {contact.value}
                                    </Anchor>
                                ) : (
                                    <Text size="xs" c="dimmed">
                                        {contact.value}
                                    </Text>
                                )}
                            </div>
                        </Group>
                    </Paper>
                ))}
                {uniqueContacts.length === 0 &&
                    !organizationData.corporateEmail && (
                        <Text size="sm" c="dimmed" ta="center" py="md">
                            No contact information provided
                        </Text>
                    )}
            </Stack>
        </Paper>
    );
};

export { ContactInformation };
