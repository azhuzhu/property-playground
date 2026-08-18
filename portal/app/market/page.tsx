import type { Metadata } from "next";
import { MarketDashboard } from "@/components/market-dashboard";
import { getMarketData } from "@/lib/market";

export const metadata: Metadata = { title: "Market analysis" };
export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const market = await getMarketData();
  return (
    <div className="page-shell">
      <p className="eyebrow">App 02 · Java backend</p>
      <h1 className="page-title">Property market analysis</h1>
      <p className="page-copy">Explore market segments, compare price drivers, model a new scenario, and export the supplied housing data.</p>
      <MarketDashboard initialSummary={market.summary} initialProperties={market.properties} connected={market.connected} />
    </div>
  );
}
