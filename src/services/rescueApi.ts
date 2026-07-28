import { api } from '../store/api';

export const rescueApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVolunteers: builder.query({
      query: () => '/volunteers',
      transformResponse: (response: any) => {
        let list = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && Array.isArray(response.content)) {
          list = response.content;
        } else if (response && Array.isArray(response.data)) {
          list = response.data;
        } else if (response && response.data && Array.isArray(response.data.content)) {
          list = response.data.content;
        }
        if (!list || list.length === 0) return [];
        return list.filter((item: any) => item != null).map((item: any) => ({
          ...item,
          id: String(item.id || item.volunteerId || ''),
          name: item.name || item.fullName || '',
          skills: item.skills || [],
          status: item.availabilityStatus || item.status || '',
          location: item.location || ''
        }));
      },
    }),
    getRescueTasks: builder.query({
      query: () => '/sos',
      transformResponse: (response: any) => {
        let list = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && Array.isArray(response.content)) {
          list = response.content;
        } else if (response && Array.isArray(response.data)) {
          list = response.data;
        } else if (response && response.data && Array.isArray(response.data.content)) {
          list = response.data.content;
        }
        if (!list || list.length === 0) return [];
        return list.filter((item: any) => item != null).map((item: any) => ({
          ...item,
          id: String(item.id || item.sosRequestId || ''),
          title: item.description || item.disasterType || '',
          priority: item.emergencyPriority || item.priority || '',
          status: item.status || ''
        }));
      },
    }),
    getRescueOperations: builder.query({
      query: () => '/sos',
    }),
    assignVolunteer: builder.mutation({
      query: (body) => ({
        url: '/rescue/assign',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetVolunteersQuery, useGetRescueTasksQuery, useGetRescueOperationsQuery, useAssignVolunteerMutation } = rescueApi;
