"use client";

import { useRouter } from "@/i18n/routing";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { login } from "app/[locale]/_api/auth/login";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {setCookie} from 'cookies-next';
import { COOKIE_ACCESS_TOKEN, logger } from "@shega/shared";
import { getUserAction } from "app/[locale]/_api/get-user-action";
import { useAuth } from "@shega/ui";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setUser} = useAuth()
  const router = useRouter();
  const t = useTranslations("auth.login");

  const loginMutation = useMutation({
    mutationFn: login,
    onError: (err) => {
        notifications.show({
            title: 'Error',
            message: t("loginFailed"),
            color: 'red',
        }); 
    },
    onSuccess: async ({ data }) => {  // Make this function async
        try {
            if (data.pwdChangeRequired) {
                router.push(`/auth/change-password/${data.id}`);
            } else {
              notifications.show({
                title: 'Success',
                message: t("loginSuccess"),
                color: 'green',
              })
                setCookie(COOKIE_ACCESS_TOKEN, data.access_token);
                
                // Ensure getUserAction() is awaited properly
                const user = await getUserAction();
                setUser(user);
                router.push("/admin/dashboard");
            }
        } catch (error) {
            logger.error("Error processing login success:", error);
        }
    },
});


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   await loginMutation.mutateAsync({ username, password });
};


  return (
    <Box className="flex items-center justify-center bg-white shadow rounded w-2/5">
      
      <div className="relative w-full md:w-3xl   p-8">
          <Flex direction={'column'} align="center">
            <Title className="text-xl text-start">{t("title")}</Title>
          <Text ta="start" className="mb-3 text-gray-500 text-sm">
            {t("subtitle")}
          </Text>
            </Flex>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label={t("emailLabel")}
                placeholder={t("emailPlaceholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                styles={{
                  input: {
                    borderColor: "rgba(204, 204, 204, 1)",
                    "&:focus, &:focus-within": {
                      borderColor: "rgba(19, 158, 123, 1)",
                      outline: "none",
                      boxShadow: "0 0 0 1px rgba(19, 158, 123, 1)",
                    },
                  },
                }}
              />

              <PasswordInput
                label={t("passwordLabel")}
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                styles={{
                  input: {
                    borderColor: "rgba(204, 204, 204, 1)",
                    "&:focus, &:focus-within": {
                      borderColor: "rgba(19, 158, 123, 1)",
                      outline: "none",
                      boxShadow: "0 0 0 1px rgba(19, 158, 123, 1)",
                    },
                  },
                }}
              />
              <Group justify="space-between" mt={"sm"}>
                <Checkbox
                  title="Remember me"
                  label={t("rememberMe")}
                  className="text-teal-600"
                  color="rgba(19, 158, 123, 1)"
                  variant="outline"
                />
                <Anchor
                  size="sm"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="text-sm text-teal-600 hover:underline"
                >
                  {t("forgotPassword")}
                </Anchor>
              </Group>
              <Button
                type="submit"
                fullWidth
                className="w-full rounded-md  px-4 py-2 text-white"
                loading={loginMutation.isPending}
              >
                {t("loginButton")}
              </Button>
            </Stack>
          </form>
       
      </div>
    </Box>
  );
};

export default Login;
