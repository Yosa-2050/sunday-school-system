import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  render,
} from "@react-email/components";
import React from "react";

interface WelcomeEmailProps {
  fullName: string;
  role: "Admin" | "Job Seeker" | "Employer";
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  fullName,
  role,
  email,
  temporaryPassword,
  loginUrl,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap",
            format: "woff2",
          }}
          fontWeight={300}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to Shega Jobs! Your Account is Created</Preview>
      <Body>
        <Tailwind>
          <Container className="w-full max-w-[600px] mx-auto p-5">
            <Section className="p-[50px_30px] bg-white rounded-[20px] text-center shadow-md">
              <Text className="text-xl font-semibold">Dear {fullName},</Text>
              <Text className="text-lg mt-4">
                Welcome to Shega Jobs! We're thrilled to have you join our
                community as a {role}.
              </Text>
              <Text className="text-lg mt-4">
                Your account has been successfully created.
              </Text>
              <Text className="text-lg mt-4 font-semibold">
                To get started, log in using the following credentials:
              </Text>
              <Text className="mt-2">
                <strong>Login Page URL:</strong>{" "}
                <Link href={loginUrl} className="text-blue-600">
                  {loginUrl}
                </Link>
              </Text>
              <Text className="mt-2">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="mt-2">
                <strong>Password:</strong> Your temporary password is:{" "}
                <span className="font-bold">{temporaryPassword}</span>. You need
                to change it after logging in.
              </Text>
            </Section>
            <Section className="mt-6 text-center text-gray-600">
              <Text>Best regards,</Text>
              <Text className="font-semibold">Shega Jobs Team</Text>
            </Section>
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
};

export const welcomeEmail = async (props: WelcomeEmailProps) =>
  await render(<WelcomeEmail {...props} />);
