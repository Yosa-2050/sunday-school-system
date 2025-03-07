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
} from '@react-email/components';
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

interface VerifyEmailTemplateForOtpProps {
    fullName: string;
    username: string;
    otp: string;
    duration: number;
    language: string;
}

const translations = {
    en: {
        greeting: 'Hey {name},',
        instruction:
            'Use the following OTP to complete the procedure to verify your email address. OTP is valid for {duration} minutes. Do not share this code with others.',
        usernameLabel: 'Your Username',
        otpLabel: 'Your OTP',
        helpText: 'Need help? Ask at',
        helpEmail: 'megp@gmail.com',
        helpCenter: 'Help Center',
        companyName: 'egp Malawi',
        companyAddress: 'Lilongwe 3, Malawi.',
        copyright: 'Copyright © 2022 Company. All rights reserved.',
    },
    am: {
        greeting: 'Hey {name},',
        instruction:
            'Use the following OTP to complete the procedure to verify your email address. OTP is valid for {duration} minutes. Do not share this code with others.',
        usernameLabel: 'Your Username',
        otpLabel: 'Your OTP',
        helpText: 'Need help? Ask at',
        helpEmail: 'megp@gmail.com',
        helpCenter: 'Help Center',
        companyName: 'egp Malawi',
        companyAddress: 'Lilongwe 3, Malawi.',
        copyright: 'Copyright © 2022 Company. All rights reserved.',
    },
};

const VerifyEmailTemplateForOtp: React.FC<VerifyEmailTemplateForOtpProps> = ({
    fullName,
    username,
    otp,
    duration,
    language,
}: VerifyEmailTemplateForOtpProps) => {
    const t =
        translations[language as keyof typeof translations] || translations.en;

    return (
        <Html lang={language}>
            <Head>
                <Font
                    fontFamily="Poppins"
                    fallbackFontFamily="sans-serif"
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap',
                        format: 'woff2',
                    }}
                    fontWeight={300}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Verify your email address</Preview>
            <Body>
                <Tailwind>
                    <Container className="w-full max-w-[600px] mx-auto p-5">
                        <Section className="w-full text-right">
                            <Row>
                                <Column className="text-white text-lg leading-[30px]">
                                    Oct 20, 2023
                                </Column>
                            </Row>
                        </Section>

                        <Section className="p-[92px_30px_115px] bg-white rounded-[30px] text-center">
                            <Text className="m-0 mt-2 text-lg font-semibold">
                                {t.greeting.replace('{name}', fullName)}
                            </Text>
                            <Text className="m-0 mt-4 font-semibold tracking-[0.56px]">
                                {t.instruction.replace(
                                    '{duration}',
                                    duration.toString(),
                                )}
                            </Text>
                            <Text className="m-0 mt-6 text-lg font-semibold">
                                {t.usernameLabel}
                            </Text>
                            <Text className="m-0 mt-4 text-3xl font-extrabold">
                                {username}
                            </Text>
                            <Text className="m-0 mt-4 text-xl font-semibold text-[#1f1f1f]">
                                {t.otpLabel}
                            </Text>
                            <Text className="text-5xl font-extrabold tracking-[25px] text-[#fafafa] bg-[#0d7801] p-2 rounded-[10px] mt-4">
                                {otp}
                            </Text>
                        </Section>

                        <Section className="max-w-[400px] mx-auto mt-[90px] text-center font-medium text-[#8c8c8c]">
                            <Text>
                                {t.helpText}{' '}
                                <Link
                                    href={`mailto:${t.helpEmail}`}
                                    className="text-[#499fb6] no-underline"
                                >
                                    {t.helpEmail}
                                </Link>{' '}
                                {t.helpCenter
                                    ? `or visit our ${t.helpCenter}`
                                    : ''}
                            </Text>
                        </Section>

                        <Section className="w-full max-w-[490px] mx-auto mt-5 text-center border-t border-[#e6ebf1]">
                            <Text className="m-0 mt-10 text-lg font-semibold text-[#434343]">
                                {t.companyName}
                            </Text>
                            <Text className="m-0 mt-2 text-[#434343]">
                                {t.companyAddress}
                            </Text>
                            <Row>
                                <Column>
                                    <Link href="" target="_blank">
                                        <Img
                                            src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                                            alt="Facebook"
                                            width="36px"
                                        />
                                    </Link>
                                </Column>
                                <Column>
                                    <Link href="" target="_blank">
                                        <Img
                                            src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
                                            alt="Instagram"
                                            width="36px"
                                        />
                                    </Link>
                                </Column>
                                <Column>
                                    <Link href="" target="_blank">
                                        <Img
                                            src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
                                            alt="Twitter"
                                            width="36px"
                                        />
                                    </Link>
                                </Column>
                                <Column>
                                    <Link href="" target="_blank">
                                        <Img
                                            src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
                                            alt="Youtube"
                                            width="36px"
                                        />
                                    </Link>
                                </Column>
                            </Row>
                            <Text className="m-0 mt-4 text-[#434343]">
                                {t.copyright}
                            </Text>
                        </Section>
                    </Container>
                </Tailwind>
            </Body>
        </Html>
    );
};

export const verifyEmailTemplateForOtp = async (
    props: VerifyEmailTemplateForOtpProps,
) => await render(<VerifyEmailTemplateForOtp {...props} />);
