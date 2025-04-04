'use client';

import {
    ActionIcon,
    Anchor,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    Divider,
    FileInput,
    Flex,
    Group,
    List,
    Paper,
    Progress,
    Radio,
    Rating,
    Select,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    TextInput,
    Textarea,
    Title,
    Tooltip,
} from '@mantine/core';
import { logger } from '@shega/shared';
import {
    IconAlertCircle,
    IconBuilding,
    IconCalendar,
    IconCheck,
    IconClock,
    IconCurrencyDollar,
    IconDeviceFloppy,
    IconFileText,
    IconHelp,
    IconMapPin,
    IconUpload,
} from '@tabler/icons-react';
import { useState } from 'react';

export default function JobApplicationDetail() {
    const [activeTab, setActiveTab] = useState('overview');
    const [savedJob, setSavedJob] = useState(false);
    const [applicationProgress, setApplicationProgress] = useState(60);
    const [formData, setFormData] = useState({
        fullName: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '(555) 123-4567',
        portfolio: 'https://alexjohnson.dev',
        experience: '3-5 years',
        availability: '2 weeks',
        relocate: 'no',
        salaryExpectation: '$90,000 - $120,000',
        coverLetter: '',
        agreeToTerms: true,
    });

    // Mock uploaded files
    const [uploadedFiles, setUploadedFiles] = useState([
        {
            id: 1,
            name: 'Alex_Johnson_Resume.pdf',
            size: '1.2 MB',
            type: 'resume',
            uploaded: true,
        },
        {
            id: 2,
            name: 'Portfolio_2023.pdf',
            size: '3.7 MB',
            type: 'portfolio',
            uploaded: true,
        },
    ]);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleCheckboxChange = (e: { target: { checked: any } }) => {
        setFormData((prev) => ({ ...prev, agreeToTerms: e.target.checked }));
    };

    const handleRadioChange = (name: string, value: string | null) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // const handleFileUpload = (files: string | any[]) => {
    //   if (files && files.length > 0) {
    //     const file = files[0];
    //     const newFile = {
    //       id: uploadedFiles.length + 1,
    //       name: file.name,
    //       size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    //       type: "other",
    //       uploaded: true,
    //     };
    //     setUploadedFiles([...uploadedFiles, newFile]);
    //   }
    // };

    const removeFile = (id: number) => {
        setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
    };

    const toggleSaveJob = () => {
        setSavedJob(!savedJob);
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        logger.log('Form submitted:', formData);
    };

    const applicationStatus = 'in-progress';

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'not-started':
                return 'Not Started';
            case 'in-progress':
                return 'In Progress';
            case 'submitted':
                return 'Submitted';
            case 'under-review':
                return 'Under Review';
            default:
                return 'Unknown';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'not-started':
                return 'gray';
            case 'in-progress':
                return 'orange';
            case 'submitted':
                return 'green';
            case 'under-review':
                return 'violet';
            default:
                return 'gray';
        }
    };

    return (
        // <AppShell padding="md" className="container mx-auto">
        //   <AppShell.Header>
        //     <Box h={60} p="md">
        //       <Group justify={"space-between"}>
        //         <Group>
        //           <ActionIcon
        //             component={Link}
        //             href="/jobs"
        //             variant="light"
        //             color="gray"
        //           >
        //             <IconArrowLeft size={16} />
        //           </ActionIcon>
        //           <Title order={4}>Senior Frontend Developer</Title>
        //         </Group>

        //         <Group>
        //           <Tooltip label={savedJob ? "Remove from saved jobs" : "Save job"}>
        //             <ActionIcon
        //               variant="subtle"
        //               color={savedJob ? "red" : "gray"}
        //               onClick={toggleSaveJob}
        //             >
        //               {savedJob ? (
        //                 <IconHeart size={20} fill="currentColor" />
        //               ) : (
        //                 <IconHeartOff size={20} />
        //               )}
        //             </ActionIcon>
        //           </Tooltip>

        //           <Tooltip label="Share job">
        //             <ActionIcon variant="subtle" color="gray">
        //               <IconShare size={20} />
        //             </ActionIcon>
        //           </Tooltip>

        //           <Menu shadow="md" width={200}>
        //             <Menu.Target>
        //               <Group gap="xs" style={{ cursor: "pointer" }}>
        //                 <Avatar
        //                   size="sm"
        //                   radius="xl"
        //                   src="/placeholder.svg"
        //                   alt="Alex Johnson"
        //                 >
        //                   AJ
        //                 </Avatar>
        //                 <Text size="sm" fw={500}>
        //                   Alex Johnson
        //                 </Text>
        //               </Group>
        //             </Menu.Target>

        //             <Menu.Dropdown>
        //               <Menu.Item>Profile</Menu.Item>
        //               <Menu.Item>Applications</Menu.Item>
        //               <Menu.Item>Saved Jobs</Menu.Item>
        //               <Menu.Divider />
        //               <Menu.Item color="red">Sign Out</Menu.Item>
        //             </Menu.Dropdown>
        //           </Menu>
        //         </Group>
        //       </Group>
        //     </Box>
        //   </AppShell.Header>
        <Container size={'xl'} className="container mx-auto" my={'xl'}>
            {/* Application Status Bar */}
            <Flex justify={'space-between'} ta="start" gap="md">
                <Group gap={'md'}>
                    <Card className="w-full">
                        <Group justify={'space-between'}>
                            <Stack gap="xs">
                                <Title order={5}>Application Status</Title>
                                <Group>
                                    <Badge
                                        color={getStatusColor(
                                            applicationStatus,
                                        )}
                                    >
                                        {getStatusLabel(applicationStatus)}
                                    </Badge>
                                    <Text size="sm" color="dimmed">
                                        Last saved 2 hours ago
                                    </Text>
                                </Group>
                            </Stack>

                            <Stack gap="xs" w={200}>
                                <Group justify={'space-between'}>
                                    <Text size="sm">Progress</Text>
                                    <Text size="sm">
                                        {applicationProgress}%
                                    </Text>
                                </Group>
                                <Progress
                                    value={applicationProgress}
                                    size="sm"
                                />
                            </Stack>
                        </Group>
                    </Card>

                    {/* Main Content */}
                    {/* sx={{ flex: 2 }} */}
                    <Card bg={'white'} className="!w-full">
                        <Tabs value={activeTab}>
                            <Tabs.List>
                                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                                {/* <Tabs.Tab value="company">Company</Tabs.Tab> */}
                                <Tabs.Tab value="application">
                                    Application
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="overview" pt="md">
                                <Stack gap="md">
                                    <Group>
                                        <Avatar
                                            size="lg"
                                            radius="md"
                                            src="/placeholder.svg"
                                            alt="TechCorp Logo"
                                        />
                                        <Stack gap={0}>
                                            <Title order={3}>
                                                Senior Frontend Developer
                                            </Title>
                                            <Group gap="xs">
                                                <Group gap={4}>
                                                    <IconBuilding
                                                        size={16}
                                                        color="gray"
                                                    />
                                                    <Text
                                                        size="sm"
                                                        color="dimmed"
                                                    >
                                                        TechCorp Inc.
                                                    </Text>
                                                </Group>
                                                <Divider orientation="vertical" />
                                                <Rating
                                                    value={4.5}
                                                    fractions={2}
                                                    readOnly
                                                />
                                                <Text size="sm" color="dimmed">
                                                    4.5 (126 reviews)
                                                </Text>
                                            </Group>
                                            <Group gap="md" mt={4}>
                                                <Group gap={4}>
                                                    <IconMapPin
                                                        size={16}
                                                        color="gray"
                                                    />
                                                    <Text
                                                        size="sm"
                                                        color="dimmed"
                                                    >
                                                        San Francisco, CA
                                                        (Remote option)
                                                    </Text>
                                                </Group>
                                                <Group gap={4}>
                                                    <IconCurrencyDollar
                                                        size={16}
                                                        color="gray"
                                                    />
                                                    <Text
                                                        size="sm"
                                                        color="dimmed"
                                                    >
                                                        $120K - $150K yearly
                                                    </Text>
                                                </Group>
                                                <Group gap={4}>
                                                    <IconClock
                                                        size={16}
                                                        color="gray"
                                                    />
                                                    <Text
                                                        size="sm"
                                                        color="dimmed"
                                                    >
                                                        Full-time
                                                    </Text>
                                                </Group>
                                                <Group gap={4}>
                                                    <IconCalendar
                                                        size={16}
                                                        color="gray"
                                                    />
                                                    <Text
                                                        size="sm"
                                                        color="dimmed"
                                                    >
                                                        Posted 3 days ago
                                                    </Text>
                                                </Group>
                                            </Group>
                                        </Stack>
                                    </Group>

                                    <Stack gap="md">
                                        <Stack gap="xs">
                                            <Group>
                                                <Title order={4}>
                                                    Job Description
                                                </Title>
                                                <Badge>New</Badge>
                                            </Group>
                                            <Text color="dimmed">
                                                We are seeking a talented Senior
                                                Frontend Developer to join our
                                                innovative team. In this role,
                                                you will work closely with
                                                designers, backend developers,
                                                and product managers to create
                                                exceptional user experiences.
                                            </Text>
                                        </Stack>

                                        <Stack gap="xs">
                                            <Title order={4}>
                                                Responsibilities
                                            </Title>
                                            <List size="sm" color="dimmed">
                                                <List.Item>
                                                    Develop and maintain
                                                    responsive, cross-browser
                                                    compatible web applications
                                                </List.Item>
                                                <List.Item>
                                                    Build reusable code and
                                                    libraries for future use
                                                </List.Item>
                                                <List.Item>
                                                    Optimize applications for
                                                    maximum speed and
                                                    scalability
                                                </List.Item>
                                                <List.Item>
                                                    Collaborate with
                                                    cross-functional teams to
                                                    define, design, and ship new
                                                    features
                                                </List.Item>
                                                <List.Item>
                                                    Ensure the technical
                                                    feasibility of UI/UX designs
                                                </List.Item>
                                                <List.Item>
                                                    Identify and correct
                                                    bottlenecks and bugs
                                                </List.Item>
                                                <List.Item>
                                                    Help maintain code quality,
                                                    organization, and
                                                    automatization
                                                </List.Item>
                                            </List>
                                        </Stack>

                                        <Stack gap="xs">
                                            <Title order={4}>
                                                Requirements
                                            </Title>
                                            <List size="sm" color="dimmed">
                                                <List.Item>
                                                    5+ years of experience in
                                                    frontend development
                                                </List.Item>
                                                <List.Item>
                                                    Proficiency in JavaScript,
                                                    HTML5, CSS3, and React
                                                </List.Item>
                                                <List.Item>
                                                    Experience with modern
                                                    frontend frameworks and
                                                    libraries
                                                </List.Item>
                                                <List.Item>
                                                    Familiarity with RESTful
                                                    APIs and GraphQL
                                                </List.Item>
                                                <List.Item>
                                                    Understanding of server-side
                                                    rendering and its benefits
                                                </List.Item>
                                                <List.Item>
                                                    Knowledge of UI/UX design
                                                    principles
                                                </List.Item>
                                                <List.Item>
                                                    Experience with version
                                                    control systems (Git)
                                                </List.Item>
                                                <List.Item>
                                                    Excellent problem-solving
                                                    skills and attention to
                                                    detail
                                                </List.Item>
                                            </List>
                                        </Stack>

                                        <Stack gap="xs">
                                            <Title order={4}>
                                                Skills & Expertise
                                            </Title>
                                            <Group gap="xs">
                                                {[
                                                    'React',
                                                    'TypeScript',
                                                    'Next.js',
                                                    'Redux',
                                                    'HTML5',
                                                    'CSS3',
                                                    'JavaScript',
                                                    'REST APIs',
                                                    'Responsive Design',
                                                    'UI/UX',
                                                ].map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="outline"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </Group>
                                        </Stack>

                                        <Stack gap="xs">
                                            <Title order={4}>Benefits</Title>
                                            <List size="sm" color="dimmed">
                                                <List.Item>
                                                    Competitive salary and
                                                    equity package
                                                </List.Item>
                                                <List.Item>
                                                    Health, dental, and vision
                                                    insurance
                                                </List.Item>
                                                <List.Item>
                                                    401(k) matching
                                                </List.Item>
                                                <List.Item>
                                                    Flexible working hours and
                                                    remote work options
                                                </List.Item>
                                                <List.Item>
                                                    Professional development
                                                    budget
                                                </List.Item>
                                                <List.Item>
                                                    Unlimited PTO policy
                                                </List.Item>
                                                <List.Item>
                                                    Home office stipend
                                                </List.Item>
                                                <List.Item>
                                                    Team retreats and social
                                                    events
                                                </List.Item>
                                            </List>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Tabs.Panel>
                            {/* 
              <Tabs.Panel value="company" pt="md">
                <Stack gap="md">
                  <Group>
                    <Avatar
                      size="xl"
                      radius="md"
                      src="/placeholder.svg"
                      alt="TechCorp Logo"
                    />
                    <Stack gap={0}>
                      <Title order={3}>TechCorp Inc.</Title>
                      <Text color="dimmed">
                        Technology · 500-1000 employees · Founded 2010
                      </Text>
                      <Group gap="xs" mt={4}>
                        <Rating value={4.5} fractions={2} readOnly />
                        <Text size="sm" color="dimmed">
                          4.5 (126 reviews)
                        </Text>
                      </Group>
                    </Stack>
                  </Group>

                  <Stack gap="xs">
                    <Title order={4}>About the company</Title>
                    <Text color="dimmed">
                      TechCorp is a leading technology company specializing in
                      cloud-based solutions and innovative software products.
                      Founded in 2010, we've grown from a small startup to an
                      industry leader with offices across the globe. Our mission
                      is to simplify complex technological challenges and
                      empower organizations to achieve more with less effort.
                    </Text>
                    <Text color="dimmed">
                      At TechCorp, we believe in fostering a diverse and
                      inclusive workplace where creativity and innovation
                      thrive. We are committed to building products that make a
                      positive impact on the world while providing our team
                      members with opportunities for growth and development.
                    </Text>
                  </Stack>

                  <SimpleGrid
                    cols={4}
                    breakpoints={[{ maxWidth: "sm", cols: 2 }]}
                  >
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Industry
                      </Text>
                      <Text fw={500}>Technology</Text>
                    </Card>
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Company size
                      </Text>
                      <Text fw={500}>500-1000</Text>
                    </Card>
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Founded
                      </Text>
                      <Text fw={500}>2010</Text>
                    </Card>
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Revenue
                      </Text>
                      <Text fw={500}>$50M-$100M</Text>
                    </Card>
                  </SimpleGrid>

                  <Stack gap="xs">
                    <Title order={4}>Company culture</Title>
                    <SimpleGrid cols={2}>
                      <Stack gap="xs">
                        <Text size="sm">Work-Life Balance</Text>
                        <Progress value={90} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          9/10
                        </Text>
                      </Stack>
                      <Stack gap="xs">
                        <Text size="sm">Professional Growth</Text>
                        <Progress value={85} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          8.5/10
                        </Text>
                      </Stack>
                      <Stack gap="xs">
                        <Text size="sm">Compensation & Benefits</Text>
                        <Progress value={95} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          9.5/10
                        </Text>
                      </Stack>
                      <Stack gap="xs">
                        <Text size="sm">Company Culture</Text>
                        <Progress value={90} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          9/10
                        </Text>
                      </Stack>
                    </SimpleGrid>
                  </Stack>

                  <Stack gap="xs">
                    <Title order={4}>Location</Title>
                    <Image
                      src="/placeholder.svg"
                      alt="Company location map"
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                    <Text size="sm" color="dimmed">
                      Headquarters: 123 Tech Avenue, San Francisco, CA 94105
                    </Text>
                  </Stack>
                </Stack>
              </Tabs.Panel> */}

                            <Tabs.Panel value="application" pt="md">
                                <form
                                    onSubmit={handleSubmit}
                                    className="w-full"
                                >
                                    <Stack gap="xl">
                                        {/* Personal Information */}
                                        <Stack gap="sm">
                                            <Group justify={'space-between'}>
                                                <Title order={4}>
                                                    Personal Information
                                                </Title>
                                                <Badge
                                                    color="green"
                                                    variant="light"
                                                    leftSection={
                                                        <IconCheck size={12} />
                                                    }
                                                >
                                                    Auto-filled
                                                </Badge>
                                            </Group>

                                            <SimpleGrid
                                                cols={2}
                                                // breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                                            >
                                                <TextInput
                                                    label="Full Name"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                />
                                                <TextInput
                                                    label="Email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                                <TextInput
                                                    label="Phone Number"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                                <TextInput
                                                    label="Portfolio Website"
                                                    name="portfolio"
                                                    value={formData.portfolio}
                                                    onChange={handleInputChange}
                                                />
                                            </SimpleGrid>
                                        </Stack>

                                        {/* Experience */}
                                        <Stack gap="sm">
                                            <Title order={4}>
                                                Experience & Preferences
                                            </Title>

                                            <SimpleGrid
                                                cols={2}
                                                // breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                                            >
                                                <Select
                                                    label="Years of Experience"
                                                    data={[
                                                        {
                                                            value: '0-1 year',
                                                            label: '0-1 year',
                                                        },
                                                        {
                                                            value: '1-3 years',
                                                            label: '1-3 years',
                                                        },
                                                        {
                                                            value: '3-5 years',
                                                            label: '3-5 years',
                                                        },
                                                        {
                                                            value: '5-7 years',
                                                            label: '5-7 years',
                                                        },
                                                        {
                                                            value: '7+ years',
                                                            label: '7+ years',
                                                        },
                                                    ]}
                                                    value={formData.experience}
                                                    onChange={(value) =>
                                                        handleRadioChange(
                                                            'experience',
                                                            value,
                                                        )
                                                    }
                                                />
                                                <Select
                                                    label="Availability to Start"
                                                    data={[
                                                        {
                                                            value: 'immediately',
                                                            label: 'Immediately',
                                                        },
                                                        {
                                                            value: '1 week',
                                                            label: '1 week',
                                                        },
                                                        {
                                                            value: '2 weeks',
                                                            label: '2 weeks',
                                                        },
                                                        {
                                                            value: '1 month',
                                                            label: '1 month',
                                                        },
                                                        {
                                                            value: '2+ months',
                                                            label: '2+ months',
                                                        },
                                                    ]}
                                                    value={
                                                        formData.availability
                                                    }
                                                    onChange={(value) =>
                                                        handleRadioChange(
                                                            'availability',
                                                            value,
                                                        )
                                                    }
                                                />
                                            </SimpleGrid>

                                            <SimpleGrid
                                                cols={2}
                                                // breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                                            >
                                                <Stack gap="sm">
                                                    <Text size="sm">
                                                        Willing to Relocate?
                                                    </Text>
                                                    <Radio.Group
                                                        value={
                                                            formData.relocate
                                                        }
                                                        onChange={(value) =>
                                                            handleRadioChange(
                                                                'relocate',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <Stack gap="xs">
                                                            <Radio
                                                                value="yes"
                                                                label="Yes"
                                                            />
                                                            <Radio
                                                                value="no"
                                                                label="No"
                                                            />
                                                            <Radio
                                                                value="maybe"
                                                                label="Maybe, depending on location"
                                                            />
                                                        </Stack>
                                                    </Radio.Group>
                                                </Stack>
                                                <TextInput
                                                    label="Salary Expectation"
                                                    name="salaryExpectation"
                                                    value={
                                                        formData.salaryExpectation
                                                    }
                                                    onChange={handleInputChange}
                                                />
                                            </SimpleGrid>
                                            <Text size="xs" color="dimmed">
                                                Salary range for this position:
                                                $120,000 - $150,000
                                            </Text>
                                        </Stack>

                                        {/* Documents */}
                                        <Stack gap="sm">
                                            <Group justify={'space-between'}>
                                                <Title order={4}>
                                                    Documents
                                                </Title>
                                                <Tooltip label="Upload your resume and any other relevant documents. Accepted formats: PDF, DOC, DOCX. Maximum 5MB per file.">
                                                    <ActionIcon>
                                                        <IconHelp size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>

                                            <Stack gap="sm">
                                                {uploadedFiles.map((file) => (
                                                    <Paper
                                                        key={file.id}
                                                        p="sm"
                                                        withBorder
                                                    >
                                                        <Group
                                                            justify={
                                                                'space-between'
                                                            }
                                                        >
                                                            <Group>
                                                                <IconFileText
                                                                    size={20}
                                                                    color="gray"
                                                                />
                                                                <Stack gap={0}>
                                                                    <Text size="sm">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </Text>
                                                                    <Text
                                                                        size="xs"
                                                                        color="dimmed"
                                                                    >
                                                                        {
                                                                            file.size
                                                                        }
                                                                    </Text>
                                                                </Stack>
                                                                {file.type ===
                                                                    'resume' && (
                                                                    <Badge
                                                                        color="green"
                                                                        variant="light"
                                                                    >
                                                                        Primary
                                                                        Resume
                                                                    </Badge>
                                                                )}
                                                            </Group>
                                                            <Button
                                                                variant="subtle"
                                                                color="red"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeFile(
                                                                        file.id,
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Group>
                                                    </Paper>
                                                ))}

                                                <FileInput
                                                    placeholder="Drop files here or click to upload"
                                                    leftSection={
                                                        <IconUpload size={14} />
                                                    }
                                                    // onChange={handleFileUpload}
                                                    accept=".pdf,.doc,.docx"
                                                    description="Attach additional documents (optional)"
                                                />
                                            </Stack>
                                        </Stack>

                                        {/* Cover Letter */}
                                        <Stack gap="sm">
                                            <Group justify={'space-between'}>
                                                <Title order={4}>
                                                    Cover Letter{' '}
                                                    <Text
                                                        span
                                                        color="dimmed"
                                                        size="sm"
                                                    >
                                                        (Optional)
                                                    </Text>
                                                </Title>
                                                <Badge
                                                    color="orange"
                                                    variant="light"
                                                    leftSection={
                                                        <IconAlertCircle
                                                            size={12}
                                                        />
                                                    }
                                                >
                                                    Recommended
                                                </Badge>
                                            </Group>
                                            <Textarea
                                                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                                minRows={6}
                                                name="coverLetter"
                                                value={formData.coverLetter}
                                                onChange={handleInputChange}
                                            />
                                            <Text size="xs" color="dimmed">
                                                Adding a personalized cover
                                                letter increases your chance of
                                                getting an interview by 40%.
                                            </Text>
                                        </Stack>

                                        {/* Legal */}
                                        <Checkbox
                                            label={
                                                <>
                                                    I agree to the terms and
                                                    conditions. By applying, you
                                                    agree to our{' '}
                                                    <Anchor href="#" size="sm">
                                                        Privacy Policy
                                                    </Anchor>{' '}
                                                    and{' '}
                                                    <Anchor href="#" size="sm">
                                                        Terms of Service
                                                    </Anchor>
                                                </>
                                            }
                                            checked={formData.agreeToTerms}
                                            onChange={handleCheckboxChange}
                                            required
                                        />

                                        <Group grow>
                                            <Button
                                                variant="default"
                                                leftSection={
                                                    <IconDeviceFloppy
                                                        size={16}
                                                    />
                                                }
                                            >
                                                Save as Draft
                                            </Button>
                                            <Button type="submit">
                                                Submit Application
                                            </Button>
                                        </Group>
                                    </Stack>
                                </form>
                            </Tabs.Panel>
                        </Tabs>
                    </Card>
                </Group>

                {/* Sidebar */}
                <Box
                    style={{
                        flex: 1,
                        minWidth: 400,
                        width: 400,
                        maxWidth: 400,
                    }}
                >
                    <Stack gap="md">
                        <Card>
                            <Stack gap="sm">
                                <Title order={5}>Application Progress</Title>
                                <Stack gap="xs">
                                    <Group justify={'space-between'}>
                                        <Text size="sm">
                                            Profile Information
                                        </Text>
                                        <Badge
                                            color="green"
                                            variant="light"
                                            leftSection={
                                                <IconCheck size={12} />
                                            }
                                        >
                                            Complete
                                        </Badge>
                                    </Group>
                                    <Group justify={'space-between'}>
                                        <Text size="sm">Resume/CV</Text>
                                        <Badge
                                            color="green"
                                            variant="light"
                                            leftSection={
                                                <IconCheck size={12} />
                                            }
                                        >
                                            Complete
                                        </Badge>
                                    </Group>
                                    <Group justify={'space-between'}>
                                        <Text size="sm">
                                            Experience Details
                                        </Text>
                                        <Badge
                                            color="green"
                                            variant="light"
                                            leftSection={
                                                <IconCheck size={12} />
                                            }
                                        >
                                            Complete
                                        </Badge>
                                    </Group>
                                    <Group justify={'space-between'}>
                                        <Text size="sm">Cover Letter</Text>
                                        <Badge color="orange" variant="light">
                                            Missing
                                        </Badge>
                                    </Group>
                                    <Group justify={'space-between'}>
                                        <Text size="sm">Preferences</Text>
                                        <Badge
                                            color="green"
                                            variant="light"
                                            leftSection={
                                                <IconCheck size={12} />
                                            }
                                        >
                                            Complete
                                        </Badge>
                                    </Group>
                                </Stack>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => setActiveTab('application')}
                                >
                                    Continue Application
                                </Button>
                            </Stack>
                        </Card>

                        <Card>
                            <Stack gap="sm">
                                <Title order={5}>Similar Jobs</Title>
                                {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                                {[1, 2, 3].map((job) => (
                                    <Stack
                                        key={job}
                                        gap={4}
                                        pb="sm"
                                        style={{
                                            borderBottom: '1px solid #eee',
                                        }}
                                    >
                                        <Anchor size="sm">
                                            {job === 1
                                                ? 'Frontend Developer'
                                                : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                  job === 2
                                                  ? 'UI Engineer'
                                                  : 'React Developer'}
                                        </Anchor>
                                        <Group gap="xs">
                                            <IconBuilding
                                                size={14}
                                                color="gray"
                                            />
                                            <Text size="xs" color="dimmed">
                                                {job === 1
                                                    ? 'WebSolutions Ltd.'
                                                    : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                      job === 2
                                                      ? 'DesignHub Inc.'
                                                      : 'AppWorks Co.'}
                                            </Text>
                                        </Group>
                                        <Group gap="sm">
                                            <Group gap={4}>
                                                <IconMapPin
                                                    size={14}
                                                    color="gray"
                                                />
                                                <Text size="xs" color="dimmed">
                                                    {job === 1
                                                        ? 'Remote'
                                                        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                          job === 2
                                                          ? 'New York, NY'
                                                          : 'Austin, TX'}
                                                </Text>
                                            </Group>
                                            <Group gap={4}>
                                                <IconCurrencyDollar
                                                    size={14}
                                                    color="gray"
                                                />
                                                <Text size="xs" color="dimmed">
                                                    {job === 1
                                                        ? '$90-120K'
                                                        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                          job === 2
                                                          ? '$100-130K'
                                                          : '$110-140K'}
                                                </Text>
                                            </Group>
                                        </Group>
                                        <Badge variant="outline">
                                            90% match
                                        </Badge>
                                    </Stack>
                                ))}
                                <Button variant="outline" fullWidth>
                                    View more jobs
                                </Button>
                            </Stack>
                        </Card>

                        <Card>
                            <Stack gap="sm">
                                <Title order={5}>Application Tips</Title>
                                <Stack gap="xs">
                                    <Text size="sm" fw={500}>
                                        Highlight Relevant Skills
                                    </Text>
                                    <Text size="xs" color="dimmed">
                                        Make sure your resume emphasizes your
                                        experience with React, TypeScript, and
                                        front-end development.
                                    </Text>
                                </Stack>
                                <Stack gap="xs">
                                    <Text size="sm" fw={500}>
                                        Personalize Your Application
                                    </Text>
                                    <Text size="xs" color="dimmed">
                                        Add a cover letter explaining why
                                        you&pos;re a good fit for TechCorp
                                        specifically.
                                    </Text>
                                </Stack>
                                <Stack gap="xs">
                                    <Text size="sm" fw={500}>
                                        Follow Up
                                    </Text>
                                    <Text size="xs" color="dimmed">
                                        If you don&pos;t hear back within 7
                                        days, consider a polite follow-up.
                                    </Text>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                </Box>
            </Flex>
        </Container>
        // </AppShell>
    );
}
