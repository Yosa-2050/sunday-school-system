import { useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import {
  type ConfirmResetPasswordRequest,
  confirmResetPassword,
} from "app/_api/auth/confirm-reset-password";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const otpSchema = z
  .object({
    otp: z.string().length(6, "OTP must be exactly 6 digits"), // `.length(6)` replaces `min(6).max(6)`
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

const OTP: React.FC = () => {
  const t = useTranslations("auth.OTP");
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: ConfirmResetPasswordRequest) =>
      await confirmResetPassword(payload),
    onSuccess: (data) => {
      router.push("/auth/login");
      notifications.show({
        title: "Password Successfully Changed",
        color: "green",
        message: "You Password has been changed successfully",
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        notifications.show({
          title: "OTP Verification Failed",
          color: "red",
          message: error.message,
        });
      } else {
        notifications.show({
          title: "OTP Verification Failed",
          color: "red",
          message: "An unknown error occurred",
        });
      }
    },
  });

  const onSubmit = (data: ConfirmResetPasswordRequest) => {
    mutation.mutate(data);
  };

  return (
    <Box className="flex items-center justify-center bg-white shadow rounded w-full md:w-[60%]">
      <div className="relative w-full p-8">
        <Title order={2} ta="center" mb="md">
          {t("title")}
        </Title>
        <form
          onSubmit={handleSubmit((data) =>
            onSubmit({
              ...data,
              username: searchParams.get("username") as string,
              origin: "portal",
            })
          )}
          className="gap-2"
        >
          <TextInput
            label={t("otpLabel")}
            placeholder={t("otpPlaceholder")}
            {...register("otp")}
            error={errors.otp?.message}
            className="mb-2"
          />
          <PasswordInput
            label={t("newPassword")}
            placeholder={t("passwordPlaceholder")}
            {...register("password")}
            error={errors.password?.message}
            className="mb-2"
          />
          <PasswordInput
            label={t("confirmPassword")}
            placeholder={t("confirmPasswordPlaceholder")}
            {...register("confirmPassword")}
            error={errors.password?.message}
          />
          <Group justify="space-between" mt="md">
            <Button fullWidth type="submit" loading={mutation.isPending}>
              {t("verifyButton")}
            </Button>
          </Group>
          {mutation.isError && (
            <Text color="red" size="sm" mt="sm">
              {(mutation.error as Error)?.message}
            </Text>
          )}
        </form>
      </div>
    </Box>
  );
};

export default OTP;
