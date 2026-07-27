import { api } from '../store/api';

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUserInfo: builder.query<any, void>({
      query: () => '/users/profile',
    }),
  }),
});

export const { useLoginMutation, useGetUserInfoQuery } = authApi;
