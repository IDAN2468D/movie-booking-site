import { NeuralDiscoveryDashboard } from "@/components/discover/NeuralDiscoveryDashboard";

export const metadata = {
  title: "מנוע תגליות נוירוני | MovieBook",
};

export default async function NeuralDiscoveryPage() {
  // Using a test ID for the scope of this scaffolding.
  // In production, integrate with auth() / session.
  const userId = "test-neural-user";
  
  return <NeuralDiscoveryDashboard userId={userId} />;
}
