import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://cgapi.shyxon.com/api/v1', // Gateway URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Alerts', 'Citizens', 'Shelters', 'Map', 'AI'],
  endpoints: (builder) => ({
    getAlerts: builder.query<any[], void>({
      query: () => '/alerts/active',
      providesTags: ['Alerts'],
    }),
    getShelters: builder.query<any[], void>({
      query: () => '/shelters',
      providesTags: ['Shelters'],
    }),
    getCitizenAnalytics: builder.query<any, void>({
      query: () => '/analytics/citizens',
      providesTags: ['Citizens'],
    }),
    getCommandDashboard: builder.query<any, void>({
      query: () => '/command',
      providesTags: ['Alerts'],
    }),
    getRiskAnalytics: builder.query<any, void>({
      query: () => '/risk/analytics',
      providesTags: ['Citizens'],
    }),
    // AI Digital Twin Service Endpoints
    searchCitizens: builder.query<any, { name?: string; email?: string; phone?: string; page?: number; size?: number }>({
      query: (params) => ({
        url: '/citizens',
        params,
      }),
      providesTags: ['Citizens'],
    }),
    getCitizenProfile: builder.query<any, string>({
      query: (citizenId) => `/citizens/${citizenId}`,
    }),
    getMedicalProfile: builder.query<any, string>({
      query: (citizenId) => `/citizens/${citizenId}/medical`,
    }),
    getEmergencyContacts: builder.query<any, string>({
      query: (citizenId) => `/citizens/${citizenId}/emergency-contacts`,
    }),
    getAccessibilityProfile: builder.query<any, string>({
      query: (citizenId) => `/citizens/${citizenId}/accessibility`,
    }),
    getCitizenLocation: builder.query<any, string>({
      query: (citizenId) => `/citizens/${citizenId}/location`,
    }),
    getCitizenQr: builder.query<any, string>({
      query: (citizenId) => `/citizens/${citizenId}/qr`,
    }),
    getProfileCompletion: builder.query<any, string>({
      query: (citizenId) => `/citizens/${citizenId}/completion`,
    }),
  }),
});

export const { 
  useGetAlertsQuery, 
  useGetSheltersQuery, 
  useGetCitizenAnalyticsQuery, 
  useGetCommandDashboardQuery, 
  useGetRiskAnalyticsQuery,
  useSearchCitizensQuery,
  useGetCitizenProfileQuery,
  useGetMedicalProfileQuery,
  useGetEmergencyContactsQuery,
  useGetAccessibilityProfileQuery,
  useGetCitizenLocationQuery,
  useGetCitizenQrQuery,
  useGetProfileCompletionQuery
} = api;
