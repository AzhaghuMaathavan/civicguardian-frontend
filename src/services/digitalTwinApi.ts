import { api } from '../store/api';

export const digitalTwinApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCityMetrics: builder.query<any, void>({
      query: () => '/command/overview',
    }),
    getInfrastructureStatus: builder.query<any, void>({
      query: () => '/command/infrastructure',
      transformResponse: (response: any) => {
        let list = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && Array.isArray(response.content)) {
          list = response.content;
        }
        return list;
      },
    }),
  }),
});
export const { useGetCityMetricsQuery, useGetInfrastructureStatusQuery } = digitalTwinApi;
