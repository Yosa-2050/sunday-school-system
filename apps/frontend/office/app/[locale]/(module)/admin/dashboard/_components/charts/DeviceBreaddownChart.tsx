import { DonutChart } from "@mantine/charts"
import { Card, Text } from "@mantine/core"

export default function DeviceBreakdownChart() {
  return (
    <Card w="100%" h="100%" shadow="sm" p="xl" radius={6}>
      <Card.Section>
        <Text fz={16} fw={600}>
          Device Breakdown
        </Text>
      </Card.Section>

      <Card.Section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        h="100%"
        mt={30}
      >
        <DonutChart
          withLabelsLine={false}
          thickness={28}
          withLabels={false}
          chartLabel="Sub cities"
          data={[
            { name: "Lafto", value: 400, color: "accent.3" },
            { name: "Abado", value: 300, color: "orange.6" },
            { name: "Haile Garment", value: 100, color: "white" },
            { name: "Other", value: 200, color: "red.5" },
          ]}
          style={{ width: '100%', height: '100%' }}
        />
      </Card.Section>
    </Card>
  )
}