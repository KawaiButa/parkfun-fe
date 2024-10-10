import axios from "axios";

import { constants } from "@/constants";
import { AzureRoute } from "@/hooks/azureRoute";

export const AzureAPI = {
  routing: async (origin: number[], destination: number[] | number[][]) => {
    const res = await axios.post(
      "https://atlas.microsoft.com/route/matrix/sync/json?api-version=1.0&subscription-key=" + constants.AZURE_MAP_KEY,
      {
        origins: {
          type: "MultiPoint",
          coordinates: [destination],
        },
        destinations: {
          type: "MultiPoint",
          coordinates: [origin],
        },
      }
    );
    if (res.status == 200) {
      return (res.data.matrix[0] as { statusCode: number; response: { routeSummary: AzureRoute } }[]).map(
        ({ response: { routeSummary } }) => routeSummary
      ) as AzureRoute[];
    }
    else return [];
  },
};
