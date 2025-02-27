import { Avatar, Box, Divider, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLogout2,
    IconSettings2,
    IconUserDown
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function UserProfile() {
  const t = useTranslations('jobPortal');
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Menu
      opened={opened}
      onChange={toggle}
      width={200}
      position="bottom-end"
      shadow="md"
    >
      <Menu.Target>
        <Box
          variant="subtle"
          className="flex items-center space-x-2 text-primary cursor-pointer"
        >
            
          <Avatar radius="xl" color="blue">
            DM
          </Avatar>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconUserDown className="w-4 h-4" />}>
          {t('profile')}
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings2 className="w-4 h-4" />}>
          {t('settings')}
        </Menu.Item>

        <Divider />

        <Menu.Item
          leftSection={<IconLogout2 className="w-4 h-4" />}
          color="red"
        >
          {t('logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
