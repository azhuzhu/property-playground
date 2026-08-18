import type { MarketSummary, Property } from "@/lib/types";

const JAVA_API_URL = process.env.JAVA_API_URL ?? "http://localhost:8080";

const fallbackSummary: MarketSummary = {
  count: 50,
  averagePrice: 267000,
  medianPrice: 257500,
  minimumPrice: 160000,
  maximumPrice: 410000,
  averageSquareFootage: 1702,
  segments: [
    { bedrooms: 2, count: 14, averagePrice: 179286 },
    { bedrooms: 3, count: 20, averagePrice: 242250 },
    { bedrooms: 4, count: 16, averagePrice: 372188 },
  ],
};

export async function getMarketData(): Promise<{
  summary: MarketSummary;
  properties: Property[];
  connected: boolean;
}> {
  try {
    const [summaryResponse, propertiesResponse] = await Promise.all([
      fetch(`${JAVA_API_URL}/api/market/summary`, { next: { revalidate: 60 } }),
      fetch(`${JAVA_API_URL}/api/market/properties`, { next: { revalidate: 60 } }),
    ]);
    if (!summaryResponse.ok || !propertiesResponse.ok) throw new Error("Market service unavailable");
    return {
      summary: await summaryResponse.json(),
      properties: await propertiesResponse.json(),
      connected: true,
    };
  } catch {
    return { summary: fallbackSummary, properties: [], connected: false };
  }
}
