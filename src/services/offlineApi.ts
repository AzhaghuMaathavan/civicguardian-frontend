import { api } from '../store/api';

export const offlineApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSyncStatus: builder.query<any, void>({
      query: () => '/offline/status',
    }),
  }),
});
export const { useGetSyncStatusQuery } = offlineApi;
