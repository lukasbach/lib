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
  weight?: number;
}

let cached: CampaignService | undefined = undefined;

export class CampaignService {

  constructor(
    public campaigns: CampaignData[],
  ) {
  }

  public get totalWeight() {
    return this.campaigns
      .map(campaign => campaign.weight ?? 1)
      .reduce((a, b) => a + b, 0);
  }

  public get campaignsWeighted() {
    return this.campaigns
      .map(campaign => 'x'.repeat(campaign.weight ?? 1).split('').map(x => campaign))
      .reduce((a, b) => [...a, ...b], []);
  }

  public chooseCampaignWeighted() {
    const campaignsWeighted = this.campaignsWeighted;
    return campaignsWeighted[Math.floor(Math.random() * campaignsWeighted.length)];
  }

  public chooseCampaign() {
    return this.campaigns[Math.floor(Math.random() * this.campaigns.length)];
  }
}

export const fetchCampaignData = async (options?: FetchCampaignDataOptions): Promise<CampaignService> => {
  if (!options?.noCache && cached !== undefined) {
    return cached;
  }

  const request = await fetch(options?.url ?? 'https://lukasbach.github.io/lib/campaigns.json');
  const json = await request.json();
  let campaigns = json as CampaignData[];

  if (options?.ignore) {
    campaigns = campaigns.filter(campaign => !options.ignore?.includes(campaign.key));
  }

  const service = new CampaignService(campaigns);

  if (!options?.noCache) {
    cached = service;
  }

  return service;
};
