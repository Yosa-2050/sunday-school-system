"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ActionIcon,
  Badge,
  Box,
  Button, Divider, Group,
  Paper, SimpleGrid,
  Stack,
  Text, TextInput,
  Title
} from "@mantine/core"
import {
  IconBuilding,
  IconDeviceFloppy,
  IconEdit, IconMail, IconPhone,
  IconUser,
  IconX
} from "@tabler/icons-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { updateOrganization } from "app/[locale]/_api/organizations/updateOrganization"
import { getCookie } from "cookies-next"

const contactSchema = z.object({
  // Business Information
  businessAddress: z.string().min(1, "Official business address is required"),

  // Primary Contact Person
  contactPersonName: z.string().min(1, "Contact person name is required"),
  contactPersonRole: z.string().min(1, "Contact person role is required"),
  contactPersonPhone: z.string().min(1, "Contact person phone number is required"),
  contactPersonEmail: z
    .string()
    .min(1, "Contact person email is required")
    .email("Please enter a valid email address")
    .refine((email) => {
      const domain = email.split("@")[1]
      return domain && !["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"].includes(domain.toLowerCase())
    }, "Please use a corporate email address (not personal email)"),

  // Optional fields
  companyWebsite: z.string().url("Please enter a valid URL").optional().or(z.literal("")),

  // Existing contact fields
  companyPhone: z.string().min(1, "Company phone is required"),
  companyEmail: z.string().min(1, "Company email is required").email("Please enter a valid email address"),
  additionalAddress: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

interface ContactSectionProps {
  initialData?: Partial<ContactFormData>
}

export default function ContactSection({ initialData }: ContactSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
   
const organizationId =getCookie('organization_id')?.toString()??
 
''
;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      businessAddress: initialData?.businessAddress || "",
      contactPersonName: initialData?.contactPersonName || "",
      contactPersonRole: initialData?.contactPersonRole || "",
      contactPersonPhone: initialData?.contactPersonPhone || "",
      contactPersonEmail: initialData?.contactPersonEmail || "",
      companyWebsite: initialData?.companyWebsite || "",
      companyPhone: initialData?.companyPhone || "",
      companyEmail: initialData?.companyEmail || "",
      additionalAddress: initialData?.additionalAddress || "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
        await updateOrganization(organizationId, data)
    },
    onSuccess: () => {
      setIsLoading(false)
      setIsEditing(false)
    },
  })

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const handleSubmitForm = async (data: ContactFormData) => {
    setIsLoading(true)
    try {
      await mutation.mutateAsync(data)

    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("Error updating contact information:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const RequiredBadge = () => (
    <Badge size="xs" color="red" variant="light">
      *
    </Badge>
  )



  const DisplayField = ({ value, icon }: { value?: string; icon?: React.ReactNode }) => (
    <Group gap="xs" wrap="nowrap">
      {icon}
      <Text size="sm" c={value ? "dark" : "dimmed"}>
        {value || "Not provided"}
      </Text>
    </Group>
  )

  return (
    <Paper withBorder={false} p={"md"} mt={"md"} shadow="xs">
      <Box py="md">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconBuilding size={24} stroke={1.5} />
            <div>
              <Title order={3}>Contact Information</Title>
              <Text size="sm" c="dimmed">
                Manage your organization&apos;s contact details and primary contact person
              </Text>
            </div>
          </Group>

          <Group gap="xs">
            {isEditing ? (
              <>
                <ActionIcon variant="light" color="gray" size="lg" onClick={handleCancel} disabled={isLoading}>
                  <IconX size={16} />
                </ActionIcon>
                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={handleSubmit(handleSubmitForm)}
                  loading={isLoading}
                  size="sm"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="light" leftSection={<IconEdit size={16} />} onClick={() => setIsEditing(true)} size="sm">
                Edit
              </Button>
            )}
          </Group>
        </Group>
      </Box>

<Divider />

      <Stack gap="xl" mt="md">
        {/* Primary Contact Person Section */}
        <Box>
          <Group gap="xs" mb="md">
            <IconUser size={20} stroke={1.5} />
            <Title order={4}>Primary Contact Person</Title>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={control}
              name="contactPersonName"
              render={({ field }) => (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                      Full Name
                    </Text>
                    <RequiredBadge />
                  </Group>
                  {isEditing ? (
                    <TextInput
                      {...field}
                      placeholder="Enter contact person's full name"
                      error={errors.contactPersonName?.message}
                    />
                  ) : (
                    <>
                      <DisplayField value={field.value} icon={<IconUser size={16} />} />
                    </>
                  )}
                </Box>
              )}
            />

            <Controller
              control={control}
              name="contactPersonRole"
              render={({ field }) => (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                      Role/Position
                    </Text>
                    <RequiredBadge />
                  </Group>
                  {isEditing ? (
                    <TextInput
                      {...field}
                      placeholder="e.g., HR Manager, Recruiter"
                      error={errors.contactPersonRole?.message}
                    />
                  ) : (
                    <>
                      <DisplayField value={field.value} icon={<IconUser size={16} />} />
                    </>
                  )}
                </Box>
              )}
            />

            <Controller
              control={control}
              name="contactPersonPhone"
              render={({ field }) => (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                      Phone Number
                    </Text>
                    <RequiredBadge />
                  </Group>
                  {isEditing ? (
                    <TextInput
                      {...field}
                      placeholder="+1 (555) 123-4567"
                      leftSection={<IconPhone size={16} />}
                      error={errors.contactPersonPhone?.message}
                    />
                  ) : (
                    <>
                      <DisplayField value={field.value} icon={<IconPhone size={16} />} />
                    </>
                  )}
                </Box>
              )}
            />

            <Controller
              control={control}
              name="contactPersonEmail"
              render={({ field }) => (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                      Corporate Email
                    </Text>
                    <RequiredBadge />
                  </Group>
                  {isEditing ? (
                    <TextInput
                      {...field}
                      placeholder="contact@company.com"
                      leftSection={<IconMail size={16} />}
                      error={errors.contactPersonEmail?.message}
                    />
                  ) : (
                    <>
                      <DisplayField value={field.value} icon={<IconMail size={16} />} />
                    </>
                  )}
                </Box>
              )}
            />
          </SimpleGrid>
        </Box>
      </Stack>

<Divider my={"md"}/>
      <Stack gap="xl" mt="md">
        {/* Primary Contact Person Section */}
        <Box>
          <Group gap="xs" mb="md">
            <IconUser size={20} stroke={1.5} />
            <Title order={4}>Hiring Manager</Title>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={control}
              name="contactPersonName"
              render={({ field }) => (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                      Full Name
                    </Text>
                    <RequiredBadge />
                  </Group>
                  {isEditing ? (
                    <TextInput
                      {...field}
                      placeholder="Enter contact person's full name"
                      error={errors.contactPersonName?.message}
                    />
                  ) : (
                    <>
                      <DisplayField value={field.value} icon={<IconUser size={16} />} />
                    </>
                  )}
                </Box>
              )}
            />

            <Controller
              control={control}
              name="contactPersonRole"
              render={({ field }) => (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                      Role/Position
                    </Text>
                    <RequiredBadge />
                  </Group>
                  {isEditing ? (
                    <TextInput
                      {...field}
                      placeholder="e.g., HR Manager, Recruiter"
                      error={errors.contactPersonRole?.message}
                    />
                  ) : (
                    <>
                      <DisplayField value={field.value} icon={<IconUser size={16} />} />
                    </>
                  )}
                </Box>
              )}
            />

            <Controller
              control={control}
              name="contactPersonPhone"
              render={({ field }) => (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                      Phone Number
                    </Text>
                    <RequiredBadge />
                  </Group>
                  {isEditing ? (
                    <TextInput
                      {...field}
                      placeholder="+1 (555) 123-4567"
                      leftSection={<IconPhone size={16} />}
                      error={errors.contactPersonPhone?.message}
                    />
                  ) : (
                    <>
                      <DisplayField value={field.value} icon={<IconPhone size={16} />} />
                    </>
                  )}
                </Box>
              )}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Paper>
  )
}
