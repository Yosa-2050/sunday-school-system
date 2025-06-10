"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Text,
  Title,
  ThemeIcon,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Loader,
  Divider,
  Paper,
  Stack,
  FileInput,
} from "@mantine/core";
import { IconMapPin, IconAt, IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import {
  updateLocation,
  updateOrganization,
} from "app/[locale]/_api/organizations/updateOrganization";
import { fetchCategories } from "app/[locale]/_api/job-details";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationById } from "app/[locale]/_api/organizations/get-organizationbyId";
import UploadFile from "./components/UploadFile";

const skills = [
  "Product Design",
  "UX Design",
  "Google Analytics",
  "SEO Content",
];

function UserProfile() {
  const [opened, { open, close }] = useDisclosure(false);
  const [contactModalOpened, contactModalHandlers] = useDisclosure(false);
  const [locationModalOpened, locationModalHandlers] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const organizationId = getCookie("organization_id")?.toString();
  const [formData, setFormData] = useState<any>(null);
  const [editingSection, setEditingSection] = useState(null);
  const {
    data: organization,
    isLoading: orgLoading,
    isError,
  } = useQuery({
    queryKey: ["organization_id", organizationId],
    queryFn: () => getOrganizationById(organizationId!),
    enabled: !!organizationId,
  });

  useEffect(() => {
    if (organization) {
      setFormData(organization);
    }
  }, [organization]);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async () => {
  //   if (!organizationId || !formData) return;

  //   try {
  //     const response = await updateOrganization(organizationId, formData);
  //     if (response.success) {
  //       console.log("\u2705 Organization updated successfully");
  //       close();
  //     } else {
  //       console.error("\u274C Update failed:", response.message);
  //     }
  //   } catch (error) {
  //     console.error("\u274C Error updating organization:", error);
  //   }
  // };

  const handleSubmit = async () => {
    if (!organizationId || !formData) return;

    if (editingSection === "location") {
      const locationEntry = formData.locations?.[0]?.locationData;
      if (!locationEntry) return;

      const payload = {
        addressType: "string",
        country: locationEntry.country,
        region: locationEntry.region,
        city: locationEntry.city,
        subcity: locationEntry.subcity,
        woreda: locationEntry.woreda,
        village: locationEntry.village || "string",
        houseNumber: locationEntry.houseNumber,
        addressText: locationEntry.addressText || "string",
        latitude: locationEntry.latitude || "string",
        longitude: locationEntry.longitude || "string",
        isPreferred: true,
      };

      try {
        const res = await updateLocation(formData.locations?.[0].id, payload);
        if (res.success) {
          console.log("✅ Location updated successfully");
        } else {
          console.error("❌ Failed to update location:", res.message);
        }
      } catch (err) {
        console.error("❌ Location update error:", err);
      }
    } else {
      try {
        const response = await updateOrganization(organizationId, formData);
        if (response.success) {
          console.log("✅ Organization updated successfully");
        } else {
          console.error("❌ Update failed:", response.message);
        }
      } catch (error) {
        console.error("❌ Error updating organization:", error);
      }
    }

    setEditingSection(null);
    close();
  };

  if (orgLoading || !formData) {
    return (
      <Container size="md" mt="lg">
        <Loader size="sm" />
        <Text mt="sm">Loading organization data...</Text>
      </Container>
    );
  }

  return (
    <Container size="md" mt="lg">
      <Modal
        opened={opened}
        onClose={close}
        title="Edit Organization"
        size="lg"
      >
        <Title order={4} mb="xs">
          General Info
        </Title>
        <Divider mb="sm" />
        <TextInput
          label="Registration Number"
          value={formData.registrationNumber}
          onChange={(e) =>
            handleChange("registrationNumber", e.currentTarget.value)
          }
          required
        />
        <TextInput
          label="Display Name"
          value={formData.displayName}
          onChange={(e) => handleChange("displayName", e.currentTarget.value)}
          mt="sm"
        />
        <TextInput
          label="Type"
          value={formData.type}
          onChange={(e) => handleChange("type", e.currentTarget.value)}
          mt="sm"
        />
        <Select
          label="Sector"
          placeholder="Select sector"
          value={formData.sectorId}
          onChange={(value) => handleChange("sectorId", value)}
          data={categories.map((cat: any) => ({
            value: cat.id,
            label: cat.name,
          }))}
          mt="sm"
          disabled={categoriesLoading}
        />
        <NumberInput
          label="Year Founded"
          value={formData.yearFounded}
          onChange={(value) => {
            const intValue = parseInt(value as string) || 0;
            handleChange("yearFounded", intValue);
          }}
          // onChange={(value) => handleChange("yearFounded", value || 0)}
          mt="sm"
        />
        <Select
          label="Company Size"
          value={formData.companySize}
          onChange={(value) => handleChange("companySize", value)}
          data={[
            "1-10",
            "11-50",
            "51-200",
            "201-500",
            "500+",
            "Small-sized: 10 to 49 employees",
          ]}
          mt="sm"
        />

        <Title order={4} mt="xl" mb="xs">
          Description
        </Title>
        <Divider mb="sm" />
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.currentTarget.value)}
          mt="sm"
        />

        <Group justify="flex-end" mt="lg">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </Group>
      </Modal>
      <Card withBorder radius="md" padding="xl" shadow="sm">
        {/* Header Section */}
        <Group justify="space-between" align="start">
          <Group align="center">
            <Avatar
              src={formData.logoUrl || "https://placehold.co/80x80"}
              size={80}
              radius="xl"
            />
            <Box>
              <Title order={3} fw={600}>
                {formData.displayName}
              </Title>
              <Group gap="xs" mt={4}>
                <ThemeIcon size="sm" variant="light" color="gray">
                  <IconMapPin size={14} />
                </ThemeIcon>
                <Text size="sm" color="dimmed">
                  Founded: {formData.yearFounded || "N/A"}
                </Text>
              </Group>
              <Group gap="xs" mt={4}>
                <ThemeIcon size="sm" variant="light" color="gray">
                  <IconAt size={14} />
                </ThemeIcon>
                <Text size="sm" color="dimmed">
                  Type: {formData.type || "N/A"}
                </Text>
              </Group>
            </Box>
          </Group>

          <Button
            variant="light"
            leftSection={<IconEdit size={16} />}
            onClick={open}
          >
            Edit
          </Button>
        </Group>

        {/* Tags */}
        <Group mt="md" gap="xs">
          <Badge color="blue" variant="light">
            {formData.displayName}
          </Badge>
          <Badge color="gray" variant="outline">
            Reg No: {formData.registrationNumber}
          </Badge>
        </Group>

        {/* Sector Section */}
        <Box mt="xl">
          <Title order={5} mb="xs" fw={600}>
            🏢 Sector(s)
          </Title>
          {/* {skills?.length > 0 ? (
            <Group gap="xs" wrap="wrap">
              {skills.map((skill) => (
                <Badge key={skill} variant="light" color="gray">
                  {skill}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text size="sm" color="dimmed">
              No sectors listed.
            </Text>
          )} */}
          <Badge variant="light" color="gray">
            {formData.sector?.name}
          </Badge>
        </Box>

        {/* Description */}
        <Box mt="xl">
          <Title order={5} mb="xs" fw={600}>
            📝 Description
          </Title>
          <Card withBorder radius="sm" padding="md" bg="gray.0">
            <Text size="sm" color="dimmed" lh={1.6}>
              {formData.description || "No description provided."}
            </Text>
          </Card>
        </Box>
      </Card>

      {/* Contact + Location Info Card */}
      <Card withBorder radius="md" padding="lg" shadow="sm" mt="xl">
        {/* Contact Info Section */}
        <Box>
          <Group justify="space-between" align="center" mb="xs">
            <Title order={6}>📞 Contact Information</Title>
            <Button
              size="xs"
              variant={isEditing ? "filled" : "light"}
              leftSection={<IconEdit size={14} />}
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Group>
          <Divider mb="md" />
          <Group wrap="wrap" gap="md">
            {[
              {
                label: "📞 Phone",
                type: "Mobile",
                placeholder: "+251912345678",
              },
              {
                label: "✉️ Email",
                type: "Email",
                placeholder: "example@email.com",
              },
              {
                label: "🏠 Other Address",
                type: "Home",
                placeholder: "123 Main Street, City",
              },
            ].map(({ label, type, placeholder }) => {
              const index =
                formData.contacts?.findIndex(
                  (c: { type: string }) => c.type === type
                ) ?? -1;
              const value = index >= 0 ? formData.contacts[index].value : "";

              return (
                <Box
                  key={type}
                  p="md"
                  w={{ base: "100%", sm: "48%", md: "30%" }}
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Text size="xs" color="dimmed" mb={4}>
                    {label}
                  </Text>

                  {isEditing ? (
                    <TextInput
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => {
                        const updated = [...(formData.contacts || [])];
                        if (index >= 0) {
                          updated[index] = {
                            ...updated[index],
                            value: e.currentTarget.value,
                          };
                        } else {
                          updated.push({
                            type,
                            value: e.currentTarget.value,
                            isPreferred: false,
                          });
                        }
                        handleChange("contacts", updated);
                      }}
                    />
                  ) : (
                    <Text fw={400}>{value || "-"}</Text>
                  )}
                </Box>
              );
            })}
          </Group>

          {isEditing && (
            <Group justify="flex-end" mt="lg">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSubmit(); // Optional: submit changes
                  setIsEditing(false);
                }}
              >
                Save Changes
              </Button>
            </Group>
          )}
        </Box>

        {/* <Box>
          <Group justify="space-between" align="center" mb="xs">
            <Title order={6}>📞 Contact Information</Title>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconEdit size={14} />}
              onClick={() => {
                contactModalHandlers.open();
              }}
            >
              Edit
            </Button>
          </Group>
          <Divider mb="md" />
          <Group wrap="wrap" gap="md">
            {[
              { label: "📞 Phone", type: "Mobile" },
              { label: "✉️ Email", type: "Email" },
              { label: "🏠 Other Address", type: "Home" },
            ].map(({ label, type }) => {
              const contact = formData.contacts?.find(
                (c: { type: string }) => c.type === type
              );
              return (
                <Box
                  key={type}
                  p="md"
                  w={{ base: "100%", sm: "48%", md: "30%" }}
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Text size="xs" color="dimmed" mb={4}>
                    {label}
                  </Text>
                  <Text fw={400}>{contact?.value || "-"}</Text>
                </Box>
              );
            })}
          </Group>
        </Box> */}

        {/* Location Info Section */}
        <Box mt="xl">
          <Group justify="space-between" align="center" mb="xs">
            <Title order={6}>📍 Location Details</Title>
            <Button
              size="xs"
              variant={isEditingLocation ? "filled" : "light"}
              leftSection={<IconEdit size={14} />}
              onClick={() => setIsEditingLocation((prev) => !prev)}
            >
              {isEditingLocation ? "Save" : "Edit"}
            </Button>
          </Group>
          <Divider mb="md" />
          <Group gap="md" wrap="wrap">
            {[
              "country",
              "region",
              "city",
              "subcity",
              "woreda",
              "houseNumber",
            ].map((field) => {
              const value =
                formData.locations?.[0]?.locationData?.[field] || "";

              return (
                <Box key={field} w={{ base: "100%", sm: "45%", md: "30%" }}>
                  <Text size="xs" c="dimmed">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>

                  {isEditingLocation ? (
                    <TextInput
                      value={value}
                      onChange={(e) => {
                        const updated = [...(formData.locations || [{}])];
                        updated[0] = {
                          ...updated[0],
                          locationData: {
                            ...updated[0].locationData,
                            [field]: e.currentTarget.value,
                          },
                        };
                        handleChange("locations", updated);
                      }}
                      placeholder={`Enter ${field}`}
                    />
                  ) : (
                    <Text fw={400}>{value || "-"}</Text>
                  )}
                </Box>
              );
            })}
          </Group>

          {isEditingLocation && (
            <Group justify="flex-end" mt="lg">
              <Button
                variant="outline"
                onClick={() => setIsEditingLocation(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSubmit(); // Submit updates
                  setIsEditingLocation(false);
                }}
              >
                Save Changes
              </Button>
            </Group>
          )}
        </Box>

        {/* <Box mt="xl">
          <Group justify="space-between" align="center" mb="xs">
            <Title order={6}>📍 Location Details</Title>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconEdit size={14} />}
              onClick={() => {
                locationModalHandlers.open();
              }}
            >
              Edit
            </Button>
          </Group>
          <Divider mb="md" />
          <Group gap="md" wrap="wrap">
            {[
              "country",
              "region",
              "city",
              "subcity",
              "woreda",
              "houseNumber",
            ].map((field) => (
              <Box key={field} w={{ base: "100%", sm: "45%", md: "30%" }}>
                <Text size="xs" c="dimmed">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Text>
                <Text fw={400}>
                  {formData.locations?.[0]?.locationData?.[field] || "-"}
                </Text>
              </Box>
            ))}
          </Group>
        </Box> */}
      </Card>

      {/* Section-based Edit Modal */}
      <Modal
        opened={contactModalOpened}
        onClose={contactModalHandlers.close}
        title="Update Contact Information"
        size="lg"
      >
        {[
          {
            label: "📞 Phone Number",
            type: "Mobile",
            placeholder: "+251912345678",
          },
          {
            label: "✉️ Email Address",
            type: "Email",
            placeholder: "example@email.com",
          },
          {
            label: "🏠 Other Address",
            type: "Home",
            placeholder: "123 Main Street, City",
          },
        ].map(({ label, type, placeholder }) => {
          const index =
            formData.contacts?.findIndex(
              (c: { type: string }) => c.type === type
            ) ?? -1;
          const value = index >= 0 ? formData.contacts[index].value : "";

          return (
            <TextInput
              key={type}
              label={label}
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                const updated = [...(formData.contacts || [])];
                if (index >= 0) {
                  updated[index] = {
                    ...updated[index],
                    value: e.currentTarget.value,
                  };
                } else {
                  updated.push({
                    type,
                    value: e.currentTarget.value,
                    isPreferred: false,
                  });
                }
                handleChange("contacts", updated);
              }}
              mt="sm"
            />
          );
        })}
        <Group justify="flex-end" mt="lg">
          <Button variant="outline" onClick={contactModalHandlers.close}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              contactModalHandlers.close();
            }}
          >
            Save
          </Button>
        </Group>
      </Modal>
      <Modal
        opened={locationModalOpened}
        onClose={locationModalHandlers.close}
        title="Update Location Details"
        size="lg"
      >
        {["country", "region", "city", "subcity", "woreda", "houseNumber"].map(
          (field) => (
            <TextInput
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData.locations?.[0]?.locationData?.[field] || ""}
              onChange={(e) => {
                const updated = [...(formData.locations || [{}])];
                updated[0] = {
                  ...updated[0],
                  locationData: {
                    ...updated[0].locationData,
                    [field]: e.currentTarget.value,
                  },
                };
                handleChange("locations", updated);
              }}
              mt="sm"
            />
          )
        )}
        <Group justify="flex-end" mt="lg">
          <Button variant="outline" onClick={locationModalHandlers.close}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              locationModalHandlers.close();
            }}
          >
            Save
          </Button>
        </Group>
      </Modal>

      {organizationId && <UploadFile orgId={organizationId} />}
    </Container>
  );
}

export default UserProfile;
