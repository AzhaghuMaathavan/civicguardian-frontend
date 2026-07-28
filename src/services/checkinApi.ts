import { api } from '../store/api';

export const checkinApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getHighRiskCitizens: builder.query<any, void>({
      query: () => '/safety/checkin/history',
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
export const { useGetHighRiskCitizensQuery } = checkinApi;
