import { api } from '../store/api';

export const personalizationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserPreferences: builder.query<any, void>({
      query: () => '/users/profile/preferences',
    }),
    getRecommendation: builder.query<any, string>({
      query: (citizenId) => `/ai/recommend/${citizenId}`,
      providesTags: (result, error, id) => [{ type: 'AI', id }],
    }),
    getHistory: builder.query<any[], string>({
      query: (citizenId) => `/ai/history/${citizenId}`,
      providesTags: (result, error, id) => [{ type: 'AI', id: `HISTORY_${id}` }],
    }),
    generateRecommendation: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai/recommend',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'AI', id: arg.citizen_id }, { type: 'AI', id: `HISTORY_${arg.citizen_id}` }],
    }),
    personalizeAlert: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai/personalize',
        method: 'POST',
        body,
      }),
    }),
  }),
});
export const { 
  useGetUserPreferencesQuery,
  useGetRecommendationQuery: useGetAiRecommendationQuery,
  useGetHistoryQuery: useGetAiAlertsQuery,
  useGenerateRecommendationMutation: useGenerateAiRecommendationMutation,
  usePersonalizeAlertMutation: useGenerateAiAlertMutation
} = personalizationApi;
