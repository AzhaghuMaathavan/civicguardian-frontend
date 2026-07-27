import { api } from '../store/api';

export const citizenApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCitizens: builder.query<any, void>({
      query: () => '/citizens',
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
    getCitizenById: builder.query<any, string>({
      query: (id) => `/citizens/${id}`,
    }),
  }),
});
export const { useGetCitizensQuery, useGetCitizenByIdQuery } = citizenApi;
