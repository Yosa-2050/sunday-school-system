import { useRouter } from "@/i18n/routing";
import { Avatar, Box, Divider, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { COOKIE_ACCESS_TOKEN } from "@shega/shared";
import { useAuth } from "@shega/ui";
import { IconLogout2, IconUser } from "@tabler/icons-react";
import { deleteCookie } from "cookies-next";
import { useTranslations } from "next-intl";

export default function UserProfile() {
  const t = useTranslations("jobPortal");
  const { user, setUser } = useAuth();
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const openModal = () =>
    modals.openConfirmModal({
      title: "Are you sure you want to logout?",
      children: (
        <Text size="sm">
          You will be logged out of your account. Any unsaved changes will be
          lost!
        </Text>
      ),
      labels: { cancel: "Cancel", confirm: "Logout" },
      centered: true,
      confirmProps: { color: "primary" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        deleteCookie(COOKIE_ACCESS_TOKEN);
        deleteCookie("role");
        setUser(undefined);
        router.push("/auth/login");
      },
    });

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
          visibleFrom="md"
        >
          <Avatar radius="xl" color="blue">
            {user?.firstName?.[0]} {user?.lastName?.[0]}
          </Avatar>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        {/* <Menu.Item leftSection={<IconUserDown className="w-4 h-4" />}>
                    {t('users')}
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings2 className="w-4 h-4" />}>
                    {t('settings')}
                </Menu.Item> */}
        <Menu.Item
          leftSection={<IconUser size={14} />}
          onClick={() => router.push("/work-provider/profile")}
        >
          {t("profile")}
        </Menu.Item>
        <Divider />

        {user && (
          <Menu.Item
            leftSection={<IconLogout2 className="w-4 h-4" />}
            color="red"
            onClick={() => {
              deleteCookie(COOKIE_ACCESS_TOKEN);
              deleteCookie("role");
              setUser(undefined);
              router.push("/auth/login");
            }}
          >
            {t("logout")}
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
