"use client";

import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "@/i18n/routing";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const oldPassword = searchParams.get("password");

  const t = useTranslations("auth.changePassword");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: oldPassword || "",
    },
  });

  const newPasswordValue = watch("newPassword", "");
  const confirmPasswordValue = watch("confirmPassword", "");
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    unknown,
    Error,
    ChangePasswordFormValues
  >({
    mutationFn: async (data: ChangePasswordFormValues) => {
      if (!userId || !oldPassword) {
        throw new Error("Missing user ID or old password");
      }

      const response = await fetch(
        "https://api.shega.heranitech.com/auth/changePassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      return response.json();
    },
    onError: (error) => {
      notifications.show({
        title: "Failed to change password",
        message: error.message,
        color: "red",
      });
    },
    onSuccess: () => {
      notifications.show({
        title: "Password changed successfully",
        message: "Your password has been updated",
        color: "green",
      });
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 1500); // Delay to allow user to see the notification
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    mutate(data);
  };

  const isButtonDisabled = !(newPasswordValue && confirmPasswordValue);

  return (
    <Box className="flex h-screen items-center justify-center bg-white">
      <div className="absolute top-4 left-4">
        <img src="./logos.PNG" className="h-10" alt="Shega Jobs Logo" />
      </div>
      <div className="relative w-full max-w-xl bg-white p-8">
        <Stack>
          <Title order={2} ta="center" mb={"lg"}>
            {t("title")}
          </Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              {/* <PasswordInput
                label="Old Password"
                hidden
                placeholder="Enter your old password"
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
                defaultValue={oldPassword || ""}
              /> */}
              <PasswordInput
                label={t("newPassword")}
                placeholder="Enter a new password"
                {...register("newPassword")}
                error={errors.newPassword?.message}
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
                label={t("confirmPassword")}
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
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
              <Group w={"100%"} justify="center" mt={"lg"}>
                <Button
                  type="submit"
                  loading={isPending}
                  disabled={isButtonDisabled}
                  className="w-full rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {t("proccedBtn")}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
        <Text ta="center" className="mt-8 text-gray-500 text-sm">
          {new Date().getFullYear()} Shega Jobs. {t("rightsReserved")}
        </Text>
      </div>
    </Box>
  );
};

export default ChangePassword;
