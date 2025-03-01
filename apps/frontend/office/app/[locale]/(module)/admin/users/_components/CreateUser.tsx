import { IconXboxX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Stack, TextInput,  Group, Select} from '@mantine/core';
import { useTranslations } from 'next-intl';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { type CreateUsers, createUsers } from 'app/[locale]/_api/users/create-users';
import { notifications } from '@mantine/notifications';
import { logger } from '@shega/shared';

// Define validation schema using Zod
const userSchema = z.object({
  role: z.string(),
  firstName: z.string().min(1, "Name is required"),
  middleName: z.string().min(1, "Father Name is required"),
  lastName: z.string().min(1, "Grand Father Name is required"),
  email: z.string().email("Invalid email address"),
});

export function CreateUser() {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('users');

  // Initialize react-hook-form with the validation schema
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUsers>({
    resolver: zodResolver(userSchema),
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUsers,
    mutationKey: ['users'],
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'User Created Successfully'
      })
      close();
    },
    onError: (error) => {
      logger.log(error)
      notifications.show({
        title: "Error creating",
        message: `Error Creating a User ${error.message}`
      })
    },
  });

  const onSubmit = (data: CreateUsers) => {
    createUserMutation.mutate(data);
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Create User"
        size="md"
        position="right"
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}
      >
          <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Role"
              placeholder="Select your role"
              data={[
                { value: 'JOB_SEEKER', label: 'Applicants' },
                { value: 'WORK_PROVIDER', label: 'Job Providers' },
                { value: 'ADMINISTRATOR', label: 'Administrator' },
              ]}
              error={errors.role?.message}
             withAsterisk
            />
          )}
        />
            <TextInput
              label={t('firstNameLabel')}
              placeholder={t('firstNamePlaceholder')}
              {...register('firstName')}
              error={errors.firstName?.message}
             withAsterisk
            />
            <Group justify='space-between' gap={"xs"}>
            <TextInput
              label={t('middleNameLabel')}
              placeholder={t('middleNamePlaceholder')}
              {...register('middleName')}
              error={errors.middleName?.message}
             withAsterisk
            />
            <TextInput
              label={t('lastNameLabel')}
              placeholder={t('lastNamePlaceholder')}
              {...register('lastName')}
              error={errors.lastName?.message}
             withAsterisk
              />
              </Group>
            <TextInput
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              {...register('email')} // Register the email field
              error={errors.email?.message}
             withAsterisk
              styles={{
                input: {
                  borderColor: 'rgba(204, 204, 204, 1)',
                  '&:focus, &:focus-within': {
                    borderColor: 'rgba(19, 158, 123, 1)',
                    outline: 'none',
                    boxShadow: '0 0 0 1px rgba(19, 158, 123, 1)',
                  },
                },
              }}
            />
            
            
             
            <Group justify="flex-end" mt="md" w={'100%'}>
              <Button
                type="submit"
                loading={createUserMutation.isPending}
                disabled={createUserMutation.isPending}
                w={"100%"}
              >
                {t('createUserButton')}
              </Button>
            </Group>
        </Stack>
          </form>
      </Drawer>

      <Button variant="default" onClick={open}>
        Create User
      </Button>
    </>
  );
}
