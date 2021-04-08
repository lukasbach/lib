export interface FetchCampaignDataOptions {
  ignore?: string[];
  url?: string;
  noCache?: boolean;
}

export interface CampaignData {
  key: string;
  product: string;
  short: string;
  long?: string;
  url: string;
}

let cached: CampaignData[] | undefined = undefined;

export const fetchCampaignData = async (options?: FetchCampaignDataOptions): Promise<CampaignData[]> => {
  if (!options?.noCache && cached !== undefined) {
    return cached;
  }

  const request = await fetch(options?.url ?? 'https://lukasbach.github.io/lib/campaigns.json');
  const json = await request.json();
  let campaigns = json as CampaignData[];

  if (options?.ignore) {
    campaigns = campaigns.filter(campaign => !options.ignore?.includes(campaign.key));
  }

  if (!options?.noCache) {
    cached = campaigns;
  }

  return campaigns;
};
