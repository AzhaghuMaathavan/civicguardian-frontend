import { api } from '../store/api';

export const predictionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloodPredictions: builder.query<any, void>({
      query: () => '/risk/overview',
    }),
  }),
});
export const { useGetFloodPredictionsQuery } = predictionApi;
