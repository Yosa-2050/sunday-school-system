"use client";

import { Container, LoadingOverlay, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsAdminById } from "app/[locale]/_api/admin/fetch-jobs-by-id";
import { useParams } from "next/navigation";
import { JobDetailsView } from "./components/JobDetailsView";

const JobDetails = () => {
  const params = useParams();
  const jobId = params.id as string;

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobsAdminById(jobId),
  });

  if (isLoading) {
    return <LoadingOverlay visible={true} h="100vh" />;
  }

  if (!job) {
    return <Text>Job not found</Text>;
  }

  return (
    <Container fluid style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <JobDetailsView job={job} />
    </Container>
  );
};

export default JobDetails;
