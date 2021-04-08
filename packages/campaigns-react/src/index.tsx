import { fetchCampaignData, CampaignData, FetchCampaignDataOptions } from "@lukasbach/campaigns-fetch";
import * as React from 'react';
import { useEffect, useState } from 'react';

export const Campaign: React.FC<{
  render: (campaign: CampaignData | undefined, all: CampaignData[]) => JSX.Element | string;
  /** Change interval in seconds */
  changeInterval?: number;
} & FetchCampaignDataOptions> = props => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [campaign, setCampaign] = useState<CampaignData>();

  useEffect(() => {
    let intervalId: any = undefined;

    (async () => {
      const campaignsFetched = await fetchCampaignData(props);
      setCampaigns(campaignsFetched);

      if (props.changeInterval !== undefined) {
        intervalId = setInterval(() => {
          const nextCampaign = campaignsFetched[Math.floor(Math.random() * campaignsFetched.length)];
          setCampaign(nextCampaign);
        }, props.changeInterval * 1000);
      }
    })();

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    }
  }, []);

  return (
    <>
      {props.render(campaign, campaigns)}
    </>
  );
}