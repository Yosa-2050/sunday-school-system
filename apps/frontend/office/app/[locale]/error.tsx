'use client';
import { Container, Title, Text, Button, Paper, Group } from '@mantine/core';


interface ErrorProps {
    error: Error;
    reset: () => void;
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }) => {
    return (
        <Container size={460} my={40} className='flex items-center justify-center'>
            <Paper shadow="md" radius="md" p="xl" withBorder>
                <Title order={1} mb="md">
                    Something went wrong!
                </Title>
                <Text mb="md">{error.message}</Text>
                <Group justify="flex-end">
                    <Button variant="outline" onClick={() => reset()}>
                        Try again
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
};

export default ErrorPage;