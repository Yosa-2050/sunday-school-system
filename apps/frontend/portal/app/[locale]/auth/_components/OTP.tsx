import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, Button, Group, Container, Title, Text, Paper } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { logger } from "@shega/shared";
import { useTranslations } from "next-intl";

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be exactly 6 digits").max(6, "OTP must be exactly 6 digits"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const verifyOTP = async (otp: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (otp === "123456") {
    return { success: true };
  }
  throw new Error("Invalid OTP");
};

const OTP: React.FC = () => {
  const t = useTranslations("auth.OTP");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ otp }: OTPFormValues) => verifyOTP(otp),
    onSuccess: (data) => {
      logger.log("OTP verified successfully", data);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        logger.error("OTP verification failed", error);
      } else {
        logger.error("OTP verification failed", new Error("Unknown error"));
      }
    },
  });

  const onSubmit = (data: OTPFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Container size="xs" style={{ marginTop: "2rem" }}>
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mb="md">
          {t("title")}
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label={t("otpLabel")}
            placeholder={t("otpPlaceholder")}
            {...register("otp")}
            error={errors.otp?.message}
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
      </Paper>
    </Container>
  );
};

export default OTP;
