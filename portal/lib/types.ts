import type { HousingFeatures } from "@/lib/generated/contracts";

export type PropertyInput = HousingFeatures;

export type EstimateRecord = PropertyInput & {
  id: string;
  prediction: number;
  createdAt: string;
};

export type Property = PropertyInput & {
  id: number;
  price: number;
};

export type Segment = {
  bedrooms: number;
  count: number;
  averagePrice: number;
};

export type MarketSummary = {
  count: number;
  averagePrice: number;
  medianPrice: number;
  minimumPrice: number;
  maximumPrice: number;
  averageSquareFootage: number;
  segments: Segment[];
};
