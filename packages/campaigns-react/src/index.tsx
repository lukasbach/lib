import { fetchCampaignData, CampaignData, FetchCampaignDataOptions, CampaignService } from "@lukasbach/campaigns-fetch";
import * as React from 'react';
import { useEffect, useState } from 'react';

export const Campaign: React.FC<{
  render: (campaign: CampaignData | undefined, all: CampaignData[]) => JSX.Element | string;
  /** Change interval in seconds */
  changeInterval?: number;
  weighted?: boolean;
  dontRenderIfLoading?: boolean;
} & FetchCampaignDataOptions> = props => {
  const [service, setService] = useState<CampaignService>();
  const [campaign, setCampaign] = useState<CampaignData>();
  const weighted = props.weighted ?? true;

  useEffect(() => {
    let intervalId: any = undefined;

    (async () => {
      const campaignService = await fetchCampaignData(props);
      setService(campaignService);

      setCampaign(weighted ? campaignService.chooseCampaignWeighted() : campaignService.chooseCampaign);

      if (props.changeInterval !== undefined) {
        intervalId = setInterval(() => {
          setCampaign(weighted ? campaignService.chooseCampaignWeighted() : campaignService.chooseCampaign);
        }, props.changeInterval * 1000);
      }
    })();

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    }
  }, []);

  if (props.dontRenderIfLoading && !service) {
    return null;
  }

  return (
    <>
      {props.render(campaign, service?.campaigns ?? [])}
    </>
  );
}
