"use client";

import { useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, PasswordInput, Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "app/_api/auth/sign-up";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z
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

const ChangePassword = ({ userId }: { userId: string }) => {
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
      oldPassword: "",
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
    mutationFn: async (data) =>
      changePassword({
        userId,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
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
      router.push("/auth/login");
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    mutate(data);
  };

  const isButtonDisabled = !(newPasswordValue && confirmPasswordValue);

  return (
    <Box className="flex w-1/2 items-center justify-center bg-white">
      <div className="relative w-full p-8">
        <Stack>
          <Title order={2} ta="center" mb={"lg"}>
            {t("title")}
          </Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <PasswordInput
                label="Old Password"
                placeholder="Enter your old password"
                {...register("oldPassword")}
                error={errors.oldPassword?.message}
              />
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
                  {t("proceedBtn")}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </div>
    </Box>
  );
};

export default ChangePassword;
