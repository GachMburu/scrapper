import { connectToDatabase } from '@/lib/db';
import { Dataset } from '@/lib/models/Dataset';
import MarketplaceShell from '@/components/dashboard/MarketplaceShell';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectToDatabase();
  
  // Fetch all datasets sorted by newest
  const datasetsRaw = await Dataset.find({}).sort({ createdAt: -1 });
  const datasets = JSON.parse(JSON.stringify(datasetsRaw));

  return <MarketplaceShell initialDatasets={datasets} />;
}
