import type { Config } from "../config";
export type Outcome = "success" | "blocked" | "error" | "unsupported";
export type Candidate = {
  name: string;
  url: string;
  baseId: string;
  sourceId?: string;
};
export type Detail = {
  field: string;
  value: unknown;
  scope: "property" | "unit";
  snippet?: string;
};
export interface Provider {
  name: string;
  capabilities: { discovery: boolean; details: boolean; datedOffers: boolean };
  discoverCandidates(
    config: Config,
    query: string,
    baseId: string,
  ): Promise<Candidate[]>;
  fetchPropertyDetails(property: {
    url: string;
  }): Promise<{ outcome: Outcome; facts: Detail[] }>;
  checkDatedOffer(
    unit: { id: string },
    dates: { checkIn: string; checkOut: string },
    adults: number,
  ): Promise<{ outcome: Outcome; availability: "unknown" }>;
  healthCheck(): Promise<{ configured: boolean; message: string }>;
}
