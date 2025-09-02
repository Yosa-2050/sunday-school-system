// 'use client';

// import {
//     Modal,
//     TextInput,
//     Button,
//     Stack,
//     Group,
//     Paper,
//     Box,
//     Text,
//     Loader,
//     Divider,
// } from '@mantine/core';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { useState } from 'react';
// import { searchProfilesApi, createRelationshipApi } from '../schemas/api';
// import type { CreateRelationRequest, ProfileResponse } from '../schemas/type';

// interface CreateRelationModalProps {
//     opened: boolean;
//     onClose: () => void;
//     studentId: string | null;
// }

// export default function CreateRelationModal({
//     opened,
//     onClose,
//     profileId,
// }: CreateRelationModalProps) {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedProfile, setSelectedProfile] = useState<ProfileResponse | null>(null);
//     const [formData, setFormData] = useState<CreateRelationRequest>({
//         firstName: '',
//         lastName: '',
//         phoneNumber: '',
//         type: '',
//         isParent: false,
//         isEmergency: false
//     });

//     const searchProfilesQuery = useQuery({
//         queryKey: ['search-profiles', searchQuery],
//         queryFn: () => searchProfilesApi(searchQuery),
//         enabled: searchQuery.length > 2,
//     });

//     const createRelationshipMutation = useMutation({
//         mutationFn: createRelationshipApi,
//         onSuccess: () => {
//             onClose();
//             setSearchQuery('');
//             setSelectedProfile(null);
//             setFormData(RelationShi);
//         },
//         onError: (error) => {
//             //console.error('Failed to create relationship:', error);
//         },
//     });

//     const handleSearch = (query: string) => {
//         setSearchQuery(query);
//         setSelectedProfile(null);
//     };

//     const handleSelectProfile = (profile: Profile) => {
//         setSelectedProfile(profile);
//         setFormData({
//             firstName: profile.firstName,
//             lastName: profile.lastName,
//             phoneNumber: profile.phoneNumber,
//             email: profile.email,
//             relationshipType: '',
//         });
//     };

//     const handleCreateNew = () => {
//         setSelectedProfile(null);
//         setFormData({
//             firstName: '',
//             lastName: '',
//             phoneNumber: '',
//             email: '',
//             relationshipType: '',
//         });
//     };

//     const handleSubmit = async () => {
//         if (!profileId) { return; }

//         try {
//             const relationshipData = selectedProfile
//                 ? { profileId: selectedProfile.id, relationshipType: formData.relationshipType }
//                 : { ...formData, relationshipType: formData.relationshipType };

//             await createRelationshipMutation.mutateAsync({ profileId, relationshipData });
//         } catch (error) {
//             //console.error('Failed to create relationship:', error);
//         }
//     };

//     return (
//         <Modal
//             opened={opened}
//             onClose={onClose}
//             title="Add Emergency Contact"
//             size="lg"
//             centered
//         >
//             <Stack>
//                 <Text size="sm" c="dimmed">
//                     Search for existing profile or add new emergency contact
//                 </Text>

//                 {/* Search Section */}
//                 <Group>
//                     <TextInput
//                         placeholder="Search by phone number or email"
//                         value={searchQuery}
//                         onChange={(e) => handleSearch(e.target.value)}
//                         style={{ flex: 1 }}
//                     />
//                 </Group>

//                 {searchProfilesQuery.isLoading && <Loader size="sm" />}

//                 {searchProfilesQuery.data && searchProfilesQuery.data.length > 0 && !selectedProfile && (
//                     <Box>
//                         <Text size="sm" fw={500} mb="sm">Search Results:</Text>
//                         <Stack gap="sm">
//                             {searchProfilesQuery.data.map((profile: Profile) => (
//                                 <Paper key={profile.id} p="md" withBorder>
//                                     <Group justify="space-between">
//                                         <Box>
//                                             <Text fw={500}>
//                                                 {profile.firstName} {profile.lastName}
//                                             </Text>
//                                             <Text size="sm" c="dimmed">
//                                                 {profile.phoneNumber || profile.email}
//                                             </Text>
//                                         </Box>
//                                         <Button
//                                             size="sm"
//                                             onClick={() => handleSelectProfile(profile)}
//                                         >
//                                             Select
//                                         </Button>
//                                     </Group>
//                                 </Paper>
//                             ))}
//                         </Stack>
//                     </Box>
//                 )}

//                 {!selectedProfile && searchProfilesQuery.data?.length === 0 && searchQuery && (
//                     <Button variant="outline" onClick={handleCreateNew}>
//                         Create New Contact
//                     </Button>
//                 )}

//                 {(selectedProfile || !searchQuery) && (
//                     <>
//                         <Divider />

//                         <TextInput
//                             label="First Name"
//                             value={formData.firstName}
//                             onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                             required
//                             disabled={!!selectedProfile}
//                         />
//                         <TextInput
//                             label="Last Name"
//                             value={formData.lastName}
//                             onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                             required
//                             disabled={!!selectedProfile}
//                         />
//                         <TextInput
//                             label="Phone Number"
//                             value={formData.phoneNumber}
//                             onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                             required
//                             disabled={!!selectedProfile}
//                         />
//                         <TextInput
//                             label="Email"
//                             type="email"
//                             value={formData.email}
//                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                             disabled={!!selectedProfile}
//                         />
//                         <TextInput
//                             label="Relationship Type"
//                             placeholder="e.g., Parent, Guardian, Sibling"
//                             value={formData.relationshipType}
//                             onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
//                             required
//                         />

//                         <Group justify="flex-end" mt="md">
//                             <Button variant="outline" onClick={onClose}>
//                                 Cancel
//                             </Button>
//                             <Button
//                                 onClick={handleSubmit}
//                                 loading={createRelationshipMutation.isPending}
//                                 disabled={!formData.relationshipType || (!selectedProfile && (!((formData.firstName && formData.lastName ) && formData.phoneNumber)))}
//                             >
//                                 Add Emergency Contact
//                             </Button>
//                         </Group>
//                     </>
//                 )}
//             </Stack>
//         </Modal>
//     );
// }
